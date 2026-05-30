import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db.from('settings').select('key, value');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const settings = Object.fromEntries((data ?? []).map(r => [r.key, r.value]));
  return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
  const db = createServiceClient();
  const { key, value } = await req.json() as { key: string; value: string };
  const { error } = await db.from('settings').update({ value }).eq('key', key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
