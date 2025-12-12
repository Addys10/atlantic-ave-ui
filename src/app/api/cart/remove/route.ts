import { NextResponse } from 'next/server';
import { removeFromCart } from '@/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lineIds } = body;

    if (!cartId || !lineIds || !Array.isArray(lineIds)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const data = await removeFromCart(cartId, lineIds);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se odstranit z košíku' },
      { status: 500 }
    );
  }
}
