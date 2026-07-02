import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { SHIPPING_HALERE } from '@/lib/constants';

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

  let items: {
    productId: string;
    variantId: string;
    size: string;
    quantity: number;
    price: number;
  }[];

  try {
    items = JSON.parse(session.metadata?.items ?? '[]');
  } catch {
    console.error('[webhook] Failed to parse items metadata for session', session.id);
    return NextResponse.json({ error: 'Invalid items metadata' }, { status: 500 });
  }

  if (items.length === 0) {
    console.error('[webhook] Empty items for session', session.id);
    return NextResponse.json({ error: 'No items in session' }, { status: 500 });
  }

  // Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      stripe_session_id: session.id,
      status: 'paid',
      total: session.amount_total ?? 0,
      shipping: session.shipping_cost?.amount_total ?? SHIPPING_HALERE,
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

  // Create order items — if this fails, delete the order so Stripe retries cleanly
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
    console.error('[webhook] Failed to create order items:', itemsError);
    await db.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
  }

  const restockToken = session.metadata?.restock_token ?? null;

  // Restock orders bypass stock tracking entirely — inventory for these is
  // handled manually by the admin outside the shop's public stock.
  if (!restockToken) {
    for (const item of items) {
      const { error: stockError } = await db.rpc('decrement_stock', {
        p_variant_id: item.variantId,
        p_qty: item.quantity,
      });
      if (stockError) {
        console.error(`[webhook] Failed to decrement stock for variant ${item.variantId}:`, stockError);
      }
    }
  } else {
    const { error: tokenError } = await db
      .from('restock_payment_tokens')
      .update({ used_at: new Date().toISOString(), order_id: order.id })
      .eq('token', restockToken);
    if (tokenError) {
      console.error(`[webhook] Failed to mark restock token used:`, tokenError);
    }
  }

  console.log(`[webhook] Order ${order.id} created for session ${session.id}${restockToken ? ' (restock)' : ''}`);

  // Send invoice email — fetch full order with items for the PDF
  if (session.customer_details?.email) {
    try {
      const { data: fullOrder } = await db
        .from('orders')
        .select(`
          id, created_at, customer_name, customer_email, shipping_address, total, shipping,
          order_items ( id, size, quantity, price, products ( name ) )
        `)
        .eq('id', order.id)
        .single();

      if (fullOrder) {
        const { sendInvoiceEmail } = await import('@/lib/email');
        await sendInvoiceEmail(fullOrder as unknown as Parameters<typeof sendInvoiceEmail>[0]);
        console.log(`[webhook] Invoice email sent for order ${order.id}`);
      }
    } catch (emailErr) {
      // Non-fatal — order is already created, email failure should not fail the webhook
      console.error(`[webhook] Failed to send invoice email for order ${order.id}:`, emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
