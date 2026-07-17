import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Behind the Brand',
  description: 'Jak Atlantic Ave vzniklo — od nápadu v Americe po první limitovaný drop.',
  openGraph: {
    title: 'Behind the Brand — Atlantic Ave',
    description: 'Jak Atlantic Ave vzniklo — od nápadu v Americe po první limitovaný drop.',
  },
};

export default function BehindLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
