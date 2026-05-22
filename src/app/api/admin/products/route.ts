import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const db = createServiceClient();
  const { productData, variants } = await request.json() as {
    productData: { name: string; subtitle: string; slug: string; price: number; category: string; description_html: string; active: boolean; images: string[] };
    variants: { size: string; stock: number }[];
  };

  const { data, error: insertError } = await db
    .from('products')
    .insert({
      name: productData.name,
      subtitle: productData.subtitle,
      slug: productData.slug,
      price: productData.price,
      category: productData.category,
      description_html: productData.description_html,
      active: productData.active,
      images: productData.images,
    })
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
      await db.from('products').delete().eq('id', data.id);
      return NextResponse.json({ error: variantError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ id: data.id });
}
