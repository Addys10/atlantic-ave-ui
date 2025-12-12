'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/data/products';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export default function ShopPage() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        const { mapShopifyProducts } = await import('@/lib/shopify-helpers');
        const shopifyProducts = data.products.edges.map((edge: any) => edge.node);
        const mappedProducts = mapShopifyProducts(shopifyProducts);

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback na mock produkty
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/nfl.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-white/65" />
      </div>

      <div className="container-custom py-16">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
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
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[1/1] mb-4 overflow-hidden bg-gray-100">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
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

                    {/* Quick View Overlay */}
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
                          {product.sizes.map((size) => (
                            <span
                              key={size}
                              className="border border-white px-3 py-1 text-sm"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm font-medium tracking-wider">
                          ZOBRAZIT DETAIL
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3 pt-4">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight uppercase mb-1 group-hover:tracking-wide transition-all duration-300">
                        {product.name}
                      </h3>
                      <div className="w-12 h-0.5 bg-black group-hover:w-20 transition-all duration-300" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight">
                        {product.price}
                      </span>
                      <span className="text-lg text-gray-600 font-medium">Kč</span>
                    </div>
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
