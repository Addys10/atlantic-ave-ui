'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronUp, MapPin, Mail, Package, CreditCard } from 'lucide-react';

interface ShippingAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

interface OrderItem {
  id: string;
  size: string;
  quantity: number;
  price: number;
  products: { name: string; images: string[]; slug: string } | null;
}

interface Order {
  id: string;
  stripe_session_id: string;
  status: string;
  total: number;
  shipping: number;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Čeká',
  paid: 'Zaplaceno',
  shipped: 'Odesláno',
  cancelled: 'Zrušeno',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

function formatAddress(addr: ShippingAddress | null): string[] {
  if (!addr) return [];
  const lines: string[] = [];
  if (addr.line1) lines.push(addr.line1);
  if (addr.line2) lines.push(addr.line2);
  const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(' ');
  if (cityLine) lines.push(cityLine);
  if (addr.state) lines.push(addr.state);
  if (addr.country) lines.push(addr.country);
  return lines;
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select(`
        id, stripe_session_id, status, total, shipping,
        customer_email, customer_name, shipping_address, created_at,
        order_items ( id, size, quantity, price, products ( name, images, slug ) )
      `)
      .order('created_at', { ascending: false });
    setOrders((data as unknown as Order[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  function OrderDetail({ order }: { order: Order }) {
    const addressLines = formatAddress(order.shipping_address);
    const itemsTotal = order.total - order.shipping;

    return (
      <div className="bg-gray-50 border-t border-gray-100 p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Customer */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Mail size={12} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Zákazník</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{order.customer_name ?? '—'}</p>
            <p className="text-sm text-gray-500">{order.customer_email ?? '—'}</p>
          </div>

          {/* Shipping address */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doručovací adresa</span>
            </div>
            {addressLines.length > 0 ? (
              <div className="space-y-0.5">
                {addressLines.map((line, i) => (
                  <p key={i} className="text-sm text-gray-700">{line}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Adresa není k dispozici</p>
            )}
          </div>

          {/* Order meta */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <CreditCard size={12} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail objednávky</span>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-14 flex-shrink-0">ID</span>
                <span className="text-gray-700 font-mono text-xs">{shortId(order.id)}</span>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-400 w-14 flex-shrink-0">Datum</span>
                <span className="text-gray-700 text-xs">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex gap-2 text-sm items-start">
                <span className="text-gray-400 w-14 flex-shrink-0 mt-0.5">Stripe</span>
                <span className="text-gray-400 font-mono text-[10px] break-all leading-tight">{order.stripe_session_id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center gap-1.5 mb-3">
            <Package size={12} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Položky</span>
          </div>
          <div className="space-y-2">
            {order.order_items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                {item.products?.images?.[0] ? (
                  <img
                    src={item.products.images[0]}
                    alt={item.products.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.products?.name ?? '—'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Velikost: {item.size} &nbsp;·&nbsp; Množství: {item.quantity}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {(item.price * item.quantity / 100).toLocaleString('cs-CZ')} Kč
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.quantity} × {(item.price / 100).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5 max-w-xs ml-auto">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Mezisoučet</span>
              <span>{(itemsTotal / 100).toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Doprava</span>
              <span>{(order.shipping / 100).toLocaleString('cs-CZ')} Kč</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 pt-1.5 border-t border-gray-200">
              <span>Celkem</span>
              <span>{(order.total / 100).toLocaleString('cs-CZ')} Kč</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Objednávky</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-800" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Žádné objednávky</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {orders.map(order => (
              <div key={order.id}>
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{order.customer_name ?? '—'}</p>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{order.customer_email ?? '—'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-900">
                        {(order.total / 100).toLocaleString('cs-CZ')} Kč
                      </span>
                      <select
                        value={order.status}
                        onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-gray-400 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <span className="text-gray-400">
                        {expanded === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </span>
                    </div>
                  </div>
                </div>
                {expanded === order.id && <OrderDetail order={order} />}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Zákazník</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Adresa</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Celkem</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => {
                  const addrLines = formatAddress(order.shipping_address);
                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-gray-700">
                            {new Date(order.created_at).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.created_at).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-gray-900">{order.customer_name ?? '—'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.customer_email ?? '—'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {addrLines.length > 0 ? (
                            <div>
                              <p className="text-sm text-gray-700">{addrLines[0]}</p>
                              {addrLines[2] && (
                                <p className="text-xs text-gray-400 mt-0.5">{addrLines[2]}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-900">
                          {(order.total / 100).toLocaleString('cs-CZ')} Kč
                        </td>
                        <td className="px-5 py-3.5 text-center" onClick={e => e.stopPropagation()}>
                          <select
                            value={order.status}
                            onChange={e => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-gray-400 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {Object.entries(STATUS_LABELS).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400">
                          {expanded === order.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </td>
                      </tr>
                      {expanded === order.id && (
                        <tr key={`${order.id}-detail`}>
                          <td colSpan={6} className="p-0">
                            <OrderDetail order={order} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
