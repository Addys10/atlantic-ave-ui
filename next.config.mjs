/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/',
        permanent: false,
      },
      {
        source: '/shop/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/product/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/checkout',
        destination: '/',
        permanent: false,
      },
      {
        source: '/checkout/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/thank-you',
        destination: '/',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.shopify.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Komprese
  compress: true,
};

export default nextConfig;
