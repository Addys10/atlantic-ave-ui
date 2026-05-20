import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    const products: Product[] = (data ?? []).map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: (p as any).subtitle ?? '',
      description: p.description_html,
      price: Number(p.price),
      image: p.images[0] ?? '',
      images: p.images,
      category: p.category,
      sizes: (p.product_variants as { id: string; size: string; stock: number }[])
        .map(v => ({ id: v.id, name: v.size, available: v.stock > 0, stock: v.stock })),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkty' },
      { status: 500 }
    );
  }
}
