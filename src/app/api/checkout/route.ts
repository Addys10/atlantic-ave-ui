import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { CartItem } from '@/types/cart';
import { SHIPPING_HALERE } from '@/lib/constants';
import { env } from '@/lib/env';

type IncomingItem = Pick<CartItem, 'variantId' | 'quantity'>;

function validateIncomingItems(raw: unknown): IncomingItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) return null;
  const out: IncomingItem[] = [];
  for (const it of raw) {
    if (!it || typeof it !== 'object') return null;
    const { variantId, quantity } = it as Record<string, unknown>;
    if (typeof variantId !== 'string' || variantId.length < 10) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return null;
    out.push({ variantId, quantity });
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const items = validateIncomingItems((body as { items?: unknown })?.items);

    if (!items) {
      return NextResponse.json({ error: 'Neplatný košík' }, { status: 400 });
    }

    const db = createServiceClient();
    const variantIds = items.map(i => i.variantId);

    // Fetch authoritative product + variant data from DB —
    // NEVER trust price, name, or image from the client.
    const { data: variants, error: stockError } = await db
      .from('product_variants')
      .select('id, stock, size, products ( id, name, price, active )')
      .in('id', variantIds);

    if (stockError || !variants) {
      return NextResponse.json(
        { error: 'Nepodařilo se ověřit dostupnost zboží' },
        { status: 500 }
      );
    }

    type VariantRow = {
      id: string;
      stock: number;
      size: string;
      products: { id: string; name: string; price: number; active: boolean } | null;
    };
    const variantMap = new Map(
      (variants as unknown as VariantRow[]).map(v => [v.id, v])
    );

    // Every requested variant must exist and belong to an active product.
    for (const item of items) {
      const v = variantMap.get(item.variantId);
      if (!v || !v.products?.active) {
        return NextResponse.json({ error: 'Produkt není dostupný' }, { status: 400 });
      }
    }

    const unavailable = items
      .filter(item => (variantMap.get(item.variantId)?.stock ?? 0) < item.quantity)
      .map(item => {
        const v = variantMap.get(item.variantId)!;
        return `${v.products!.name} / ${v.size}`;
      });

    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: 'Některé položky nejsou skladem', items: unavailable },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map(item => {
        const v = variantMap.get(item.variantId)!;
        return {
          price_data: {
            currency: 'czk',
            product_data: {
              name: v.products!.name,
              description: `Velikost: ${v.size}`,
            },
            unit_amount: Math.round(v.products!.price * 100),
          },
          quantity: item.quantity,
        };
      }),
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
      success_url: `${env.baseUrl()}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.baseUrl()}/checkout`,
      metadata: {
        items: JSON.stringify(
          items.map(item => {
            const v = variantMap.get(item.variantId)!;
            return {
              productId: v.products!.id,
              variantId: item.variantId,
              size: v.size,
              quantity: item.quantity,
              price: Math.round(v.products!.price * 100),
            };
          })
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
