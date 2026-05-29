import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cloister = localFont({
  src: "../../public/fonts/cloister.ttf",
  variable: "--font-cloister",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = 'https://atlanticave.cz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Atlantic Ave',
    template: '%s — Atlantic Ave',
  },
  description: 'Atlantic Ave — limitovaný streetwear z Ostravy. Každý drop je jedinečná edice v omezeném množství. Oblečení pro ty, kteří chtějí víc než jen oblečení.',
  openGraph: {
    type: 'website',
    siteName: 'Atlantic Ave',
    title: 'Atlantic Ave — Limitovaný Streetwear, Každý Kus je Edice',
    description: 'Atlantic Ave — limitovaný streetwear z Ostravy. Každý drop je jedinečná edice v omezeném množství. Oblečení pro ty, kteří chtějí víc než jen oblečení.',
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Atlantic Ave — Limitovaný Streetwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlantic Ave — Limitovaný Streetwear, Každý Kus je Edice',
    description: 'Atlantic Ave — limitovaný streetwear z Ostravy. Každý drop je jedinečná edice v omezeném množství. Oblečení pro ty, kteří chtějí víc než jen oblečení.',
    images: [`${BASE_URL}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${cloister.variable} ${anton.variable} ${mono.variable} flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
