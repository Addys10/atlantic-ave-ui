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

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/archiv', label: 'Archiv' },
  { href: '/behind-the-brand', label: 'Behind the Brand' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0a09] text-[#eae3d6]">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-[200] flex items-center justify-between gap-4 px-6 md:px-9 py-5 bg-[#0b0a09]/70 backdrop-blur-xl">
        <Link href="/" className="font-anton text-[21px] uppercase tracking-[0.06em] text-[#eae3d6]">
          Atlantic Ave
        </Link>
        <div className="flex items-center gap-6 md:gap-9 flex-wrap">
          <div className="hidden sm:flex gap-7 font-mono text-[12px] tracking-[0.14em] uppercase">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[#8a8178] hover:text-[#eae3d6] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8a8178] hover:text-[#eae3d6] transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.0, 0.0, 0.2, 1] }}
        >
          <Image
            src="/images/nfl-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            quality={100}
            className="object-contain object-[center_42%]"
            style={{ filter: 'invert(1) grayscale(0.35) contrast(1.1)', opacity: 0.55 }}
          />
        </motion.div>

        {/* Radial vignette */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(11,10,9,0.35) 0%, rgba(11,10,9,0.72) 70%, rgba(11,10,9,0.95) 100%)',
          }}
        />

        <div className="relative z-[2] flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-10 font-mono text-[12px] uppercase tracking-[0.3em] text-[#b3a99c]"
          >
            Ostrava, CZ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 font-anton uppercase leading-[0.84] tracking-[0.01em] text-[#eae3d6]"
            style={{ fontSize: 'clamp(76px, 18vw, 260px)', textShadow: '0 4px 40px rgba(0,0,0,0.5)' }}
          >
            Atlantic<br />Ave
          </motion.h1>

          <motion.div
            className="mt-11"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.16em] text-[#eae3d6]"
            >
              <span>Vstoupit do shopu</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center"
        >
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-8 w-px bg-gradient-to-b from-[#eae3d6]/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="mx-auto max-w-[760px] px-6 pt-12 pb-[120px] text-center">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 font-grotesk font-medium leading-[1.4] text-[#eae3d6]"
          style={{ fontSize: 'clamp(24px, 3.4vw, 36px)' }}
        >
          Limitované edice. Od návrhu po balení.<br />S citem pro detail.
        </motion.p>
      </section>

      {/* ── DROP STATUS ── */}
      <section className="mx-auto max-w-[1100px] px-6 pb-[120px]">
        <div className="grid gap-[30px] md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4]"
          >
            <Image
              src="/images/drop2/white-j.jpeg"
              alt="Atlantic Ave lookbook"
              fill
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover"
              style={{
                WebkitMaskImage:
                  'radial-gradient(120% 120% at 50% 50%, #000 45%, transparent 92%)',
                maskImage:
                  'radial-gradient(120% 120% at 50% 50%, #000 45%, transparent 92%)',
              }}
            />
            {/* Edge vignette — blends photo into background */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: 'inset 0 0 120px 55px #0b0a09' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center py-5"
          >
            <div className="mb-5 font-mono text-[12px] uppercase tracking-[0.2em] text-[#8a8178]">
              Připravujeme
            </div>
            <div className="font-anton uppercase leading-[0.9] text-[#eae3d6]" style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}>
              Drop 03
            </div>
            <p className="mb-[30px] mt-[26px] max-w-[420px] text-[16px] leading-[1.6] text-[#b3a99c]">
              Drop 02 i restock jsou rozebrané. Drop 03 už chystáme — sleduj Instagram pro první info.
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 self-start border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#eae3d6]"
            >
              <span>Sledovat</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── BEHIND TEASER ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-[#eae3d6]/10"
      >
        <Link
          href="/behind-the-brand"
          className="group flex flex-col items-center px-6 py-[120px] text-center"
        >
          <div className="mb-[26px] font-mono text-[12px] uppercase tracking-[0.26em] text-[#8a8178]">
            O nás
          </div>
          <div className="font-anton uppercase leading-[0.9] text-[#eae3d6]" style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}>
            Behind the Brand
          </div>
          <p className="mb-[30px] mt-7 max-w-[500px] text-[16px] leading-[1.6] text-[#b3a99c]">
            Jak Atlantic Ave vzniklo a co za ním stojí. Od nápadu v Americe po první limitovaný drop.
          </p>
          <span className="inline-flex items-center gap-2 border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#eae3d6]">
            <span>Přečíst příběh</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#eae3d6]/10 px-6 md:px-9 pb-11 pt-[70px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-anton text-[26px] uppercase text-[#eae3d6]">Atlantic Ave</div>
            <div className="mt-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-[#8a8178]">
              Limitované edice.
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8178]">
              Navigace
            </div>
            <div className="flex flex-col gap-2.5 font-grotesk text-[14px]">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-[#c3bab0] hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8178]">
              Podmínky
            </div>
            <div className="flex flex-col gap-2.5 font-grotesk text-[14px] text-[#8a8178]">
              <Link href="/policies/vraceni-penez" className="hover:text-[#c3bab0] transition-colors">Vrácení zboží</Link>
              <Link href="/policies/dorucovani" className="hover:text-[#c3bab0] transition-colors">Doprava</Link>
              <Link href="/policies/ochrana-osobnich-udaju" className="hover:text-[#c3bab0] transition-colors">Ochrana osobních údajů</Link>
            </div>
          </div>

          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8178]">
              Instagram
            </div>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-grotesk text-[14px] text-[#eae3d6] hover:text-white transition-colors"
            >
              @atlantic_ave_100th_ →
            </a>
          </div>
        </div>

        <div className="mt-[50px] font-mono text-[11px] tracking-[0.1em] text-[#4d463c]">
          © 2026 Atlantic Ave
        </div>
      </footer>

    </div>
  );
}
