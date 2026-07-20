import { useTranslations } from 'next-intl';

export const metadata = {
  title: 'Právní upozornění | Atlantic Ave',
  description: 'Právní upozornění',
};

export default function PravniUpozorneniPage() {
  const t = useTranslations('pravniUpozorneni');
  const sections = [
    { title: t('s1Title'), body: t('s1Body') },
    { title: t('s2Title'), body: t('s2Body') },
    { title: t('s3Title'), body: t('s3Body') },
    { title: t('s4Title'), body: t('s4Body') },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">{t('title')}</span>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-20 flex flex-col gap-16">
        <h1 className="font-anton text-[clamp(40px,5vw,72px)] uppercase leading-[0.9] tracking-tight text-bone">
          {t('title')}
        </h1>
        <div className="flex flex-col">
          {sections.map(({ title, body }, i) => (
            <div key={title} className={`flex flex-col gap-3 py-8 ${i < sections.length - 1 ? 'border-b border-line' : ''}`}>
              <h2 className="font-mono text-[10px] tracking-[0.26em] uppercase text-bone font-normal">{title}</h2>
              <p className="font-mono text-[12px] tracking-[0.04em] leading-[1.8] text-dim">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
