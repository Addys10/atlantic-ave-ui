'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/products';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
  variantId?: string;
}

export default function ProductDetail({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.handle}`);

        if (!response.ok) {
          // Zkusíme najít v mock datech podle handle
          const mockProduct = mockProducts.find(p => p.handle === params.handle || p.id === params.handle);
          setProduct(mockProduct || null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.productByHandle) {
          const mockProduct = mockProducts.find(p => p.handle === params.handle || p.id === params.handle);
          setProduct(mockProduct || null);
          setLoading(false);
          return;
        }

        const { mapShopifyProductToProduct } = await import('@/lib/shopify-helpers');
        const mappedProduct = mapShopifyProductToProduct(data.productByHandle);
        setProduct(mappedProduct);
      } catch (error) {
        console.error('Error loading product:', error);
        const mockProduct = mockProducts.find(p => p.handle === params.handle || p.id === params.handle);
        setProduct(mockProduct || null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.handle]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Prosím vyberte velikost');
      return;
    }

    if (!product) return;

    setIsAdding(true);

    // Získáme variantId pokud produkt pochází ze Shopify
    let variantId = product.variantId;

    if (product.handle && !variantId) {
      try {
        const response = await fetch(`/api/products/${product.handle}`);
        const data = await response.json();

        if (data.productByHandle) {
          const variant = data.productByHandle.variants.edges.find(
            (edge: any) => edge.node.title === selectedSize
          );
          variantId = variant?.node.id;
        }
      } catch (error) {
        console.error('Error fetching variant:', error);
      }
    }

    // Získáme aktuální košík
    const cartJson = sessionStorage.getItem('cart');
    const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

    // Přidáme produkt do košíku
    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      // Zvýšíme množství
      cart[existingItemIndex].quantity += 1;
    } else {
      // Přidáme novou položku
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        quantity: 1,
        variantId,
      });
    }

    // Uložíme košík
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Zobrazíme notifikaci
    setShowNotification(true);

    // Resetujeme výběr velikosti
    setTimeout(() => {
      setSelectedSize('');
      setIsAdding(false);
    }, 300);

    // Skryjeme notifikaci po 3 sekundách
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produkt nenalezen</h1>
        <Link href="/shop" className="btn-primary">
          Zpět na shop
        </Link>
      </div>
    );
  }

  return (
    <div className="relative bg-secondary min-h-screen py-2 sm:py-2">
      <div className="container-custom">
        {/* Luxusní notifikace */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-green-500 rounded-full p-1"
              >
                <Check size={20} />
              </motion.div>
              <span className="font-medium text-lg">
                Produkt {product.name} byl vložen do košíku
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <Link href="/shop" className="text-primary hover:underline inline-block">
            ← Zpět na produkty
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg p-8 shadow-lg"
        >
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={product.images?.[selectedImageIndex] || product.image}
                alt={`${product.name} - obrázek ${selectedImageIndex + 1}`}
                fill
                className="object-cover"
                priority={selectedImageIndex === 0}
              />
            </motion.div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index
                        ? 'ring-4 ring-black ring-offset-2'
                        : 'ring-2 ring-gray-200 hover:ring-gray-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 mb-2 uppercase tracking-wider"
            >
              {product.category}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold mb-4 uppercase tracking-tight"
            >
              {product.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-baseline gap-2 mb-6"
            >
              <span className="text-4xl font-bold">{product.price}</span>
              <span className="text-2xl text-gray-600">Kč</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-700 mb-8 text-lg leading-relaxed"
            >
              {product.description}
            </motion.p>

            {/* Size Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <label className="block text-lg font-semibold mb-4 uppercase tracking-wide">
                Vyberte velikost:
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size, index) => (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`px-8 py-4 border-2 rounded-lg font-bold transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`btn-primary w-full text-lg flex items-center justify-center gap-3 ${
                isAdding ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart size={22} />
              <span>{isAdding ? 'Přidávání...' : 'Vložit do košíku'}</span>
            </motion.button>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-8 border-t pt-8"
            >
              <h3 className="font-semibold mb-4 uppercase tracking-wide">Informace o produktu</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Prémiová kvalita materiálu</li>
                <li>• Dostupné velikosti: {product.sizes.join(', ')}</li>
                <li>• Zpracováno přes Shopify</li>
                <li>• Možnost vrácení do 30 dní</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
