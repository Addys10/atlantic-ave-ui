'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import ProductDescriptionAccordion from '@/components/ProductDescriptionAccordion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
  variantId?: string;
  availableQuantity?: number;
  handle?: string;
}

export default function ProductDetail({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${params.handle}`);

        if (!response.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.productByHandle) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const { mapShopifyProductToProduct } = await import('@/lib/shopify-helpers');
        const mappedProduct = mapShopifyProductToProduct(data.productByHandle);
        setProduct(mappedProduct);
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
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

    // Získáme variantId a skladové informace pokud produkt pochází ze Shopify
    let variantId = product.variantId;
    let availableQuantity: number | undefined = undefined;

    if (product.handle && !variantId) {
      try {
        const response = await fetch(`/api/products/${product.handle}`);
        const data = await response.json();

        if (data.productByHandle) {
          const variant = data.productByHandle.variants.edges.find(
            (edge: any) => edge.node.title === selectedSize
          );
          if (variant) {
            variantId = variant.node.id;
            availableQuantity = variant.node.quantityAvailable;
          }
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
      // Kontrola dostupnosti před zvýšením množství
      const newQuantity = cart[existingItemIndex].quantity + 1;
      if (availableQuantity !== undefined && newQuantity > availableQuantity) {
        alert(`Lze objednat maximálně ${availableQuantity} kusů této velikosti. Již máte ${cart[existingItemIndex].quantity} v košíku.`);
        setIsAdding(false);
        return;
      }
      // Zvýšíme množství
      cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Kontrola dostupnosti před přidáním
      if (availableQuantity !== undefined && availableQuantity < 1) {
        alert('Tato velikost není momentálně skladem.');
        setIsAdding(false);
        return;
      }
      // Přidáme novou položku
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        quantity: 1,
        variantId,
        availableQuantity,
        handle: product.handle,
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

  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (!product?.images) return;
    setLightboxImageIndex((prev) => (prev + 1) % product.images!.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setLightboxImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product]);

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
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Produkt nenalezen</h1>
        <p className="text-gray-600 mb-8">
          Omlouváme se, ale tento produkt není dostupný nebo se nepodařilo načíst jeho informace.
        </p>
        <Link href="/shop" className="btn-primary">
          Zpět na produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="relative bg-secondary min-h-screen py-2 sm:py-2">
      <div className="container-custom">
        {/* Notifikace */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:bottom-8 z-50 max-w-md mx-auto"
            >
              <div className="bg-white text-gray-900 px-4 py-3 md:px-6 md:py-4 rounded-xl shadow-2xl border border-gray-200 flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="bg-green-500 rounded-full p-1.5 flex-shrink-0"
                >
                  <Check size={18} className="text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base mb-0.5">
                    Přidáno do košíku
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {product.name}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="text-xs md:text-sm font-medium text-primary hover:underline whitespace-nowrap flex-shrink-0"
                >
                  Zobrazit košík →
                </Link>
              </div>
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
              className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
              onClick={() => openLightbox(selectedImageIndex)}
            >
              <Image
                src={product.images?.[selectedImageIndex] || product.image}
                alt={`${product.name} - obrázek ${selectedImageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={selectedImageIndex === 0}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <ProductDescriptionAccordion htmlContent={product.description} />
            </motion.div>

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
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={40} />
            </motion.button>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[90vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.images?.[lightboxImageIndex] || product.image}
                alt={`${product.name} - obrázek ${lightboxImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full p-3"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
                {lightboxImageIndex + 1} / {product.images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
