'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export default function ShopPage() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detekce mobile zařízení
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        const { mapShopifyProducts } = await import('@/lib/shopify-helpers');
        const shopifyProducts = data.products.edges.map((edge: any) => edge.node);
        const mappedProducts = mapShopifyProducts(shopifyProducts);

        setProducts(mappedProducts);
        setError(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Něco se pokazilo</h2>
            <p className="text-gray-600 mb-8">
              Omlouváme se, ale nepodařilo se načíst produkty. Zkuste to prosím později.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Zkusit znovu
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/product/${product.handle || product.id}`}>
                <motion.div
                  {...(!isMobile && { whileHover: { y: -8 } })}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => !isMobile && setHoveredProduct(product.id)}
                  onMouseLeave={() => !isMobile && setHoveredProduct(null)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[1/1] mb-4 overflow-hidden bg-gray-100">
                    <motion.div
                      {...(!isMobile && { whileHover: { scale: 1.05 } })}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>

                    {/* Quick View Overlay - Only on Desktop */}
                    {!isMobile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: hoveredProduct === product.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-4 pointer-events-none"
                      >
                        <div className="text-white text-center px-4">
                          <p className="text-sm mb-3">Dostupné velikosti</p>
                          <div className="flex gap-2 justify-center mb-4">
                            {product.sizes
                              .filter(size => size.available)
                              .map((size) => (
                              <span
                                key={size.name}
                                className="border border-white px-3 py-1 text-sm"
                              >
                                {size.name}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm font-medium tracking-wider">
                            ZOBRAZIT DETAIL
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3 pt-4">
                    <div>
                      <h3 className={`text-2xl font-bold tracking-tight uppercase mb-1 transition-all duration-300 ${!isMobile ? 'group-hover:tracking-wide' : ''}`}>
                        {product.name}
                      </h3>
                      <div className={`w-12 h-0.5 bg-black transition-all duration-300 ${!isMobile ? 'group-hover:w-20' : ''}`} />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight">
                        {product.price}
                      </span>
                      <span className="text-lg text-gray-600 font-medium">Kč</span>
                    </div>
                    {!isMobile && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: hoveredProduct === product.id ? 1 : 0,
                          x: hoveredProduct === product.id ? 0 : -10,
                        }}
                        transition={{ duration: 0.2 }}
                        className="text-sm text-gray-500 uppercase tracking-wider font-medium"
                      >
                        Zobrazit více →
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
