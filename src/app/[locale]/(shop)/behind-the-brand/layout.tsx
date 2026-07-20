import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.behindBrand' });
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} — Atlantic Ave`,
      description: t('description'),
    },
  };
}

export default function BehindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
