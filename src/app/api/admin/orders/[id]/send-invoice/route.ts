import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/email';
import { InvoiceOrder } from '@/lib/invoice';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const db = createServiceClient();

  const { data: order, error } = await db
    .from('orders')
    .select(`
      id, created_at, customer_name, customer_email, shipping_address, total, shipping,
      order_items ( id, size, quantity, price, products ( name ) )
    `)
    .eq('id', params.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (!order.customer_email) {
    return NextResponse.json({ error: 'Order has no customer email' }, { status: 400 });
  }

  try {
    await sendInvoiceEmail(order as unknown as InvoiceOrder);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-invoice] Failed:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
