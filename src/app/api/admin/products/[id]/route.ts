import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = createServiceClient();
  const { productData, variants, origVariantIds } = await request.json();

  const { error: updateError } = await db
    .from('products')
    .update(productData)
    .eq('id', params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (variants.length > 0) {
    const { error: variantError } = await db.from('product_variants').upsert(
      variants.map((v: { id?: string; size: string; stock: number }) => ({
        ...(v.id ? { id: v.id } : {}),
        product_id: params.id,
        size: v.size,
        stock: v.stock,
      }))
    );
    if (variantError) {
      return NextResponse.json({ error: variantError.message }, { status: 500 });
    }
  }

  const keepIds = new Set(variants.filter((v: { id?: string }) => v.id).map((v: { id: string }) => v.id));
  const toDelete = (origVariantIds as string[]).filter(id => !keepIds.has(id));
  for (const id of toDelete) {
    const { error } = await db.from('product_variants').delete().eq('id', id);
    if (error && error.code !== '23503') console.error(`Failed to delete variant ${id}:`, error);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const db = createServiceClient();
  const { error } = await db.from('products').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
