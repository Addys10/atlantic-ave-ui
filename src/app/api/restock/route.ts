import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const db = createServiceClient();

  const { data: setting } = await db.from('settings').select('value').eq('key', 'restock_open').single();
  if (setting?.value !== 'true') {
    return NextResponse.json({ error: 'Restock není otevřen' }, { status: 403 });
  }

  const { first_name, last_name, email, items } = await req.json() as {
    first_name: string;
    last_name: string;
    email: string;
    items: { product_slug: string; product_name: string; size: string }[];
  };

  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !items?.length) {
    return NextResponse.json({ error: 'Vyplňte všechna pole' }, { status: 400 });
  }

  const { error } = await db.from('restock_interests').insert({ first_name, last_name, email, items });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
