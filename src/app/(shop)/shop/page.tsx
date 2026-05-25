'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { DEFAULT_SIZES } from '@/lib/constants';

function availableCount(product: Product) {
  return product.sizes.filter(s => s.available).length;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) throw new Error();
        const data: Product[] = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();

    // Refresh when user returns to this tab (e.g. after completing Stripe checkout)
    function onVisible() {
      if (document.visibilityState === 'visible') loadProducts();
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {loading && (
        <div className="flex justify-center py-40">
          <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-40">
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim mb-6">
            Nepodařilo se načíst produkty
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone underline underline-offset-4"
          >
            Zkusit znovu
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center px-6 text-center gap-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px w-8 bg-line" />
            <span className="font-mono text-[10px] tracking-[0.38em] uppercase text-mute">Připravujeme</span>
            <div className="h-px w-8 bg-line" />
          </motion.div>

          <div className="overflow-hidden mb-2">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase text-bone leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(72px, 16vw, 180px)' }}
            >
              Drop
            </motion.p>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase leading-[0.88] tracking-tight"
              style={{
                fontSize: 'clamp(72px, 16vw, 180px)',
                WebkitTextStroke: '1.5px #f4f1ea',
                color: 'transparent',
              }}
            >
              02
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-mono text-[11px] tracking-[0.2em] leading-relaxed uppercase text-dim mb-8 max-w-[32ch]"
          >
            Nový drop se připravuje.<br />Sleduj nás na Instagramu pro první info.
          </motion.p>

          <motion.a
            href="https://www.instagram.com/atlantic_ave_100th_"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-bone border border-bone/30 hover:border-bone px-6 py-3.5 transition-colors duration-200"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            Sledovat →
          </motion.a>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Header strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border-b border-line px-6 md:px-14 py-3.5 flex items-center justify-between"
          >
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-dim">Kolekce</span>
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-dim">
              {products.length}&nbsp;
              {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktů'}
            </span>
          </motion.div>

          {/* ── Mobile: 2-column card grid (1 product → full width) ── */}
          <div className={`md:hidden grid gap-[1px] bg-line border-t border-line ${products.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {products.map((product, index) => {
              const soldOut = availableCount(product) === 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  className="bg-[#0a0a0a]"
                >
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="50vw"
                      />
                      {soldOut && (
                        <div className="absolute inset-0 bg-[#0a0a0a]/55 flex items-end p-3">
                          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-dim">
                            Vyprodáno
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 pb-4 border-t border-line">
                      <h3 className="font-anton text-[22px] uppercase leading-[0.9] text-bone mb-1">
                        {product.name}
                      </h3>
                      {product.subtitle && (
                        <p className="font-mono text-[9px] leading-relaxed text-dim mb-2 line-clamp-2">
                          {product.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-[4px] mb-2.5">
                        {(product.sizes.length > 0 ? product.sizes.map(s => ({ name: s.name, available: s.available })) : DEFAULT_SIZES.map(name => ({ name, available: false }))).map(size => size.available ? (
                          <span
                            key={size.name}
                            className="font-mono text-[9px] tracking-[0.1em] uppercase px-1.5 py-1 border border-line text-dim"
                          >
                            {size.name}
                          </span>
                        ) : (
                          <Link
                            key={size.name}
                            href={`/restock?product=${product.slug}&size=${size.name}`}
                            className="font-mono text-[9px] tracking-[0.1em] uppercase px-1.5 py-1 text-mute hover:text-dim transition-colors"
                            style={{
                              border: '1px solid #1a1a1a',
                              background: 'repeating-linear-gradient(135deg, transparent 0 3px, rgba(107,107,102,0.1) 3px 4px)',
                            }}
                          >
                            {size.name}
                          </Link>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-bone">
                          {product.price.toLocaleString('cs-CZ')} Kč
                        </span>
                        <span className="font-mono text-[11px] text-dim group-hover:text-bone group-hover:translate-x-0.5 transition-all duration-300 inline-block">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ── Desktop: alternating editorial rows ── */}
          <section className="hidden md:flex flex-col border-t border-line">
            {products.map((product, index) => {
              const flip = index % 2 !== 0;
              const soldOut = availableCount(product) === 0;

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-line last:border-b-0"
                >
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div
                      className="grid grid-cols-2 min-h-[72vh]"
                      style={flip ? { direction: 'rtl' } : undefined}
                    >
                      {/* Image */}
                      <div
                        style={flip ? { direction: 'ltr' } : undefined}
                        className="relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0"
                          whileHover={{ scale: 1.035 }}
                          transition={{ duration: 1.2, ease: [0.2, 0.6, 0.2, 1] }}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </motion.div>

                        {soldOut && (
                          <div className="absolute bottom-7 left-7 font-mono text-[10px] tracking-[0.24em] uppercase text-dim border border-line px-3 py-1.5 bg-[#0a0a0a]/70 backdrop-blur-sm">
                            Vyprodáno
                          </div>
                        )}
                      </div>

                      {/* Info panel */}
                      <div
                        style={flip ? { direction: 'ltr' } : undefined}
                        className="flex flex-col justify-center px-12 lg:px-16 py-12 bg-[#0a0a0a] relative"
                      >
                        {/* Index */}
                        <span className="absolute top-7 right-8 font-mono text-[11px] tracking-[0.2em] text-mute select-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Name */}
                        <h2 className="font-anton text-[clamp(42px,5vw,90px)] uppercase leading-[0.88] tracking-tight text-bone">
                          {product.name}
                        </h2>

                        {/* Subtitle */}
                        {product.subtitle && (
                          <p className="font-mono text-[11px] leading-[1.7] text-dim mt-4 max-w-[32ch]">
                            {product.subtitle}
                          </p>
                        )}

                        {/* Divider */}
                        <div className="h-px w-full bg-line my-7" />

                        {/* Sizes with stock */}
                        <div className="flex flex-wrap gap-[5px]">
                          {product.sizes.filter(s => s.available).map(size => (
                            <div
                              key={size.name}
                              className="border border-line font-mono tracking-[0.1em] uppercase text-dim w-14 py-2.5 text-center group-hover:border-[#2e2e2e] transition-colors flex flex-col items-center gap-0.5"
                            >
                              <span className="text-[11px] text-bone">{size.name}</span>
                              <span className="text-[9px] text-mute">{size.stock}&thinsp;ks</span>
                            </div>
                          ))}
                          {(product.sizes.length > 0 ? product.sizes.filter(s => !s.available) : DEFAULT_SIZES.map(name => ({ name, available: false }))).map(size => (
                            <Link
                              key={size.name}
                              href={`/restock?product=${product.slug}&size=${size.name}`}
                              className="font-mono tracking-[0.1em] uppercase text-mute w-14 py-2.5 text-center flex flex-col items-center gap-0.5 hover:text-dim transition-colors"
                              style={{
                                border: '1px solid #1a1a1a',
                                background: 'repeating-linear-gradient(135deg, transparent 0 4px, rgba(107,107,102,0.09) 4px 5px)',
                              }}
                            >
                              <span className="text-[11px]">{size.name}</span>
                              <span className="text-[9px]">—</span>
                            </Link>
                          ))}
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-line my-7" />

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[17px] tracking-tight text-bone">
                            {product.price.toLocaleString('cs-CZ')} Kč
                          </span>
                          <div className="inline-flex items-center gap-3 pb-[5px] border-b border-bone font-mono text-[10px] tracking-[0.24em] uppercase text-bone group-hover:gap-[20px] transition-all duration-300">
                            <span>Zobrazit kus</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}
