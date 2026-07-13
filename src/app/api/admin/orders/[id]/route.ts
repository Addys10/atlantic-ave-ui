import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';

const log = createLogger('delete-order');

// Permanently delete an order. The service client bypasses RLS but NOT foreign
// keys, so we first detach any restock_payment_tokens pointing at this order
// (that FK has no ON DELETE cascade and is what blocks deletion in the Supabase
// UI). We keep used_at set so a detached token can't be reused for a new payment.
// order_items has ON DELETE cascade, but we delete it explicitly too in case the
// live schema drifted from supabase/schema.sql.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const db = createServiceClient();
  const id = params.id;

  const { error: tokenError } = await db
    .from('restock_payment_tokens')
    .update({ order_id: null })
    .eq('order_id', id);
  if (tokenError) {
    log.error('failed to detach restock tokens', tokenError);
    return NextResponse.json({ error: tokenError.message, code: tokenError.code }, { status: 500 });
  }

  const { error: itemsError } = await db.from('order_items').delete().eq('order_id', id);
  if (itemsError) {
    log.error('failed to delete order items', itemsError);
    return NextResponse.json({ error: itemsError.message, code: itemsError.code }, { status: 500 });
  }

  const { error } = await db.from('orders').delete().eq('id', id);
  if (error) {
    log.error('failed to delete order', error);
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
