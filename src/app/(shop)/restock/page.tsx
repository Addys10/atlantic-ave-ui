'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { DEFAULT_SIZES } from '@/lib/constants';

interface SelectedItem {
  product_slug: string;
  product_name: string;
  size: string;
}

function RestockContent() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string[]>>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const [flagRes, productsRes] = await Promise.all([
        fetch('/api/settings/restock', { cache: 'no-store' }),
        fetch('/api/products'),
      ]);
      const { open: isOpen } = await flagRes.json();
      const prods = await productsRes.json();
      const loadedProducts: Product[] = Array.isArray(prods) ? prods : [];
      setOpen(isOpen);
      setProducts(loadedProducts);

      const preProduct = searchParams.get('product');
      const preSize = searchParams.get('size');
      if (preProduct && preSize) {
        setSelectedSizes({ [preProduct]: [preSize] });
      }

      setLoading(false);
    }
    load();

    async function refreshFlag() {
      if (document.visibilityState === 'visible') {
        const res = await fetch('/api/settings/restock', { cache: 'no-store' });
        const { open: isOpen } = await res.json();
        setOpen(isOpen);
      }
    }
    document.addEventListener('visibilitychange', refreshFlag);
    return () => document.removeEventListener('visibilitychange', refreshFlag);
  }, []);

  function toggleSize(slug: string, size: string) {
    setSelectedSizes(prev => {
      const current = prev[slug] ?? [];
      const next = current.includes(size)
        ? current.filter(s => s !== size)
        : [...current, size];
      return { ...prev, [slug]: next };
    });
  }

  const selectedItems: SelectedItem[] = Object.entries(selectedSizes).flatMap(([slug, sizes]) =>
    sizes.map(size => ({
      product_slug: slug,
      product_name: products.find(p => p.slug === slug)?.name ?? slug,
      size,
    }))
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!selectedItems.length) {
      setError('Vyber alespoň jeden produkt a velikost.');
      return;
    }
    setSubmitting(true);
    const res = await fetch('/api/restock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, items: selectedItems }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Něco se nepovedlo, zkus to znovu.');
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    );
  }

  if (!open) {
    return (
      <div className="bg-[#0a0a0a] min-h-[calc(100vh-58px)] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-dim">Restock · Drop 002</p>
        <h1 className="font-anton text-[clamp(72px,14vw,160px)] uppercase leading-none tracking-tight text-bone">
          BRZY.
        </h1>
        <p className="font-mono text-[12px] tracking-[0.08em] text-mute max-w-[36ch] leading-relaxed">
          Restock bude brzy oznámen. Sleduj nás na Instagramu.
        </p>
        <Link href="/shop" className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim hover:text-bone transition-colors underline underline-offset-4">
          ← Zpět na shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#0a0a0a] min-h-[calc(100vh-58px)] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-dim">Restock · Drop 002</p>
        <h1 className="font-anton text-[clamp(52px,8vw,100px)] uppercase leading-none tracking-tight text-bone">
          ZAREGISTROVÁNO.
        </h1>
        <p className="font-mono text-[12px] tracking-[0.08em] text-mute max-w-[40ch] leading-relaxed">
          Dáme ti vědět, až bude restock připraven.
        </p>
        <Link href="/shop" className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim hover:text-bone transition-colors underline underline-offset-4">
          ← Zpět na shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen tb:h-screen tb:overflow-hidden">
      <div className="grid grid-cols-1 tb:grid-cols-2 tb:h-[calc(100vh-68px)]">

        {/* Left — hero (sticky) */}
        <div className="flex flex-col justify-start px-8 md:px-12 py-16 border-b tb:border-b-0 tb:border-r border-line tb:sticky tb:top-[68px] tb:h-[calc(100vh-68px)]">
          <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-dim mb-6">Restock · Drop 002</p>
          <h1 className="font-anton text-[clamp(56px,7vw,110px)] uppercase leading-[0.88] tracking-tight text-bone mb-8">
            SOLD OUT.<br />COMING<br />BACK.
          </h1>
          <p className="font-mono text-[12px] tracking-[0.06em] text-dim max-w-[44ch] leading-[1.8]">
            Zájem nás překvapil — vše bylo prodáno ještě před spuštěním eshopu.
            Proto restockujeme. Zaregistruj zájem níže a my ti dáme vědět, až bude připraveno.
          </p>
        </div>

        {/* Right — products + form */}
        <div className="tb:overflow-y-auto flex flex-col gap-10 px-8 md:px-12 py-12">

          {/* Products */}
          <div className="flex flex-col gap-5">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim">
              Vyber produkty a velikosti — kliknutím na foto zobrazíš detail
            </p>
            <div className="grid grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.slug} className="flex flex-col gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    className="relative aspect-[4/5] overflow-hidden block group"
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-opacity duration-300 group-hover:opacity-75"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/70 py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-bone">Detail →</p>
                    </div>
                  </Link>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-bone">{product.name}</p>
                    <p className="font-mono text-[9px] tracking-[0.12em] text-dim mt-0.5">{product.category}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-[4px]">
                    {(product.sizes.length > 0 ? product.sizes.map(s => s.name) : DEFAULT_SIZES).map(sizeName => {
                      const isOn = (selectedSizes[product.slug] ?? []).includes(sizeName);
                      return (
                        <button
                          key={sizeName}
                          onClick={() => toggleSize(product.slug, sizeName)}
                          className={`py-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-center border transition-all duration-150
                            ${isOn
                              ? 'border-bone bg-bone text-[#0a0a0a]'
                              : 'border-line text-dim hover:text-bone hover:border-dim'
                            }`}
                        >
                          {sizeName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-12">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim">Tvoje kontaktní údaje</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-dim">Jméno</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="bg-transparent border border-line text-bone font-mono text-[13px] px-4 py-3 focus:outline-none focus:border-dim placeholder:text-mute"
                  placeholder="Jan"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-dim">Příjmení</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="bg-transparent border border-line text-bone font-mono text-[13px] px-4 py-3 focus:outline-none focus:border-dim placeholder:text-mute"
                  placeholder="Novák"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-dim">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent border border-line text-bone font-mono text-[13px] px-4 py-3 focus:outline-none focus:border-dim placeholder:text-mute"
                placeholder="jan@example.com"
              />
            </div>

            {selectedItems.length > 0 && (
              <div className="border border-line p-4 flex flex-col gap-1.5">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-dim mb-1">Tvůj výběr</p>
                {selectedItems.map((item, i) => (
                  <p key={i} className="font-mono text-[11px] tracking-[0.06em] text-bone">
                    {item.product_name} · {item.size}
                  </p>
                ))}
              </div>
            )}

            {error && (
              <p className="font-mono text-[11px] tracking-[0.06em] text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-[22px] bg-bone text-[#0a0a0a] font-mono text-[12px] tracking-[0.26em] uppercase border border-bone hover:bg-[#0a0a0a] hover:text-bone transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Odesílám…' : 'Zaregistrovat zájem'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function RestockPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    }>
      <RestockContent />
    </Suspense>
  );
}
