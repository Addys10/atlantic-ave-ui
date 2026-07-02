import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { SHIPPING_HALERE } from '@/lib/constants';

interface TokenItem {
  product_id: string;
  variant_id: string;
}

export async function POST(_request: Request, { params }: { params: { token: string } }) {
  const db = createServiceClient();

  const { data: record } = await db
    .from('restock_payment_tokens')
    .select(`
      token, items, expires_at, used_at, order_id,
      restock_interests ( email )
    `)
    .eq('token', params.token)
    .single();

  if (!record) {
    return NextResponse.json({ error: 'Odkaz nenalezen' }, { status: 404 });
  }

  const row = record as unknown as {
    token: string;
    items: TokenItem[] | unknown;
    expires_at: string;
    used_at: string | null;
    order_id: string | null;
    restock_interests: { email: string } | null;
  };

  if (!row.restock_interests) {
    return NextResponse.json({ error: 'Odkaz nenalezen' }, { status: 404 });
  }

  if (row.used_at || row.order_id) {
    return NextResponse.json({ error: 'Objednávka již dokončena' }, { status: 409 });
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Odkaz vypršel' }, { status: 410 });
  }

  const itemRefs: TokenItem[] = Array.isArray(row.items) ? row.items : [];
  if (itemRefs.length === 0) {
    return NextResponse.json({ error: 'Prázdný odkaz' }, { status: 400 });
  }

  // Resolve authoritative price/name from DB — never trust client-side data.
  const productIds = Array.from(new Set(itemRefs.map(i => i.product_id)));
  const variantIds = Array.from(new Set(itemRefs.map(i => i.variant_id)));

  const [{ data: products }, { data: variants }] = await Promise.all([
    db.from('products').select('id, name, price, active').in('id', productIds),
    db.from('product_variants').select('id, size, product_id').in('id', variantIds),
  ]);

  const productMap = new Map((products ?? []).map(p => [p.id, p]));
  const variantMap = new Map((variants ?? []).map(v => [v.id, v]));

  const resolved = itemRefs.map(ref => {
    const product = productMap.get(ref.product_id);
    const variant = variantMap.get(ref.variant_id);
    if (!product || !variant || !product.active) return null;
    return { product, variant };
  });

  if (resolved.some(r => r === null)) {
    return NextResponse.json({ error: 'Některé produkty už nejsou dostupné' }, { status: 400 });
  }

  const items = resolved as { product: NonNullable<ReturnType<typeof productMap.get>>; variant: NonNullable<ReturnType<typeof variantMap.get>> }[];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(({ product, variant }) => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: product.name,
            description: `Velikost: ${variant.size}`,
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: 1,
      })),
      customer_email: row.restock_interests.email,
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_HALERE, currency: 'czk' },
            display_name: 'Standardní doručení',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${row.token}`,
      metadata: {
        restock_token: row.token,
        items: JSON.stringify(
          items.map(({ product, variant }) => ({
            productId: product.id,
            variantId: variant.id,
            size: variant.size,
            quantity: 1,
            price: Math.round(Number(product.price) * 100),
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[pay/checkout] Stripe error:', err);
    return NextResponse.json({ error: 'Nepodařilo se zahájit platbu' }, { status: 500 });
  }
}
