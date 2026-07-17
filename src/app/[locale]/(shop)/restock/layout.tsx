import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restock',
  description: 'Přihlas se na čekací listinu a buď první, kdo se dozví o restocku Atlantic Ave.',
  openGraph: {
    title: 'Restock — Atlantic Ave',
    description: 'Přihlas se na čekací listinu a buď první, kdo se dozví o restocku Atlantic Ave.',
  },
};

export default function RestockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
