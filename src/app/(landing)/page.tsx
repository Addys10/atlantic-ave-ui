'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';

export default function LandingPage() {
  // Nastavit theme-color pro iOS Safari safe areas
  useEffect(() => {
    // Přidat meta tag pro černé safe areas
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#000000');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#000000';
      document.head.appendChild(meta);
    }

    // Cleanup - vrátit zpět na bílou při unmount
    return () => {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
    };
  }, []);
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/formula.png"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-screen items-center justify-center px-4">
        <div className="text-center">
          {/* Logo/Brand Name with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-cloister mb-4 text-5xl font-bold tracking-wider text-white sm:text-7xl md:mb-8 md:text-9xl">
              ATLANTIC
            </h1>
            <h2 className="font-cloister mb-8 text-3xl font-light tracking-[0.3em] text-white/90 sm:text-4xl md:mb-16 md:text-5xl">
              AVE
            </h2>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="h-px w-24 bg-white/40" />
            <p className="text-sm font-light tracking-[0.4em] text-white/70 uppercase">
              Coming Soon
            </p>
            <div className="h-px w-24 bg-white/40" />
          </motion.div>

          {/* Be ready + Instagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-5"
          >
            <p className="text-xs font-light tracking-[0.25em] text-white/30 uppercase">
              Be ready.
            </p>
            <a
              href="https://www.instagram.com/atlantic_ave_100th_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors duration-300 hover:text-white/90"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
