import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from('restock_interests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string };
  const db = createServiceClient();
  const { error } = await db.from('restock_interests').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
