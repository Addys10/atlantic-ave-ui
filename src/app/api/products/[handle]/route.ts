import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { createServiceClient } from '@/lib/supabase';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { handle: string } }
) {
  noStore();
  const supabase = createServiceClient();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, slug, name, subtitle, description_html, price, images, category,
        product_variants (id, size, stock)
      `)
      .eq('slug', params.handle)
      .eq('active', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Produkt nebyl nalezen' },
        { status: 404 }
      );
    }

    type Row = { id: string; slug: string; name: string; subtitle: string; description_html: string; price: number; images: string[]; category: string; product_variants: { id: string; size: string; stock: number }[] };
    const row = data as unknown as Row;
    const product: Product = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      subtitle: row.subtitle ?? '',
      description: row.description_html,
      price: Number(row.price),
      image: row.images[0] ?? '',
      images: row.images,
      category: row.category,
      sizes: row.product_variants.map(v => ({ id: v.id, name: v.size, available: v.stock > 0, stock: v.stock })),
    };

    return NextResponse.json(product, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkt' },
      { status: 500 }
    );
  }
}
