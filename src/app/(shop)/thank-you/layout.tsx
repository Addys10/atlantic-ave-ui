import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Potvrzení objednávky',
  description: 'Vaše objednávka byla úspěšně přijata.',
  robots: { index: false, follow: false },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
