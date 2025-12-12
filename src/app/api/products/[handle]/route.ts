import { NextResponse } from 'next/server';
import { getProductByHandle } from '@/lib/shopify';

// Revalidate každých 120 sekund (detaily produktů se mění méně často)
export const revalidate = 120;

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

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst produkt' },
      { status: 500 }
    );
  }
}
