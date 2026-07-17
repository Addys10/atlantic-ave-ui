import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  const navLinks = [
    { label: t('shop'), href: '/shop' },
    { label: t('sizeGuide'), href: '/size-guide' },
    { label: t('contact'), href: '/kontakt' },
  ];

  const legalLinks = [
    { label: t('returns'), href: '/policies/vraceni-penez' },
    { label: t('shipping'), href: '/policies/dorucovani' },
    { label: t('termsConditions'), href: '/policies/podminky-sluzby' },
    { label: t('privacy'), href: '/policies/ochrana-osobnich-udaju' },
    { label: t('legalNotice'), href: '/pravni-upozorneni' },
  ];

  return (
    <footer className="border-t border-line bg-[#0a0a0a]">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-0 px-8 py-14 border-b border-line">

        {/* Brand */}
        <div className="flex flex-col gap-4 pb-10 md:pb-0 md:border-r border-line">
          <span className="font-cloister text-base text-bone tracking-[0.22em] uppercase select-none">
            Atlantic Ave
          </span>
          <p className="font-mono text-[11px] tracking-[0.12em] leading-relaxed text-mute max-w-[200px]">
            {t('tagline')}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 py-10 md:py-0 md:px-12 border-t md:border-t-0 md:border-r border-line">
          <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-mute mb-1">{t('navigation')}</div>
          {navLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="font-mono text-[11px] tracking-[0.18em] uppercase text-dim hover:text-bone transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4 pt-10 md:pt-0 md:px-12 border-t md:border-t-0 border-line">
          <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-mute mb-1">{t('terms')}</div>
          {legalLinks.map(({ label, href }) => (
            <Link key={href} href={href} className="font-mono text-[11px] tracking-[0.18em] uppercase text-dim hover:text-bone transition-colors">
              {label}
            </Link>
          ))}
        </div>

      </div>

      {/* Copyright */}
      <div className="px-8 py-5">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">
          {t('copyright', { year: String(new Date().getFullYear()) })}
        </p>
      </div>
    </footer>
  );
}
