'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  active: boolean;
  images: string[];
  product_variants: { stock: number }[];
}

function totalStock(p: Product) {
  return p.product_variants.reduce((s, v) => s + v.stock, 0);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, active, images, product_variants(stock)')
      .order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Produkty</h1>
        <Link
          href="/admin/products/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Nový produkt
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-800" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-3">Žádné produkty</p>
          <Link href="/admin/products/new" className="text-sm text-gray-900 underline underline-offset-2">
            Přidat první produkt
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {products.map(product => (
              <div key={product.id} className="p-4 flex gap-3 items-start">
                {product.images[0] ? (
                  <img src={product.images[0]} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="text-sm font-semibold text-gray-900">{Number(product.price).toLocaleString('cs-CZ')} Kč</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{totalStock(product)} ks</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {product.active ? 'Aktivní' : 'Skrytý'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap">Upravit →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Produkt</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sklad</th>
                  <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stav</th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt="" className="w-9 h-9 object-cover rounded-md flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 bg-gray-100 rounded-md flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold text-gray-900">
                      {Number(product.price).toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`text-sm font-medium ${totalStock(product) === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {totalStock(product)} ks
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.active ? 'Aktivní' : 'Skrytý'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap">Upravit →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
