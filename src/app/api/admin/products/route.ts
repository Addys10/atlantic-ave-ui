import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const db = createServiceClient();
  const { productData, variants } = await request.json();

  const { data, error: insertError } = await db
    .from('products')
    .insert(productData)
    .select('id')
    .single();

  if (insertError || !data) {
    return NextResponse.json({ error: insertError?.message ?? 'Insert failed' }, { status: 500 });
  }

  if (variants.length > 0) {
    const { error: variantError } = await db.from('product_variants').insert(
      variants.map((v: { size: string; stock: number }) => ({
        product_id: data.id,
        size: v.size,
        stock: v.stock,
      }))
    );
    if (variantError) {
      return NextResponse.json({ error: variantError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ id: data.id });
}
