import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const rawSession = event.data.object as Stripe.Checkout.Session;
  const db = createServiceClient();

  // Idempotency — skip duplicate events
  const { data: existing } = await db
    .from('orders')
    .select('id')
    .eq('stripe_session_id', rawSession.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true });
  }

  // Retrieve the full session so all fields (shipping_details, metadata, etc.) are present
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(rawSession.id);
  } catch (err) {
    console.error('Webhook: failed to retrieve session from Stripe:', err);
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }

  const shippingDetails = (session as unknown as { shipping_details?: { address?: unknown } }).shipping_details;
  const shippingAddress = shippingDetails?.address ?? session.customer_details?.address ?? null;

  const items: {
    productId: string;
    variantId: string;
    size: string;
    quantity: number;
    price: number;
  }[] = JSON.parse(session.metadata?.items ?? '[]');

  // Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      status: 'paid',
      total: session.amount_total ?? 0,
      shipping: session.shipping_cost?.amount_total ?? 12900,
      customer_email: session.customer_details?.email ?? null,
      customer_name: session.customer_details?.name ?? null,
      shipping_address: shippingAddress,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('[webhook] Failed to create order:', orderError);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // Create order items + decrement stock
  if (items.length > 0) {
    const { error: itemsError } = await db.from('order_items').insert(
      items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    if (itemsError) {
      console.error('Webhook: failed to create order items:', itemsError);
    }

    for (const item of items) {
      const { error: stockError } = await db.rpc('decrement_stock', {
        p_variant_id: item.variantId,
        p_qty: item.quantity,
      });
      if (stockError) {
        console.error(`Webhook: failed to decrement stock for variant ${item.variantId}:`, stockError);
      }
    }
  }

  console.log(`Order ${order.id} created for session ${session.id}`);
  return NextResponse.json({ received: true });
}
