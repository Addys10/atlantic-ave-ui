import { NextResponse } from 'next/server';
import { getProductByHandle } from '@/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const data = await getProductByHandle(params.handle);

    if (!data.productByHandle) {
      return NextResponse.json(
        { error: 'Produkt nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkt' },
      { status: 500 }
    );
  }
}
