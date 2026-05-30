import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db.from('settings').select('value').eq('key', 'restock_open').single();
  return NextResponse.json({ open: data?.value === true || data?.value === 'true', _debug: { data, error } });
}
