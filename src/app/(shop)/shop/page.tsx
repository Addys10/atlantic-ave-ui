'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

const BLUR_PLACEHOLDER = `data:image/svg+xml;base64,${btoa("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'><rect fill='#141210' width='1' height='1'/></svg>")}`;

const GRID_CLASS = 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-[30px] gap-y-10';

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-[120px] pt-16 md:pt-20">
      <div className="skeleton mb-14 h-16 w-52 rounded-sm" />
      <div className={GRID_CLASS}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5]" />
            <div className="mt-4 flex items-center justify-between">
              <div className="skeleton h-4 w-24 rounded-sm" />
              <div className="skeleton h-4 w-14 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function productStatus(product: Product) {
  const available = product.sizes.filter((s) => s.available).length;
  const totalStock = product.sizes.reduce((n, s) => n + (s.stock || 0), 0);
  if (available === 0) return { text: 'Vyprodáno', color: '#8a8178' };
  if (totalStock > 0 && totalStock <= 5) return { text: 'Posledních pár', color: '#eae3d6' };
  return { text: 'Skladem', color: '#8a8178' };
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const status = productStatus(product);
  const img = product.images.length > 0 ? product.images[0] : product.image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#141210]">
          {img ? (
            <Image
              src={img}
              alt={`Atlantic Ave — ${product.name}`}
              fill
              sizes="(max-width: 768px) 50vw, 300px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#4d463c]">
                Připravujeme
              </span>
            </div>
          )}
          <span
            className="absolute left-3.5 top-3.5 bg-[#0b0a09]/60 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.14em]"
            style={{ color: status.color }}
          >
            {status.text}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-2.5">
          <div>
            <div className="font-grotesk text-[15px] font-medium text-[#eae3d6]">
              {product.name}
            </div>
            {product.subtitle && (
              <div className="mt-1 line-clamp-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8a8178]">
                {product.subtitle}
              </div>
            )}
          </div>
          <div className="whitespace-nowrap font-mono text-[14px] text-[#eae3d6]">
            {product.price.toLocaleString('cs-CZ')} Kč
          </div>
        </div>
      </Link>
    </motion.div>
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

  const availableCount = products.filter((p) => p.sizes.some((s) => s.available)).length;

  return (
    <div className="min-h-screen bg-[#0b0a09] text-[#eae3d6]">

      {loading && <ShopSkeleton />}

      {!loading && error && (
        <div className="py-40 text-center">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8a8178]">
            Nepodařilo se načíst produkty
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#eae3d6] underline underline-offset-4"
          >
            Zkusit znovu
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center gap-0 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#eae3d6]/10" />
            <span className="font-mono text-[10px] uppercase tracking-[0.38em] text-[#8a8178]">Připravujeme</span>
            <div className="h-px w-8 bg-[#eae3d6]/10" />
          </motion.div>

          <div className="mb-2 overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase leading-[0.88] tracking-tight text-[#eae3d6]"
              style={{ fontSize: 'clamp(72px, 16vw, 180px)' }}
            >
              Drop
            </motion.p>
          </div>
          <div className="mb-10 overflow-hidden">
            <motion.p
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase leading-[0.88] tracking-tight"
              style={{
                fontSize: 'clamp(72px, 16vw, 180px)',
                WebkitTextStroke: '1.5px #eae3d6',
                color: 'transparent',
              }}
            >
              03
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-8 max-w-[32ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-[#8a8178]"
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
            className="inline-flex items-center gap-3 border border-[#eae3d6]/30 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.26em] text-[#eae3d6] transition-colors duration-200 hover:border-[#eae3d6]"
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
        <div className="mx-auto max-w-[1200px] px-6 pb-[120px] pt-16 md:pt-20">
          {/* Header */}
          <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
            <motion.h1
              initial={{ opacity: 0, y: '40%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="m-0 font-anton uppercase leading-[0.86] text-[#eae3d6] select-none"
              style={{ fontSize: 'clamp(46px, 9vw, 100px)' }}
            >
              Shop
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#8a8178]"
            >
              {products.length} {products.length === 1 ? 'kus' : products.length < 5 ? 'kusy' : 'kusů'} — {availableCount} dostupných
            </motion.div>
          </div>

          {/* Grid */}
          <div className={GRID_CLASS}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
