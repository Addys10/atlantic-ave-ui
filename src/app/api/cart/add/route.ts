import { NextResponse } from 'next/server';
import { addToCart } from '@/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lines } = body;

    if (!cartId || !lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const data = await addToCart(cartId, lines);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se přidat do košíku' },
      { status: 500 }
    );
  }
}
