export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export const ORDER_STATUSES: readonly OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled'] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Čeká',
  paid: 'Zaplaceno',
  shipped: 'Odesláno',
  cancelled: 'Zrušeno',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-200 text-amber-900',
  paid: 'bg-emerald-200 text-emerald-900',
  shipped: 'bg-sky-200 text-sky-900',
  cancelled: 'bg-rose-200 text-rose-900',
};
