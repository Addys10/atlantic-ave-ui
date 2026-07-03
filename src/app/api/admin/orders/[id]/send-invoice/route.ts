import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/email';
import { InvoiceOrder } from '@/lib/invoice';
import { createLogger } from '@/lib/logger';

const log = createLogger('send-invoice');

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
    const now = new Date().toISOString();
    await db.from('orders').update({ invoice_sent_at: now }).eq('id', params.id);
    return NextResponse.json({ ok: true, invoice_sent_at: now });
  } catch (err) {
    log.error('failed', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
