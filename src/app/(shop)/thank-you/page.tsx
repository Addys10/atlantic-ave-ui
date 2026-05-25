'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (sessionId) {
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-6 px-6">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent">Chyba platby</p>
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-dim text-center max-w-xs">
          Při zpracování platby došlo k chybě. Zkuste to prosím znovu.
        </p>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-3 pb-[6px] border-b border-bone font-mono text-[11px] tracking-[0.24em] uppercase text-bone hover:gap-5 transition-all duration-300"
        >
          <span>Zpět do košíku</span>
          <span>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg flex flex-col gap-10">

        {/* Top line */}
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-dim text-center">
          ⊕ Platba potvrzena
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1 className="font-anton text-[clamp(56px,8vw,100px)] uppercase leading-[0.88] tracking-tight text-bone">
            Díky za<br />objednávku
          </h1>
        </div>

        {/* Details */}
        <div className="border-t border-line pt-8 flex flex-col gap-4">
          {[
            'Objednávka přijata a zpracována',
            'Expedice do 2 pracovních dnů',
            'Platba zpracována přes Stripe',
          ].map(line => (
            <div key={line} className="flex items-center gap-4 font-mono text-[11px] tracking-[0.14em] uppercase text-dim">
              <span className="text-bone">⊕</span>
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* Session ID */}
        {sessionId && (
          <div className="border border-line px-4 py-3">
            <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute mb-1">Číslo objednávky</div>
            <div className="font-mono text-[11px] text-dim break-all">{sessionId}</div>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/shop"
          className="w-full py-[22px] bg-bone text-[#0a0a0a] font-mono text-[12px] tracking-[0.26em] uppercase border border-bone hover:bg-[#0a0a0a] hover:text-bone transition-colors duration-200 text-center"
        >
          Zpět do shopu →
        </Link>

        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-mute text-center">
          Otázky? Napište nám na{' '}
          <a href="mailto:info@atlanticave.cz" className="text-dim hover:text-bone transition-colors">
            atlanticave-eshop@seznam.cz
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-7 w-7 border-b border-bone" />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
