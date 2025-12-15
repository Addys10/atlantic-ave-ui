import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cloister = localFont({
  src: "../../public/fonts/cloister.ttf",
  variable: "--font-cloister",
});

export const metadata: Metadata = {
  title: "Atlantic Ave",
  description: "Streetwear",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  themeColor: '#ffffff',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${cloister.variable} flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
