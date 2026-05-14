import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Limitovaný streetwear. Každý kus je edice — po vyprodání nebude restockováno.',
  openGraph: {
    title: 'Shop — Atlantic Ave',
    description: 'Limitovaný streetwear. Každý kus je edice — po vyprodání nebude restockováno.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
