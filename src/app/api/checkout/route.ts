import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { CartItem } from '@/types/cart';

export async function POST(request: Request) {
  try {
    const { items }: { items: CartItem[] } = await request.json();

    if (!items?.length) {
      return NextResponse.json(
        { error: 'Košík je prázdný' },
        { status: 400 }
      );
    }

    // Validate stock before creating Stripe session
    const db = createServiceClient();
    const variantIds = items.map(i => i.variantId);

    const { data: variants, error: stockError } = await db
      .from('product_variants')
      .select('id, stock')
      .in('id', variantIds);

    if (stockError || !variants) {
      return NextResponse.json(
        { error: 'Nepodařilo se ověřit dostupnost zboží' },
        { status: 500 }
      );
    }

    const stockMap = new Map(variants.map(v => [v.id, v.stock]));
    const unavailable = items
      .filter(item => (stockMap.get(item.variantId) ?? 0) < item.quantity)
      .map(item => `${item.name} / ${item.selectedSize}`);

    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: 'Některé položky nejsou skladem', items: unavailable },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: item.name,
            description: `Velikost: ${item.selectedSize}`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 12900, currency: 'czk' },
            display_name: 'Standardní doručení',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      // Store cart metadata for the webhook to use when writing the order
      metadata: {
        items: JSON.stringify(
          items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            size: i.selectedSize,
            quantity: i.quantity,
            price: Math.round(i.price * 100),
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit platební relaci' },
      { status: 500 }
    );
  }
}
