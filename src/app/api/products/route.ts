import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { createServiceClient } from '@/lib/supabase';
import { Product } from '@/types/product';
import { createLogger } from '@/lib/logger';

const log = createLogger('products');

export const dynamic = 'force-dynamic';

export async function GET() {
  noStore();
  const supabase = createServiceClient();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, slug, name, subtitle, description_html, price, images, category,
        product_variants (id, size, stock)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    type Row = { id: string; slug: string; name: string; subtitle: string; description_html: string; price: number; images: string[]; category: string; product_variants: { id: string; size: string; stock: number }[] };
    const products: Product[] = ((data ?? []) as unknown as Row[]).map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle ?? '',
      description: p.description_html,
      price: Number(p.price),
      image: p.images[0] ?? '',
      images: p.images,
      category: p.category,
      sizes: p.product_variants.map(v => ({ id: v.id, name: v.size, available: v.stock > 0, stock: v.stock })),
    }));

    return NextResponse.json(products, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    log.error('error fetching products', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkty' },
      { status: 500 }
    );
  }
}
