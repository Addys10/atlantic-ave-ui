import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.sizeGuide' });
  return { title: t('title'), description: t('description') };
}

export default function SizeGuidePage() {
  const t = useTranslations('sizeGuide');
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">{t('title')}</span>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">{t('category')}</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-20 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <h1 className="font-anton text-[clamp(36px,6vw,72px)] uppercase leading-[0.9] tracking-tight text-bone">
            {t('title')}
          </h1>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-dim leading-relaxed">
            {t('unit')}
          </p>
        </div>

        <div className="border border-line overflow-hidden">
          <Image
            src="/images/size-guide.png"
            alt={t('imageAlt')}
            width={1200}
            height={900}
            className="w-full h-auto"
            priority
          />
        </div>


      </div>
    </div>
  );
}
