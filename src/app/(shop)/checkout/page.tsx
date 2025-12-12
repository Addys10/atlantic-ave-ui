'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  quantity: number;
  variantId?: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutUrl, setCheckoutUrl] = useState('');

  useEffect(() => {
    // Načteme košík ze sessionStorage
    const cartJson = sessionStorage.getItem('cart');
    if (!cartJson) {
      setLoading(false);
      return;
    }

    const cartData: CartItem[] = JSON.parse(cartJson);
    setCart(cartData);
    setLoading(false);
  }, []);

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    sessionStorage.setItem('cart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      // Připravíme items pro Shopify Cart API
      const lines = cart.map(item => ({
        merchandiseId: item.variantId || item.id, // Použij variantId pokud existuje
        quantity: item.quantity,
      }));

      // Vytvoříme košík v Shopify
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines }),
      });

      if (!response.ok) {
        throw new Error('Nepodařilo se vytvořit košík');
      }

      const data = await response.json();

      if (data.cartCreate?.cart?.checkoutUrl) {
        // Přesměrujeme na Shopify checkout
        window.location.href = data.cartCreate.cart.checkoutUrl;
      } else if (data.cartCreate?.userErrors?.length > 0) {
        setError(data.cartCreate.userErrors[0].message);
        setLoading(false);
      } else {
        setError('Nepodařilo se získat checkout URL');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Došlo k chybě při vytváření objednávky. Zkuste to prosím znovu.');
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingBag size={64} className="text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Košík je prázdný</h1>
        <p className="text-gray-600 mb-8">Nejdřív si vyberte produkt</p>
        <Link href="/shop" className="btn-primary">
          Přejít na produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8 text-center">Košík</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-lg p-8 shadow-lg h-fit">
            <h2 className="text-2xl font-semibold mb-6">Souhrn objednávky</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b">
                  <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">Velikost: {item.selectedSize}</p>
                    <p className="text-gray-600 text-sm">Množství: {item.quantity}×</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <div className="font-semibold">
                      {item.price * item.quantity} Kč
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Odstranit z košíku"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Mezisoučet</span>
                <span>{getTotalPrice()} Kč</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Doprava</span>
                <span className="text-green-600">Vypočítá se při platbě</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Celkem</span>
                <span>{getTotalPrice()} Kč</span>
              </div>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Pokračovat k platbě</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Zabezpečená platba přes Shopify</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Platební karty, Apple Pay, Google Pay</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ochrana kupujících</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Přesměrování...
                </span>
              ) : (
                'Pokračovat k platbě'
              )}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Budete přesměrováni na zabezpečený Shopify checkout
            </p>

            <div className="mt-6 pt-6 border-t">
              <Link href="/shop" className="text-primary hover:underline text-center block">
                ← Pokračovat v nákupu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
