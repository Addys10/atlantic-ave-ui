import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">404</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-24 gap-8">
        <span className="font-anton text-[96px] leading-none text-line select-none">404</span>

        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-anton text-[22px] uppercase tracking-tight text-bone">
            Stránka nenalezena
          </h1>
          <p className="font-mono text-[12px] tracking-[0.08em] leading-relaxed text-dim max-w-[36ch]">
            Stránka, kterou hledáš, neexistuje nebo byla přesunuta.
          </p>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 bg-bone text-[#0a0a0a] font-mono text-[11px] tracking-[0.28em] uppercase px-7 py-4 hover:bg-white transition-colors duration-200"
          >
            <span>Do shopu</span>
            <span>→</span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.24em] uppercase text-dim hover:text-bone transition-colors duration-200 pb-px border-b border-dim/40 hover:border-bone/50"
          >
            Zpět domů
          </Link>
        </div>
      </div>
    </div>
  );
}
