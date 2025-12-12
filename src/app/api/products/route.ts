import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

export async function GET() {
  try {
    const data = await getProducts(50);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkty' },
      { status: 500 }
    );
  }
}
