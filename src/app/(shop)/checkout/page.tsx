'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/types/cart';

const SHIPPING = 129;

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('cart');
    setCart(raw ? JSON.parse(raw) : []);
    setHydrated(true);
  }, []);

  function persist(next: CartItem[]) {
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function removeItem(index: number) {
    persist(cart.filter((_, i) => i !== index));
  }

  function updateQty(index: number, qty: number) {
    if (qty < 1) { removeItem(index); return; }
    const next = [...cart];
    next[index] = { ...next[index], quantity: qty };
    persist(next);
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + SHIPPING;
  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  async function handleCheckout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (res.status === 409) {
        const list = (data.items as string[])?.join(', ') ?? '';
        setError(`Tyto položky nejsou skladem: ${list}.`);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Chyba');
      window.location.href = data.url;
    } catch {
      setError('Nepodařilo se vytvořit objednávku. Zkuste to znovu.');
      setLoading(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="font-anton text-[100px] md:text-[140px] text-line leading-none select-none"
        >
          ∅
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim"
        >
          Košík je prázdný
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 pb-[6px] border-b border-bone font-mono text-[11px] tracking-[0.24em] uppercase text-bone hover:gap-5 transition-all duration-300"
          >
            <span>Přejít do shopu</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Step breadcrumb */}
      <div className="border-b border-line px-7 md:px-14 h-12 flex items-center gap-0">
        {['Shop', 'Košík', 'Platba'].map((step, i) => (
          <div key={step} className="flex items-center gap-0">
            {i > 0 && <span className="font-mono text-[10px] text-mute mx-3">—</span>}
            <span className={`font-mono text-[10px] tracking-[0.22em] uppercase ${i === 1 ? 'text-bone' : 'text-mute'}`}>
              {step}
            </span>
          </div>
        ))}
        <div className="ml-auto font-mono text-[10px] tracking-[0.18em] uppercase text-mute">
          {totalQty} {totalQty === 1 ? 'kus' : totalQty < 5 ? 'kusy' : 'kusů'}
        </div>
      </div>

      <div className="grid grid-cols-1 tb:grid-cols-[1fr_400px]">

        {/* ── Items list ── */}
        <div className="tb:border-r border-line">
          <AnimatePresence initial={false}>
            {cart.map((item, index) => (
              <motion.div
                key={item.variantId}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16, height: 0 }}
                transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                className="border-b border-line group"
              >
                <div className="grid grid-cols-[auto_1fr] gap-0">

                  {/* Index stripe */}
                  <div className="w-12 md:w-16 flex items-start justify-center pt-6 border-r border-line">
                    <span className="font-mono text-[11px] tracking-[0.1em] text-mute select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-7 flex gap-5 md:gap-7">

                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="block flex-shrink-0">
                      <div className="relative w-20 md:w-28 aspect-[4/5] overflow-hidden bg-line">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-anton text-[clamp(22px,3vw,32px)] uppercase leading-[0.92] text-bone hover:text-dim transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-dim border border-line px-2.5 py-1">
                            {item.selectedSize}
                          </span>
                        </div>
                      </div>

                      {/* Qty + remove */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center border border-line">
                          <button
                            onClick={() => updateQty(index, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center font-mono text-dim hover:text-bone hover:bg-line transition-colors text-[16px]"
                            aria-label="Snížit množství"
                          >
                            −
                          </button>
                          <span className="w-9 h-9 flex items-center justify-center font-mono text-[12px] text-bone border-x border-line">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(index, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center font-mono text-dim hover:text-bone hover:bg-line transition-colors text-[16px]"
                            aria-label="Zvýšit množství"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-5">
                          <span className="font-mono text-[14px] tracking-[0.04em] text-bone">
                            {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                          </span>
                          <button
                            onClick={() => removeItem(index)}
                            className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute hover:text-[#c0392b] transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Back link */}
          <div className="px-7 md:px-[calc(64px+28px)] py-6">
            <Link
              href="/shop"
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute hover:text-bone transition-colors"
            >
              ← Pokračovat v nákupu
            </Link>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="tb:sticky tb:top-[68px] tb:h-[calc(100vh-68px)] tb:overflow-y-auto">
          <div className="p-7 md:p-10 flex flex-col gap-6 h-full">

            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-dim font-normal border-b border-line pb-5">
              Souhrn objednávky
            </h2>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-[#c0392b]/40 bg-[#c0392b]/5 px-4 py-3 font-mono text-[11px] tracking-[0.12em] text-[#c0392b]"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Condensed item list in summary */}
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="relative w-10 h-[52px] flex-shrink-0 overflow-hidden bg-line">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-anton text-[14px] uppercase leading-tight text-bone truncate">{item.name}</p>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-dim mt-0.5">
                      {item.selectedSize} · {item.quantity}&thinsp;ks
                    </p>
                  </div>
                  <span className="font-mono text-[12px] text-dim flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-line pt-5 flex flex-col gap-2.5 mt-auto">
              <div className="flex justify-between font-mono text-[11px] tracking-[0.16em] uppercase text-dim">
                <span>Mezisoučet</span>
                <span>{subtotal.toLocaleString('cs-CZ')} Kč</span>
              </div>
              <div className="flex justify-between font-mono text-[11px] tracking-[0.16em] uppercase text-dim">
                <span>Doprava</span>
                <span>{SHIPPING} Kč</span>
              </div>
            </div>

            <div className="border-t border-bone/30 pt-4 flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone">Celkem</span>
              <span className="font-anton text-[32px] uppercase leading-none text-bone">
                {total.toLocaleString('cs-CZ')}&thinsp;<span className="text-[22px]">Kč</span>
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full py-[22px] bg-bone text-[#0a0a0a] font-mono text-[12px] tracking-[0.26em] uppercase border border-bone hover:bg-[#0a0a0a] hover:text-bone transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span className="inline-flex items-center gap-3 group-hover:gap-5 transition-all duration-300">
                {loading ? 'Přesměrování...' : 'Pokračovat k platbě'}
                {!loading && <span>→</span>}
              </span>
            </button>

            {/* Trust */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-mute">
                <span>⊕</span>
                <span>Zabezpečená platba přes Stripe</span>
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-mute">
                <span>⊕</span>
                <span>Apple Pay · Google Pay · Karta</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
