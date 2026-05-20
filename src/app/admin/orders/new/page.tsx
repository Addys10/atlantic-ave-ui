'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { X, Plus } from 'lucide-react';

interface Variant {
  id: string;
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  variants: Variant[];
}

interface LineItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  unitPrice: number; // haléře
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition placeholder:text-gray-400';

const SHIPPING_DEFAULT = 129;

export default function NewOrderPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [note, setNote] = useState('');
  const [shippingKc, setShippingKc] = useState(String(SHIPPING_DEFAULT));
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, product_variants(id, size, stock)')
      .eq('active', true)
      .order('name');

    const mapped: Product[] = (data ?? []).map((p: {
      id: string; name: string; price: number;
      product_variants: { id: string; size: string; stock: number }[];
    }) => ({
      id: p.id,
      name: p.name,
      price: Math.round(p.price * 100),
      variants: p.product_variants
        .slice()
        .sort((a, b) => ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(a.size) - ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(b.size)),
    }));
    setProducts(mapped);
    setLoadingProducts(false);
  }

  function addLineItem() {
    const first = products[0];
    const firstVariant = first?.variants[0];
    if (!first || !firstVariant) return;
    setLineItems(prev => [...prev, {
      productId: first.id,
      variantId: firstVariant.id,
      size: firstVariant.size,
      quantity: 1,
      unitPrice: first.price,
    }]);
  }

  function updateLineItem(index: number, field: Partial<LineItem>) {
    setLineItems(prev => prev.map((item, i) => i === index ? { ...item, ...field } : item));
  }

  function setLineProduct(index: number, productId: string) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const variant = product.variants[0];
    if (!variant) return;
    updateLineItem(index, {
      productId,
      variantId: variant.id,
      size: variant.size,
      unitPrice: product.price,
    });
  }

  function setLineVariant(index: number, variantId: string) {
    const item = lineItems[index];
    const product = products.find(p => p.id === item.productId);
    const variant = product?.variants.find(v => v.id === variantId);
    if (!variant) return;
    updateLineItem(index, { variantId, size: variant.size });
  }

  function removeLineItem(index: number) {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  }

  const itemsTotal = lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingHalere = Math.round(parseFloat(shippingKc || '0') * 100);
  const grandTotal = itemsTotal + shippingHalere;

  async function handleSave() {
    setError('');
    if (!customerName.trim()) { setError('Zadejte jméno zákazníka'); return; }
    if (lineItems.length === 0) { setError('Přidejte alespoň jednu položku'); return; }

    // Validate quantities vs stock
    for (const item of lineItems) {
      const product = products.find(p => p.id === item.productId);
      const variant = product?.variants.find(v => v.id === item.variantId);
      if (variant && item.quantity > variant.stock) {
        setError(`${product?.name} / ${item.size}: na skladě je jen ${variant.stock} ks`);
        return;
      }
      if (item.quantity < 1) { setError('Množství musí být alespoň 1'); return; }
    }

    setSaving(true);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: `manual_${Date.now()}`,
        status: 'pending',
        total: grandTotal,
        shipping: shippingHalere,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || null,
        shipping_address: customerPhone.trim() ? { phone: customerPhone.trim() } : null,
        ...(note.trim() ? { note: note.trim() } : {}),
      })
      .select('id')
      .single();

    if (orderError || !order) {
      setError('Nepodařilo se vytvořit objednávku: ' + (orderError?.message ?? ''));
      setSaving(false);
      return;
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      lineItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        size: item.size,
        quantity: item.quantity,
        price: item.unitPrice,
      }))
    );

    if (itemsError) {
      setError('Chyba při ukládání položek: ' + itemsError.message);
      setSaving(false);
      return;
    }

    // Decrement stock for each item
    for (const item of lineItems) {
      await supabase.rpc('decrement_stock', {
        p_variant_id: item.variantId,
        p_qty: item.quantity,
      });
    }

    router.push('/admin/orders');
  }

  return (
    <div className="p-5 md:p-8 max-w-3xl w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Zpět</Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-semibold text-gray-900">Nová objednávka</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loadingProducts}
          className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Ukládání...' : 'Vytvořit objednávku'}
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-5">

        {/* Customer */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Zákazník</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jméno <span className="text-red-400">*</span></label>
            <input value={customerName} onChange={e => setCustomerName(e.target.value)} className={inputCls} placeholder="Jan Novák" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={inputCls} placeholder="jan@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className={inputCls} placeholder="+420 123 456 789" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Poznámka</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Interní poznámka k objednávce..."
            />
          </div>
        </section>

        {/* Items */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Položky</h2>
            <button
              onClick={addLineItem}
              disabled={loadingProducts || products.length === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 disabled:opacity-40 transition-colors"
            >
              <Plus size={15} />
              Přidat položku
            </button>
          </div>

          {loadingProducts ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-200 border-t-gray-600" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              Žádné aktivní produkty. <Link href="/admin/products/new" className="underline hover:text-gray-700">Přidat produkt →</Link>
            </p>
          ) : lineItems.length === 0 ? (
            <button
              onClick={addLineItem}
              className="w-full py-8 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Přidat první položku
            </button>
          ) : (
            <div className="space-y-3">
              {lineItems.map((item, i) => {
                const product = products.find(p => p.id === item.productId);
                const variant = product?.variants.find(v => v.id === item.variantId);
                const maxQty = variant?.stock ?? 0;

                return (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">

                    {/* Product */}
                    <select
                      value={item.productId}
                      onChange={e => setLineProduct(i, e.target.value)}
                      className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    {/* Size */}
                    <select
                      value={item.variantId}
                      onChange={e => setLineVariant(i, e.target.value)}
                      className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    >
                      {product?.variants.map(v => (
                        <option key={v.id} value={v.id} disabled={v.stock === 0}>
                          {v.size} {v.stock === 0 ? '(0)' : `(${v.stock} ks)`}
                        </option>
                      ))}
                    </select>

                    {/* Quantity */}
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      max={maxQty}
                      onChange={e => updateLineItem(i, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />

                    {/* Line total */}
                    <span className="text-sm font-medium text-gray-700 w-24 text-right flex-shrink-0">
                      {(item.unitPrice * item.quantity / 100).toLocaleString('cs-CZ')} Kč
                    </span>

                    <button
                      onClick={() => removeLineItem(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Summary */}
        {lineItems.length > 0 && (
          <section className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Shrnutí</h2>

            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Zboží</span>
                <span>{(itemsTotal / 100).toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Doprava (Kč)</span>
                <input
                  type="number"
                  value={shippingKc}
                  min={0}
                  onChange={e => setShippingKc(e.target.value)}
                  className="w-24 text-right border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Celkem</span>
                <span>{(grandTotal / 100).toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Objednávka se vytvoří se statusem <span className="font-medium text-amber-600">Čeká</span> — změň ho na Zaplaceno nebo Odesláno až to bude relevantní.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
