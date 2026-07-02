import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * For each variant id, returns how many units are currently reserved by open
 * Stripe checkout sessions (not consumed and not expired). Missing ids map to 0.
 *
 * Uses one bulk query instead of per-variant `variant_available_stock` RPC calls
 * so the products / product-detail endpoints stay a single round-trip.
 */
export async function getReservedByVariant(
  db: SupabaseClient,
  variantIds: string[]
): Promise<Map<string, number>> {
  const reserved = new Map<string, number>();
  if (variantIds.length === 0) return reserved;

  const { data } = await db
    .from('stock_reservations')
    .select('variant_id, quantity')
    .in('variant_id', variantIds)
    .eq('consumed', false)
    .gt('expires_at', new Date().toISOString());

  for (const row of data ?? []) {
    const current = reserved.get(row.variant_id) ?? 0;
    reserved.set(row.variant_id, current + row.quantity);
  }

  return reserved;
}
