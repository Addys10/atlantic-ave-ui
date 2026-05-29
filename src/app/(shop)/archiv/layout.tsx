import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archiv',
  description: 'Archiv limitovaných dropů Atlantic Ave. Každá kolekce je jedinečná edice — pohled do minulosti značky.',
  openGraph: {
    title: 'Archiv — Atlantic Ave',
    description: 'Archiv limitovaných dropů Atlantic Ave. Každá kolekce je jedinečná edice — pohled do minulosti značky.',
  },
};

export default function ArchivLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
