import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const db = createServiceClient();
  const { orderData, lineItems } = await request.json();

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert(orderData)
    .select('id')
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Insert failed' }, { status: 500 });
  }

  const { error: itemsError } = await db.from('order_items').insert(
    lineItems.map((item: { productId: string; variantId: string; size: string; quantity: number; unitPrice: number }) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      size: item.size,
      quantity: item.quantity,
      price: item.unitPrice,
    }))
  );

  if (itemsError) {
    await db.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  for (const item of lineItems as { variantId: string; quantity: number }[]) {
    await db.rpc('decrement_stock', { p_variant_id: item.variantId, p_qty: item.quantity });
  }

  return NextResponse.json({ id: order.id });
}
