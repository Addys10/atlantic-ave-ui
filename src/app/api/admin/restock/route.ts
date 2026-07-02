import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET() {
  const db = createServiceClient();
  const [interestsRes, tokensRes] = await Promise.all([
    db.from('restock_interests').select('*').order('created_at', { ascending: false }),
    db
      .from('restock_payment_tokens')
      .select('restock_interest_id, expires_at, used_at, order_id'),
  ]);

  if (interestsRes.error) {
    return NextResponse.json({ error: interestsRes.error.message }, { status: 500 });
  }

  // Pick the "best" token per interest with priority:
  //   1. paid (order_id set) — Zaplaceno
  //   2. non-expired active — Odesláno · zbývá X d
  //   3. otherwise none (all expired unused)
  type Token = { expires_at: string; used_at: string | null; order_id: string | null };
  const now = Date.now();
  const bestByInterest = new Map<string, Token>();

  for (const t of tokensRes.data ?? []) {
    const candidate: Token = { expires_at: t.expires_at, used_at: t.used_at, order_id: t.order_id };
    const existing = bestByInterest.get(t.restock_interest_id);

    const candidatePaid = candidate.order_id !== null;
    const existingPaid = existing?.order_id != null;
    const candidateActive = new Date(candidate.expires_at).getTime() > now;
    const existingActive = existing ? new Date(existing.expires_at).getTime() > now : false;

    if (!existing) {
      bestByInterest.set(t.restock_interest_id, candidate);
      continue;
    }

    // Paid beats everything.
    if (candidatePaid && !existingPaid) {
      bestByInterest.set(t.restock_interest_id, candidate);
      continue;
    }
    if (existingPaid) continue;

    // Both unpaid — active beats expired, otherwise latest.
    if (candidateActive && !existingActive) {
      bestByInterest.set(t.restock_interest_id, candidate);
      continue;
    }
    if (!candidateActive && existingActive) continue;

    if (new Date(candidate.expires_at).getTime() > new Date(existing.expires_at).getTime()) {
      bestByInterest.set(t.restock_interest_id, candidate);
    }
  }

  const interests = (interestsRes.data ?? []).map(i => ({
    ...i,
    active_token: bestByInterest.get(i.id) ?? null,
  }));

  return NextResponse.json(interests);
}

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string };
  const db = createServiceClient();
  const { error } = await db.from('restock_interests').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
