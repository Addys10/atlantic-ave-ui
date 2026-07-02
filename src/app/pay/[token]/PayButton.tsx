'use client';

import { useState } from 'react';

export function PayButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pay/${token}/checkout`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Nepodařilo se zahájit platbu');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Nepodařilo se zahájit platbu');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={pay}
        disabled={loading}
        className="w-full py-5 bg-bone text-canvas font-mono text-[12px] tracking-[0.28em] uppercase border border-bone hover:bg-canvas hover:text-bone transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Zpracovávám…' : 'Zaplatit kartou →'}
      </button>
      {error && (
        <p className="font-mono text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}
