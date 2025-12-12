import { NextResponse } from 'next/server';
import { getCart } from '@/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: { cartId: string } }
) {
  try {
    const data = await getCart(params.cartId);

    if (!data.cart) {
      return NextResponse.json(
        { error: 'Košík nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst košík' },
      { status: 500 }
    );
  }
}
