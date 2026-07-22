import type { Viewport } from 'next';
import Navbar from '@/components/Navbar';

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
    </>
  );
}
