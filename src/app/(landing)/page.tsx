'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
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
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          {/* Logo/Brand Name with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-cloister mb-8 text-7xl font-bold tracking-wider text-white md:text-9xl">
              ATLANTIC
            </h1>
            <h2 className="font-cloister mb-16 text-4xl font-light tracking-[0.3em] text-white/90 md:text-5xl">
              AVE
            </h2>
          </motion.div>

          {/* Enter Button with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05, letterSpacing: '0.15em' }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden border-2 border-white bg-transparent px-12 py-4 text-lg font-light tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                <motion.span
                  className="relative z-10"
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: 1 }}
                >
                  VSTOUPIT
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
