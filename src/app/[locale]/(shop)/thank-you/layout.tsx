import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta.pages.thankYou' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
