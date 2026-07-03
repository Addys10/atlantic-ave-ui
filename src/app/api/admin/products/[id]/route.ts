import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';

const log = createLogger('admin/products');

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = createServiceClient();
  const { productData, variants, origVariantIds } = await request.json() as {
    productData: { name: string; subtitle: string; slug: string; price: number; category: string; description_html: string; active: boolean; images: string[] };
    variants: { id?: string; size: string; stock: number }[];
    origVariantIds: string[];
  };

  const { error: updateError } = await db
    .from('products')
    .update({
      name: productData.name,
      subtitle: productData.subtitle,
      slug: productData.slug,
      price: productData.price,
      category: productData.category,
      description_html: productData.description_html,
      active: productData.active,
      images: productData.images,
    })
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

  const keepIds = new Set(variants.filter(v => v.id).map(v => v.id!));
  const toDelete = (origVariantIds as string[]).filter(id => !keepIds.has(id));
  for (const id of toDelete) {
    const { error } = await db.from('product_variants').delete().eq('id', id);
    if (error && error.code !== '23503') log.error(`failed to delete variant ${id}`, error);
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
