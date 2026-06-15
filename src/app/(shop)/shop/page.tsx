'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { DEFAULT_SIZES } from '@/lib/constants';

const BLUR_PLACEHOLDER = `data:image/svg+xml;base64,${btoa("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect fill='#1f1f1f' width='1' height='1'/></svg>")}`;

function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-canvas">

      {/* Header strip */}
      <div className="border-b border-line px-6 md:px-14 py-3.5 flex items-center justify-between">
        <div className="skeleton h-2.5 w-16 rounded-sm" />
        <div className="skeleton h-2.5 w-12 rounded-sm" />
      </div>

      {/* Mobile: 1-column card grid */}
      <div className="md:hidden grid grid-cols-1 gap-[1px] bg-line border-t border-line">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="bg-canvas flex flex-col">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-3 pb-4 border-t border-line flex flex-col gap-2">
              <div className="skeleton h-5 w-3/4 rounded-sm" />
              <div className="skeleton h-2 w-full rounded-sm" />
              <div className="skeleton h-2 w-2/3 rounded-sm" />
              <div className="flex gap-1 mt-1">
                {[0, 1, 2].map(j => (
                  <div key={j} className="skeleton h-5 w-7 rounded-sm" />
                ))}
              </div>
              <div className="skeleton h-2.5 w-16 rounded-sm mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: editorial rows */}
      <div className="hidden md:flex flex-col border-t border-line">
        {[0, 1].map(i => (
          <div key={i} className="border-b border-line last:border-b-0">
            <div className="grid grid-cols-2 min-h-[72vh]">
              {/* Image side */}
              <div className="skeleton" />

              {/* Info side */}
              <div className="flex flex-col justify-center px-12 lg:px-16 py-12 gap-6 bg-canvas">
                <div className="skeleton h-20 w-2/3 rounded-sm" />
                <div className="skeleton h-20 w-2/5 rounded-sm" />
                <div className="flex flex-col gap-2">
                  <div className="skeleton h-2.5 w-full rounded-sm" />
                  <div className="skeleton h-2.5 w-5/6 rounded-sm" />
                </div>
                <div className="h-px w-full bg-line" />
                <div className="flex gap-[5px]">
                  {[0, 1, 2, 3].map(j => (
                    <div key={j} className="skeleton h-14 w-14 rounded-sm" />
                  ))}
                </div>
                <div className="h-px w-full bg-line" />
                <div className="flex items-center justify-between">
                  <div className="skeleton h-4 w-24 rounded-sm" />
                  <div className="skeleton h-3 w-28 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function availableCount(product: Product) {
  return product.sizes.filter(s => s.available).length;
}

function MobileProductCard({ product, index }: { product: Product; index: number }) {
  const soldOut = availableCount(product) === 0;
  const images = product.images.length > 0 ? product.images : [product.image];
  const [imgIdx, setImgIdx] = useState(0);
  const touchStartX = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      e.preventDefault();
      if (diff > 0) setImgIdx(i => Math.min(i + 1, images.length - 1));
      else setImgIdx(i => Math.max(i - 1, 0));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="bg-[#0a0a0a]"
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div
          className="relative aspect-[3/4] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${i === imgIdx ? 'opacity-100' : 'opacity-0'}`}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          ))}
          {soldOut && (
            <div className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.2em] uppercase text-bone border border-bone/40 px-2 py-1 bg-[#0a0a0a]/80 backdrop-blur-sm">
              Vyprodáno
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === imgIdx ? 'bg-bone' : 'bg-bone/30'}`} />
              ))}
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
}

function DesktopProductRow({ product, index }: { product: Product; index: number }) {
  const flip = index % 2 !== 0;
  const soldOut = availableCount(product) === 0;
  const images = product.images.length > 0 ? product.images : [product.image];
  const [imgIdx, setImgIdx] = useState(0);

  function prevImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i => Math.max(i - 1, 0));
  }

  function nextImage(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i => Math.min(i + 1, images.length - 1));
  }

  return (
    <motion.article
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
            className="relative overflow-hidden group/photo"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.035 }}
              transition={{ duration: 1.2, ease: [0.2, 0.6, 0.2, 1] }}
            >
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={product.name}
                  fill
                  className={`object-cover transition-opacity duration-500 ${i === imgIdx ? 'opacity-100' : 'opacity-0'}`}
                  sizes="50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>

            {images.length > 1 && (
              <>
                {imgIdx > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center border border-bone/20 bg-[#0a0a0a]/60 backdrop-blur-sm text-bone/60 hover:text-bone hover:border-bone/50 transition-all duration-200 opacity-0 group-hover/photo:opacity-100"
                  >
                    <ChevronLeft size={14} />
                  </button>
                )}
                {imgIdx < images.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center border border-bone/20 bg-[#0a0a0a]/60 backdrop-blur-sm text-bone/60 hover:text-bone hover:border-bone/50 transition-all duration-200 opacity-0 group-hover/photo:opacity-100"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1 h-1 rounded-full transition-colors ${i === imgIdx ? 'bg-bone' : 'bg-bone/30'}`} />
                  ))}
                </div>
              </>
            )}

            {soldOut && (
              <div className="absolute bottom-7 left-7 font-mono text-[10px] tracking-[0.24em] uppercase text-bone border border-bone/30 px-3 py-1.5">
                Vyprodáno
              </div>
            )}
          </div>

          {/* Info panel */}
          <div
            style={flip ? { direction: 'ltr' } : undefined}
            className="flex flex-col justify-center px-12 lg:px-16 py-12 bg-[#0a0a0a] relative"
          >
            <span className="absolute top-7 right-8 font-mono text-[11px] tracking-[0.2em] text-mute select-none">
              {String(index + 1).padStart(2, '0')}
            </span>

            <h2 className="font-anton text-[clamp(42px,5vw,90px)] uppercase leading-[0.88] tracking-tight text-bone">
              {product.name}
            </h2>

            {product.subtitle && (
              <p className="font-mono text-[11px] leading-[1.7] text-dim mt-4 max-w-[32ch]">
                {product.subtitle}
              </p>
            )}

            <div className="h-px w-full bg-line my-7" />

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

            <div className="h-px w-full bg-line my-7" />

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

      {loading && <ShopSkeleton />}

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

          {/* ── Mobile: 1-column card grid ── */}
          <div className="md:hidden grid grid-cols-1 gap-[1px] bg-line border-t border-line">
            {products.map((product, index) => (
              <MobileProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* ── Desktop: alternating editorial rows ── */}
          <section className="hidden md:flex flex-col border-t border-line">
            {products.map((product, index) => (
              <DesktopProductRow key={product.id} product={product} index={index} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
