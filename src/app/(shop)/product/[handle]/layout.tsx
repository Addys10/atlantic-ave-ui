import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase';

export async function generateMetadata(
  { params }: { params: { handle: string } }
): Promise<Metadata> {
  const db = createServiceClient();
  const { data } = await db
    .from('products')
    .select('name, subtitle, images')
    .eq('slug', params.handle)
    .single();

  if (!data) return { title: 'Produkt' };

  const image = data.images?.[0] ?? null;

  return {
    title: data.name,
    description: data.subtitle || `${data.name} — Atlantic Ave`,
    openGraph: {
      title: `${data.name} — Atlantic Ave`,
      description: data.subtitle || `${data.name} — Atlantic Ave`,
      ...(image ? { images: [{ url: image, width: 1200, height: 1500, alt: data.name }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} — Atlantic Ave`,
      description: data.subtitle || `${data.name} — Atlantic Ave`,
      ...(image ? { images: [{ url: image, alt: data.name }] } : {}),
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
