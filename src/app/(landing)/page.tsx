'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const INSTAGRAM = 'https://www.instagram.com/atlantic_ave_100th_';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const values = [
  { num: '01', label: 'Limitované edice', sub: 'Každý drop jednou.' },
  { num: '02', label: 'Vyrobeno s péčí', sub: 'Každý detail promyšlený od začátku.' },
  { num: '03', label: 'Vlastní proces', sub: 'Od návrhu po balení — vše pod kontrolou.' },
];

export default function LandingPage() {

  return (
    <div className="bg-black">

      {/* ── HERO ── */}
      <section className="relative h-screen w-full overflow-hidden bg-black">

        {/* Background — slow Ken Burns zoom */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.0, 0.0, 0.2, 1] }}
        >
          <Image
            src="/images/nfl-hero.jpg"
            alt="Hero Drop 2 Atlantic Ave"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ opacity: 0.58 }}
            priority
            quality={100}
          />
        </motion.div>

        {/* Gradient layers */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-transparent to-black" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/35 via-transparent to-transparent" />

        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-0 right-0 z-[10] flex items-center justify-between px-7 md:px-10 h-[68px]"
        >
          <span className="font-mono text-[10px] tracking-[0.36em] text-white/30 uppercase select-none">
            Atlantic Ave
          </span>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/80 transition-colors duration-300"
            aria-label="Instagram"
          >
            <InstagramIcon size={18} />
          </a>
        </motion.div>

        {/* Main content — bottom-left anchored */}
        <div className="absolute bottom-0 left-0 right-0 z-[10] px-7 md:px-12 pb-12 md:pb-16">

          {/* Brand name */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-cloister uppercase text-white leading-[0.85] tracking-[0.08em] select-none"
              style={{ fontSize: 'clamp(44px, 11vw, 148px)' }}
            >
              Atlantic
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-7 md:mb-8">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-5 md:gap-8"
            >
              <span
                className="font-cloister uppercase text-white leading-[0.85] tracking-[0.08em] select-none"
                style={{ fontSize: 'clamp(44px, 11vw, 148px)' }}
              >
                Ave
              </span>
            </motion.div>
          </div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 bg-[#f4f1ea] text-[#0a0a0a] font-mono text-[11px] tracking-[0.28em] uppercase px-7 py-4 hover:bg-white transition-colors duration-200"
            >
              <span>Vstoupit</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <Link
              href="/behind-the-brand"
              className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/40 hover:text-white/75 transition-colors duration-200 pb-px border-b border-white/20 hover:border-white/50"
            >
              Behind the brand
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── SECOND SECTION ── */}
      <section className="bg-[#0a0a0a]">

        {/* Value strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#1f1f1f]">
          {values.map((v, i) => (
            <motion.div
              key={v.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-b md:border-b-0 md:border-r border-[#1f1f1f] last:border-0 px-8 md:px-10 py-10 md:py-12 flex flex-col gap-4"
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#383832]">{v.num}</span>
              <div>
                <p className="font-anton text-[22px] uppercase leading-tight text-[#f4f1ea] mb-2">{v.label}</p>
                <p className="font-mono text-[11px] tracking-[0.1em] leading-relaxed text-[#555]">{v.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA band — Drop 02 close-out + Drop 03 teaser */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="px-8 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[10px] tracking-[0.36em] uppercase text-[#555]">Připravujeme</span>
              <div className="h-px flex-1 max-w-[32px] bg-[#1f1f1f]" />
            </div>
            <h2
              className="font-anton uppercase leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              <span className="text-[#f4f1ea]">Drop</span><br />
              <span
                style={{
                  WebkitTextStroke: '1.5px #f4f1ea',
                  color: 'transparent',
                }}
              >
                03
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-5 items-start md:items-end">
            <div className="flex flex-col gap-3 md:items-end">
              <span className="font-mono text-[9px] tracking-[0.32em] uppercase text-[#f4f1ea]/55 border border-[#f4f1ea]/15 px-2.5 py-1">
                Drop 02 — Sold out
              </span>
              <p className="font-mono text-[12px] tracking-[0.1em] leading-relaxed text-[#7a7a74] max-w-[38ch] md:text-right">
                Drop 02 i restock jsou rozebrané — díky každému, kdo s námi prošel touhle vlnou.<br />
                Drop 03 už chystáme. Sleduj Instagram pro první info.
              </p>
            </div>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 font-mono text-[11px] tracking-[0.28em] uppercase text-[#f4f1ea] border border-[#f4f1ea]/30 hover:border-[#f4f1ea] px-7 py-4 transition-colors duration-200"
            >
              <InstagramIcon size={14} />
              <span>Sledovat</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </motion.div>

        {/* Footer strip */}
        <div className="border-t border-[#1f1f1f] px-8 md:px-12 py-5 flex items-center justify-between">
          <span className="font-cloister text-sm tracking-[0.2em] text-[#f4f1ea]/40 uppercase select-none">
            Atlantic Ave
          </span>
          <div className="flex items-center gap-6">
            <Link href="/behind-the-brand" className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#555] hover:text-[#8a8a85] transition-colors">
              Behind the brand
            </Link>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] hover:text-[#8a8a85] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
