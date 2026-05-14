'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types/product';
import { CartItem } from '@/types/cart';

export default function ProductDetail({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [thumb, setThumb] = useState(0);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(false);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 190;
  const ZOOM = 2.6;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
  }

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.handle}`, { cache: 'no-store' });
        if (!res.ok) { setProduct(null); setLoading(false); return; }
        setProduct(await res.json());
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();

    // Refresh stock when user returns to this tab (e.g. after Stripe checkout)
    function onVisible() {
      if (document.visibilityState === 'visible') loadProduct();
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [params.handle]);

  function handleAddToCart() {
    if (!selectedSize || !product || adding) return;
    const sizeObj = product.sizes.find(s => s.name === selectedSize);
    if (!sizeObj?.id) return;

    setAdding(true);
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') ?? '[]');
    const idx = cart.findIndex(i => i.variantId === sizeObj.id);

    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        variantId: sizeObj.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    setToast(true);
    setTimeout(() => { setSelectedSize(''); setAdding(false); }, 300);
    setTimeout(() => setToast(false), 3000);
  }

  const images = product?.images?.length ? product.images : product?.image ? [product.image] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-6">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim">Produkt nenalezen</p>
        <Link href="/shop" className="font-mono text-[11px] tracking-[0.22em] uppercase text-bone underline underline-offset-4">
          ← Zpět na shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 bg-bone text-[#0a0a0a] px-5 py-3.5 font-mono text-[11px] tracking-[0.22em] uppercase flex items-center gap-5 whitespace-nowrap shadow-2xl"
          >
            <span>{product.name} — přidáno</span>
            <Link href="/checkout" className="border-b border-[#0a0a0a]/40 hover:border-[#0a0a0a] transition-colors">
              Košík →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout: gallery | info */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] min-h-[calc(100vh-58px)]">

        {/* Gallery */}
        <div className="flex flex-col lg:border-r border-line">
          {/* Main image */}
          <div
            ref={imgContainerRef}
            className="relative aspect-[4/5] border-b border-line overflow-hidden"
            style={{ cursor: lens ? 'none' : 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setLens(null)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={thumb}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[thumb] ?? product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Loupe lens */}
            {lens && (
              <div
                className="absolute rounded-full pointer-events-none border border-bone/25 shadow-[0_0_0_1px_rgba(244,241,234,0.08),0_8px_40px_rgba(0,0,0,0.7)]"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lens.x - LENS_SIZE / 2,
                  top: lens.y - LENS_SIZE / 2,
                  backgroundImage: `url(${images[thumb] ?? product.image})`,
                  backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
                  backgroundPosition: `-${lens.x * ZOOM - LENS_SIZE / 2}px -${lens.y * ZOOM - LENS_SIZE / 2}px`,
                  backgroundRepeat: 'no-repeat',
                  zIndex: 10,
                }}
              />
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setThumb(i)}
                  className={`relative aspect-square border-r border-line last:border-r-0 overflow-hidden transition-opacity duration-200 ${
                    i === thumb ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sticky info panel */}
        <aside className="lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:overflow-y-auto flex flex-col gap-8 p-8 md:p-12">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-dim">
            <Link href="/shop" className="hover:text-bone transition-colors">Shop</Link>
            <span className="text-mute">/</span>
            <span className="text-mute">{product.category}</span>
            <span className="text-mute">/</span>
            <span className="text-bone truncate">{product.name}</span>
          </div>

          {/* Name + category */}
          <div>
            <h1 className="font-anton text-[clamp(52px,5.5vw,88px)] uppercase leading-[0.88] tracking-tight text-bone">
              {product.name}
            </h1>
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim mt-4">
              {product.category}
            </div>
          </div>

          {/* Price */}
          <div className="font-mono text-[15px] tracking-[0.06em] text-bone">
            {product.price.toLocaleString('cs-CZ')} Kč
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-3">
            <h5 className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim font-normal flex justify-between">
              <span>Velikost{selectedSize ? ` — ${selectedSize}` : ''}</span>
            </h5>
            <div className="grid grid-cols-5 gap-[6px]">
              {product.sizes.map(size => {
                const isOut = !size.available;
                const isOn = selectedSize === size.name;
                return (
                  <button
                    key={size.name}
                    disabled={isOut}
                    onClick={() => setSelectedSize(size.name)}
                    className={`py-4 font-mono text-[12px] tracking-[0.16em] uppercase text-center border transition-all duration-200
                      ${isOut
                        ? 'border-line text-mute cursor-not-allowed'
                        : isOn
                        ? 'border-bone bg-bone text-[#0a0a0a]'
                        : 'border-line text-dim hover:text-bone hover:border-dim'
                      }`}
                    style={isOut ? {
                      background: 'repeating-linear-gradient(135deg, transparent 0 4px, rgba(107,107,102,0.12) 4px 5px)',
                    } : undefined}
                  >
                    {size.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            disabled={!selectedSize || adding}
            onClick={handleAddToCart}
            className="w-full py-[22px] bg-bone text-[#0a0a0a] font-mono text-[12px] tracking-[0.26em] uppercase border border-bone hover:bg-[#0a0a0a] hover:text-bone transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding ? 'Přidáno →' : selectedSize ? 'Přidat do košíku' : 'Vyberte velikost'}
          </button>

          {/* Description */}
          {product.description && (
            <div
              className="font-sans text-[13px] leading-[1.7] text-dim border-t border-line pt-6 [&_h2]:font-mono [&_h2]:text-[10px] [&_h2]:tracking-[0.22em] [&_h2]:uppercase [&_h2]:text-dim [&_h2]:mb-3 [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Footer notes */}
          <div className="border-t border-line pt-6 flex flex-col gap-3 mt-auto">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              ⊕ Doprava 3–5 pracovních dní · 129 Kč
            </div>
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              ⊕ Limitovaná edice — po vyprodání nebude restockováno
            </div>
          </div>

        </aside>
      </div>

    </div>
  );
}
