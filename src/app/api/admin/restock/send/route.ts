import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { createServiceClient } from '@/lib/supabase';
import { sendRestockPayEmail, type RestockPayEmailItem } from '@/lib/email';

const TOKEN_TTL_DAYS = 3;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as {
    interestId?: string;
  } | null;

  if (!body?.interestId) {
    return NextResponse.json({ error: 'Chybí interestId' }, { status: 400 });
  }

  const db = createServiceClient();

  const { data: interest, error: interestError } = await db
    .from('restock_interests')
    .select('id, first_name, email, items')
    .eq('id', body.interestId)
    .single();

  if (interestError || !interest) {
    return NextResponse.json({ error: 'Zájemce nenalezen' }, { status: 404 });
  }

  const rawItems = (interest as { items?: unknown }).items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json({ error: 'Žádné položky' }, { status: 400 });
  }

  // Resolve each requested (product_slug, size) into (product, variant).
  // Silently skip items whose product is inactive or whose variant is missing.
  const resolved: {
    product: { id: string; name: string; price: number };
    variant: { id: string; size: string };
  }[] = [];

  for (const raw of rawItems as { product_slug?: string; size?: string }[]) {
    if (!raw?.product_slug || !raw?.size) continue;

    const { data: product } = await db
      .from('products')
      .select('id, slug, name, price, active')
      .eq('slug', raw.product_slug)
      .single();

    if (!product || !product.active) continue;

    const { data: variant } = await db
      .from('product_variants')
      .select('id, size')
      .eq('product_id', product.id)
      .eq('size', raw.size)
      .single();

    if (!variant) continue;

    resolved.push({
      product: { id: product.id, name: product.name, price: Number(product.price) },
      variant: { id: variant.id, size: variant.size },
    });
  }

  if (resolved.length === 0) {
    return NextResponse.json({ error: 'Žádná z položek není dostupná' }, { status: 400 });
  }

  const token = randomBytes(24).toString('base64url');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  const { error: tokenError } = await db.from('restock_payment_tokens').insert({
    token,
    restock_interest_id: interest.id,
    items: resolved.map(r => ({ product_id: r.product.id, variant_id: r.variant.id })),
    expires_at: expiresAt.toISOString(),
  });

  if (tokenError) {
    return NextResponse.json({ error: tokenError.message }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const payUrl = `${baseUrl}/pay/${token}`;

  const emailItems: RestockPayEmailItem[] = resolved.map(r => ({
    productName: r.product.name,
    size: r.variant.size,
    priceKc: r.product.price,
  }));

  try {
    await sendRestockPayEmail({
      to: interest.email,
      firstName: interest.first_name,
      items: emailItems,
      payUrl,
      expiresAt,
    });
  } catch (err) {
    // Roll back the token so a failed send doesn't leave a dangling record
    await db.from('restock_payment_tokens').delete().eq('token', token);
    console.error('[restock/send] email failed:', err);
    return NextResponse.json({ error: 'Nepodařilo se odeslat email' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, token, expiresAt: expiresAt.toISOString(), sent: resolved.length });
}
