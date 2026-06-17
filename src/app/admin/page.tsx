'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { TrendingUp, ShoppingBag, Clock, Package, ArrowRight } from 'lucide-react';
import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/order';

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  productCount: number;
}

interface StockProduct {
  productId: string;
  productName: string;
  productSlug: string;
  totalStock: number;
  variants: { size: string; stock: number }[];
}

interface RecentOrder {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  total: number;
  status: OrderStatus;
  created_at: string;
  itemCount: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function shortId(id: string) {
  return '#' + id.slice(0, 6).toUpperCase();
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [stockProducts, setStockProducts] = useState<StockProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    const [ordersRes, productsRes, variantsRes] = await Promise.all([
      supabase
        .from('orders')
        .select('id, total, status, customer_name, customer_email, created_at, order_items(id)')
        .order('created_at', { ascending: false }),
      supabase
        .from('products')
        .select('id, name, slug, active')
        .eq('active', true),
      supabase
        .from('product_variants')
        .select('id, size, stock, product_id, products(name, slug)')
        .order('stock', { ascending: true }),
    ]);

    const orders = (ordersRes.data ?? []) as {
      id: string; total: number; status: OrderStatus;
      customer_name: string | null; customer_email: string | null;
      created_at: string; order_items: { id: string }[];
    }[];

    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'shipped');
    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = orders.filter(o => o.status === 'pending').length;

    setStats({
      totalRevenue: revenue,
      totalOrders: orders.length,
      pendingOrders: pending,
      productCount: (productsRes.data ?? []).length,
    });

    const variants = (variantsRes.data ?? []) as unknown as {
      id: string; size: string; stock: number; product_id: string;
      products: { name: string; slug: string } | null;
    }[];

    const byProduct = new Map<string, StockProduct>();
    for (const v of variants) {
      if (!v.products) continue;
      const key = v.products.slug;
      if (!byProduct.has(key)) {
        byProduct.set(key, { productId: v.product_id, productName: v.products.name, productSlug: key, totalStock: 0, variants: [] });
      }
      const p = byProduct.get(key)!;
      p.variants.push({ size: v.size, stock: v.stock });
      p.totalStock += v.stock;
    }
    setStockProducts(Array.from(byProduct.values()));

    setRecentOrders(
      orders.slice(0, 6).map(o => ({
        id: o.id,
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
        itemCount: o.order_items.length,
      }))
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-5 md:p-8 space-y-6">
        <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-5 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Two-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[0, 1].map(col => (
            <div key={col} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-5 py-3">
                <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="divide-y divide-gray-100">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-2.5 w-44 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-3.5 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Tržby (zaplaceno)',
      value: stats ? `${(stats.totalRevenue / 100).toLocaleString('cs-CZ')} Kč` : '—',
      icon: <TrendingUp size={18} className="text-gray-500" />,
      sub: 'Paid + shipped',
    },
    {
      label: 'Objednávky celkem',
      value: stats?.totalOrders ?? '—',
      icon: <ShoppingBag size={18} className="text-gray-500" />,
      sub: 'Všechny statusy',
    },
    {
      label: 'Čekají na zpracování',
      value: stats?.pendingOrders ?? '—',
      icon: <Clock size={18} className={stats && stats.pendingOrders > 0 ? 'text-amber-500' : 'text-gray-500'} />,
      sub: stats && stats.pendingOrders > 0 ? 'Vyžadují pozornost' : 'Vše vyřešeno',
      highlight: stats && stats.pendingOrders > 0,
    },
    {
      label: 'Aktivní produkty',
      value: stats?.productCount ?? '—',
      icon: <Package size={18} className="text-gray-500" />,
      sub: 'Viditelné v shopu',
    },
  ];

  return (
    <div className="p-5 md:p-8 max-w-5xl w-full">

      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-900">Přehled</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`bg-white border rounded-xl p-4 md:p-5 ${card.highlight ? 'border-amber-200' : 'border-gray-200'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-snug">
                {card.label}
              </span>
              {card.icon}
            </div>
            <p className={`text-2xl font-bold tabular-nums ${card.highlight ? 'text-amber-600' : 'text-gray-900'}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Poslední objednávky</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              Zobrazit vše <ArrowRight size={12} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">
              Žádné objednávky
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <div key={order.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-400">{shortId(order.id)}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">
                      {order.customer_name ?? order.customer_email ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(order.created_at)} · {order.itemCount} {order.itemCount === 1 ? 'položka' : order.itemCount < 5 ? 'položky' : 'položek'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {(order.total / 100).toLocaleString('cs-CZ')} Kč
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock overview */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Sklad</h2>
            <Link href="/admin/products" className="text-xs text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
              Spravovat <ArrowRight size={12} />
            </Link>
          </div>

          {stockProducts.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-400">Žádné produkty</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {stockProducts.map(product => (
                <Link
                  key={product.productSlug}
                  href={`/admin/products/${product.productId}`}
                  className="block px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700">
                      {product.productName}
                    </p>
                    <span className={`flex-shrink-0 ml-3 text-xs font-semibold tabular-nums ${
                      product.totalStock === 0 ? 'text-red-500' : product.totalStock <= 5 ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {product.totalStock} ks celkem
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map(v => (
                      <span
                        key={v.size}
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          v.stock === 0
                            ? 'bg-red-50 text-red-400'
                            : v.stock <= 3
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {v.size} <span className="font-bold">{v.stock}</span>
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
