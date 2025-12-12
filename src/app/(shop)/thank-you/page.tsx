'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntent) {
      // Zde můžete volitelně ověřit platbu na backendu
      setPaymentStatus('success');

      // Vyčistíme sessionStorage
      sessionStorage.removeItem('cart');
    } else {
      // Pokud není payment_intent, pravděpodobně jsme byli přesměrováni ze Shopify checkout
      setPaymentStatus('success');
      sessionStorage.removeItem('cart');
    }
  }, [paymentIntent]);

  if (paymentStatus === 'loading') {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Ověřuji platbu...</p>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="container-custom py-20 text-center">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-12">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-4xl font-bold mb-4 text-red-600">Chyba platby</h1>
          <p className="text-gray-600 mb-8">
            Při zpracování platby došlo k chybě. Zkuste to prosím znovu.
          </p>
          <Link href="/shop" className="btn-primary">
            Zpět na shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen py-20">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-12 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 text-green-600">
            Děkujeme za objednávku!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Vaše platba byla úspěšně zpracována
          </p>

          {paymentIntent && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">Číslo platby</p>
              <p className="font-mono text-sm break-all">{paymentIntent}</p>
            </div>
          )}

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <p className="font-semibold">Potvrzení e-mailem</p>
                <p className="text-gray-600 text-sm">
                  Potvrzení objednávky jsme vám odeslali na e-mail
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <p className="font-semibold">Expedice objednávky</p>
                <p className="text-gray-600 text-sm">
                  Vaši objednávku expedujeme do 2 pracovních dnů
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-1">✓</div>
              <div>
                <p className="font-semibold">Zpracování přes Shopify</p>
                <p className="text-gray-600 text-sm">
                  Vaše objednávka je zabezpečená a můžete ji sledovat ve vašem Shopify účtu
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              Zpět na shop
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-2xl mx-auto mt-8 text-center text-gray-600">
          <p className="mb-2">
            Máte otázku k objednávce? Kontaktujte nás na{' '}
            <a href="mailto:info@atlanticave.cz" className="text-primary hover:underline">
              info@atlanticave.cz
            </a>
          </p>
          <p className="text-sm">
            Nebo volejte na telefonním čísle +420 123 456 789
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Načítání...</p>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
