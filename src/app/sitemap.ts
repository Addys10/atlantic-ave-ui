import type { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase';

const BASE_URL = 'https://atlanticave.cz';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/shop`, priority: 0.9, changeFrequency: 'daily' },
  { url: `${BASE_URL}/archiv`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/behind-the-brand`, priority: 0.5, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/size-guide`, priority: 0.4, changeFrequency: 'monthly' },
  { url: `${BASE_URL}/restock`, priority: 0.4, changeFrequency: 'weekly' },
  { url: `${BASE_URL}/kontakt`, priority: 0.4, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/pravni-upozorneni`, priority: 0.2, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/policies/ochrana-osobnich-udaju`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/policies/podminky-sluzby`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/policies/vraceni-penez`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${BASE_URL}/policies/dorucovani`, priority: 0.3, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = createServiceClient();
    const { data: products } = await db
      .from('products')
      .select('slug, updated_at')
      .eq('active', true);

    const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(p => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      priority: 0.8,
      changeFrequency: 'weekly',
    }));

    return [...STATIC_ROUTES, ...productRoutes];
  } catch {
    return STATIC_ROUTES;
  }
}
