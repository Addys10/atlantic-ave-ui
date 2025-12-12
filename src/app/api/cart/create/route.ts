import { NextResponse } from 'next/server';
import { createCart } from '@/lib/shopify';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lines } = body;

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const data = await createCart(lines);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit košík' },
      { status: 500 }
    );
  }
}
