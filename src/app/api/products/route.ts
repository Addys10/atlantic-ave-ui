import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

// Revalidate každých 60 sekund
export const revalidate = 60;

export async function GET() {
  try {
    const data = await getProducts(50);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkty' },
      { status: 500 }
    );
  }
}
