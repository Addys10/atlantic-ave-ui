import type { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://atlanticave.cz';

// Build a localized URL for a path. The default locale (cs) has no prefix.
function localizedUrl(path: string, locale: string): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

// Expand one path into one sitemap entry per locale, each carrying hreflang
// alternates for every locale.
function expand(
  path: string,
  opts: Pick<MetadataRoute.Sitemap[number], 'priority' | 'changeFrequency' | 'lastModified'>
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localizedUrl(path, l)])
  );
  return routing.locales.map((locale) => ({
    url: localizedUrl(path, locale),
    alternates: { languages },
    ...opts,
  }));
}

const STATIC_PATHS: Array<{ path: string } & Pick<MetadataRoute.Sitemap[number], 'priority' | 'changeFrequency'>> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/archiv', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/behind-the-brand', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/size-guide', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/restock', priority: 0.4, changeFrequency: 'weekly' },
  { path: '/kontakt', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/pravni-upozorneni', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/policies/ochrana-osobnich-udaju', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/policies/podminky-sluzby', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/policies/vraceni-penez', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/policies/dorucovani', priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = STATIC_PATHS.flatMap(({ path, ...opts }) => expand(path, opts));

  try {
    const db = createServiceClient();
    const { data: products } = await db
      .from('products')
      .select('slug, updated_at')
      .eq('active', true);

    const productRoutes = (products ?? []).flatMap(p =>
      expand(`/product/${p.slug}`, {
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        priority: 0.8,
        changeFrequency: 'weekly',
      })
    );

    return [...staticRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
