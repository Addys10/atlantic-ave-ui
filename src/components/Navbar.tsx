'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { CartItem } from '@/types/cart';

const SHIPPING = 129;

export default function Navbar() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  function readCart() {
    try {
      const raw = localStorage.getItem('cart');
      if (!raw) { setCartCount(0); setCartItems([]); return; }
      const items: CartItem[] = JSON.parse(raw);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      setCartItems(items);
    } catch {
      setCartCount(0);
      setCartItems([]);
    }
  }

  useEffect(() => {
    readCart();
    window.addEventListener('storage', readCart);
    window.addEventListener('focus', readCart);
    window.addEventListener('cartUpdated', readCart);
    return () => {
      window.removeEventListener('storage', readCart);
      window.removeEventListener('focus', readCart);
      window.removeEventListener('cartUpdated', readCart);
    };
  }, []);

  function onCartEnter() {
    clearTimeout(hideTimer.current);
    setShowCart(true);
  }

  function onCartLeave() {
    hideTimer.current = setTimeout(() => setShowCart(false), 180);
  }

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const linkCls = 'font-mono text-[11px] tracking-[0.18em] uppercase text-dim hover:text-bone transition-colors duration-200';

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-line"
           style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(14px)' }}>
        {/* Mobile layout */}
        <div className="flex tb:hidden items-center justify-between px-7 h-[68px]">
          <Link href="/" aria-label="Atlantic Ave">
            <span className="font-cloister text-xl font-bold text-bone tracking-[0.22em] uppercase select-none whitespace-nowrap">
              Atlantic Ave
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/checkout" className="relative text-dim hover:text-bone transition-colors duration-200 p-1">
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center bg-bone text-[#0a0a0a] font-mono text-[9px] font-bold rounded-full w-[15px] h-[15px] leading-none select-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileOpen(true)} aria-label="Otevřít menu" aria-expanded={mobileOpen} className="text-dim hover:text-bone transition-colors">
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden tb:grid grid-cols-[1fr_auto_1fr] items-center px-7 h-[68px]">

          {/* Left */}
          <div className="flex items-center gap-7">
            <Link href="/shop" className={linkCls}>Shop</Link>
            <Link href="/size-guide" className={linkCls}>Size Guide</Link>
          </div>

          {/* Center */}
          <Link href="/" aria-label="Atlantic Ave">
            <span className="font-cloister text-2xl font-bold text-bone tracking-[0.22em] uppercase select-none whitespace-nowrap">
              Atlantic Ave
            </span>
          </Link>

          {/* Right — desktop with cart dropdown */}
          <div className="flex items-center justify-end gap-7">
            <Link href="/archiv" className={linkCls}>Archiv</Link>
            <Link href="/behind-the-brand" className={linkCls}>Behind the brand</Link>

            {/* Cart trigger */}
            <div
              className="relative"
              onMouseEnter={onCartEnter}
              onMouseLeave={onCartLeave}
            >
              <Link href="/checkout" className="relative text-dim hover:text-bone transition-colors duration-200 p-1">
                <ShoppingCart size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute left-3 inline-flex items-center justify-center bg-bone text-[#0a0a0a] font-mono text-[9px] font-bold rounded-full w-[15px] h-[15px] leading-none select-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
                    className="absolute top-[calc(100%+14px)] right-0 w-[320px] border border-line z-50"
                    style={{ background: '#0f0f0f' }}
                    onMouseEnter={onCartEnter}
                    onMouseLeave={onCartLeave}
                  >
                    {cartItems.length === 0 ? (
                      <div className="px-5 py-8 flex flex-col items-center gap-3">
                        <span className="font-anton text-[48px] text-line leading-none select-none">∅</span>
                        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim">Košík je prázdný</p>
                        <Link
                          href="/shop"
                          className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone border-b border-bone/40 hover:border-bone transition-colors pb-px"
                        >
                          Přejít do shopu →
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-line flex justify-between items-center">
                          <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-dim">
                            Košík
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.18em] text-mute">
                            {cartCount} {cartCount === 1 ? 'kus' : cartCount < 5 ? 'kusy' : 'kusů'}
                          </span>
                        </div>

                        {/* Items — max 4 shown */}
                        <div className="divide-y divide-line">
                          {cartItems.slice(0, 4).map(item => (
                            <div key={item.variantId} className="flex items-center gap-3 px-4 py-3">
                              <div className="relative w-11 h-[58px] flex-shrink-0 overflow-hidden bg-line">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-anton text-[15px] uppercase leading-tight text-bone truncate">
                                  {item.name}
                                </p>
                                <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-dim mt-0.5">
                                  {item.selectedSize} · {item.quantity}&thinsp;ks
                                </p>
                              </div>
                              <div className="font-mono text-[12px] text-bone flex-shrink-0">
                                {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                              </div>
                            </div>
                          ))}
                          {cartItems.length > 4 && (
                            <div className="px-4 py-2">
                              <span className="font-mono text-[10px] tracking-[0.14em] text-mute">
                                + {cartItems.length - 4} další {cartItems.length - 4 === 1 ? 'položka' : 'položky'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-line px-4 py-4 flex flex-col gap-3">
                          <div className="flex justify-between items-baseline">
                            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim">Mezisoučet</span>
                            <span className="font-mono text-[13px] text-bone">{subtotal.toLocaleString('cs-CZ')} Kč</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-dim">Doprava</span>
                            <span className="font-mono text-[11px] text-dim">{SHIPPING} Kč</span>
                          </div>
                          <Link
                            href="/checkout"
                            className="mt-1 w-full py-3.5 bg-bone text-[#0a0a0a] font-mono text-[11px] tracking-[0.26em] uppercase text-center border border-bone hover:bg-[#0f0f0f] hover:text-bone transition-colors duration-200 block"
                          >
                            Do košíku →
                          </Link>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </nav>

      {/* Mobile slide-out */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/75 z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-64 z-[70] flex flex-col border-l border-line"
              style={{ background: '#0a0a0a' }}
            >
              <div className="flex items-center justify-between px-6 h-[68px] border-b border-line">
                <span className="font-cloister text-sm text-bone tracking-widest uppercase">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Zavřít menu" className="text-dim hover:text-bone transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-5 pt-6">
                {[
                  { label: 'Shop', href: '/shop' },
                  { label: 'Size Guide', href: '/size-guide' },
                  { label: 'Archiv', href: '/archiv' },
                  { label: 'Behind the brand', href: '/behind-the-brand' },
                  { label: 'Kontakt', href: '/kontakt' },
                  { label: 'Košík', href: '/checkout' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-dim hover:text-bone transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
