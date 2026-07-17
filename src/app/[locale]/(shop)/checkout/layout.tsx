import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Košík',
  description: 'Dokončete svou objednávku.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
