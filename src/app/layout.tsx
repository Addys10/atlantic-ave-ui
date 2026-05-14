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
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const BASE_URL = 'https://atlanticave.cz';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Atlantic Ave',
    template: '%s — Atlantic Ave',
  },
  description: 'Limitovaný streetwear. Každý kus je edice.',
  openGraph: {
    type: 'website',
    siteName: 'Atlantic Ave',
    title: 'Atlantic Ave',
    description: 'Limitovaný streetwear. Každý kus je edice.',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlantic Ave',
    description: 'Limitovaný streetwear. Každý kus je edice.',
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
