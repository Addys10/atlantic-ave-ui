import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const description = t('description');
  const ogTitle = t('ogTitle');

  return {
    description,
    openGraph: {
      title: ogTitle,
      description,
      locale: locale === 'en' ? 'en_US' : 'cs_CZ',
    },
    twitter: {
      title: ogTitle,
      description,
    },
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!hasLocale(routing.locales, locale)) notFound();
  // Enables static rendering for the localized subtree.
  setRequestLocale(locale);
  return children;
}
