'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

// CS / EN toggle. Keeps the visitor on the same page in the chosen locale by
// swapping only the locale prefix of the current (locale-agnostic) pathname.
// usePathname() already returns dynamic segments resolved (e.g. /product/foo).
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div className={`flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase ${className}`}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-line select-none" aria-hidden="true">/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === locale ? 'true' : undefined}
            className={`transition-colors duration-200 ${
              l === locale ? 'text-bone' : 'text-dim hover:text-bone'
            }`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
