'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RestockPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-[calc(100vh-58px)] relative flex flex-col">

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      <div className="relative z-[2] flex flex-col flex-1 items-start px-8 md:px-14 pb-14 pt-12">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="h-px w-8 bg-[#1f1f1f]" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#555]">
            Restock · Drop 02
          </span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-anton uppercase leading-[0.85] tracking-tight text-[#f4f1ea]"
            style={{ fontSize: 'clamp(72px, 16vw, 220px)' }}
          >
            Registrace
          </motion.h1>
        </div>
        <div className="overflow-hidden pt-8 mb-12">
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="font-anton uppercase leading-[0.85] tracking-tight"
            style={{
              fontSize: 'clamp(72px, 16vw, 220px)',
              WebkitTextStroke: '1.5px #f4f1ea',
              color: 'transparent',
            }}
          >
            uzavřeny.
          </motion.h1>
        </div>

        {/* Body text + links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row md:items-end justify-between w-full gap-8 border-t border-[#1f1f1f] pt-8"
        >
          <p className="font-mono text-[11px] tracking-[0.1em] leading-[1.9] text-[#555] max-w-[46ch]">
            Okno pro registraci zájmu o restock Drop 02 je uzavřeno.
            <br />
            Informace o dalším dropu oznámíme na Instagramu.
          </p>

          <div className="flex items-center gap-8">
            <a
              href="https://www.instagram.com/atlantic_ave_100th_"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#555] hover:text-[#f4f1ea] transition-colors duration-200 inline-flex items-center gap-2"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
            <Link
              href="/shop"
              className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#f4f1ea] border border-[#f4f1ea]/20 hover:border-[#f4f1ea]/60 px-5 py-3 transition-colors duration-200"
            >
              ← Shop
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
