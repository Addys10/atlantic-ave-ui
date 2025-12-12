import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cloister = localFont({
  src: "../../public/fonts/cloister.ttf",
  variable: "--font-cloister",
});

export const metadata: Metadata = {
  title: "Atlantic Ave - Premium Fashion",
  description: "Luxury streetwear and fashion",
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
