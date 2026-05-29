import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/thank-you', '/checkout'],
      },
    ],
    sitemap: 'https://atlanticave.cz/sitemap.xml',
  };
}
