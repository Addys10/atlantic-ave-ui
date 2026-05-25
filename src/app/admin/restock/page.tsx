'use client';

import { useEffect, useState } from 'react';

interface RestockItem {
  product_slug: string;
  product_name: string;
  size: string;
}

interface RestockInterest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  items: RestockItem[];
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminRestockPage() {
  const [interests, setInterests] = useState<RestockInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/restock')
      .then(r => r.json())
      .then(data => {
        setInterests(Array.isArray(data) ? data as RestockInterest[] : []);
        setLoading(false);
      });
  }, []);

  async function deleteInterest(id: string) {
    if (!confirm('Smazat tuto registraci?')) return;
    setDeleting(id);
    await fetch('/api/admin/restock', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setInterests(prev => prev.filter(r => r.id !== id));
    setDeleting(null);
  }

  const total = interests.length;

  // Aggregate counts per product → size
  const stats: Record<string, Record<string, number>> = {};
  for (const r of interests) {
    for (const item of r.items) {
      if (!stats[item.product_name]) stats[item.product_name] = {};
      stats[item.product_name][item.size] = (stats[item.product_name][item.size] ?? 0) + 1;
    }
  }
  const statEntries = Object.entries(stats).sort((a, b) => {
    const sumA = Object.values(a[1]).reduce((s, n) => s + n, 0);
    const sumB = Object.values(b[1]).reduce((s, n) => s + n, 0);
    return sumB - sumA;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-gray-800" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Restock registrace</h1>
        <p className="text-sm text-gray-500 mt-1">
          {total} {total === 1 ? 'registrace' : total < 5 ? 'registrace' : 'registrací'}
        </p>
      </div>

      {statEntries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statEntries.map(([productName, sizes]) => {
            const totalForProduct = Object.values(sizes).reduce((s, n) => s + n, 0);
            const sortedSizes = Object.entries(sizes).sort((a, b) => b[1] - a[1]);
            return (
              <div key={productName} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <p className="font-medium text-gray-900 text-sm">{productName}</p>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded px-2 py-0.5 shrink-0">
                    {totalForProduct} celkem
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sortedSizes.map(([size, count]) => (
                    <div key={size} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5">
                      <span className="text-xs font-medium text-gray-700">{size}</span>
                      <span className="text-xs text-gray-400">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {interests.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Žádné registrace zatím.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Jméno</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Zájem</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Datum</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {interests.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-50 ${i % 2 !== 0 ? 'bg-gray-50/40' : ''}`}>
                  <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.items.map((item, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                        >
                          {item.product_name} · {item.size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteInterest(r.id)}
                      disabled={deleting === r.id}
                      className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                      title="Smazat"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
