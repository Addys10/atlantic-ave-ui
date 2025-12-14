import { NextResponse } from 'next/server';
import { getShopPolicies } from '@/lib/shopify';

export async function GET() {
  try {
    const data = await getShopPolicies();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se načíst obchodní podmínky' },
      { status: 500 }
    );
  }
}
