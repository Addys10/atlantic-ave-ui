'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const INSTAGRAM = 'https://www.instagram.com/atlantic_ave_100th_';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/archiv', label: 'Archiv' },
  { href: '/behind-the-brand', label: 'Behind the Brand' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0a09] text-[#eae3d6]">

      {/* ── HERO ── */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">
        <motion.div
          className="absolute inset-0 z-0 md:[-webkit-mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%_-_128px),transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0,black_128px,black_calc(100%_-_128px),transparent_100%)]"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3, ease: [0.0, 0.0, 0.2, 1] }}
        >
          {/* Looping background video (muted + playsInline are required for mobile autoplay) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-poster.jpg"
            className="h-full w-full object-cover object-center motion-reduce:hidden"
            style={{ filter: 'grayscale(0.4) contrast(1.08) brightness(0.88)' }}
          >
            <source src="/videos/land-v.mp4" type="video/mp4" />
          </video>
          {/* Static fallback for users with reduced-motion preference */}
          <div
            aria-hidden="true"
            className="hidden h-full w-full bg-cover bg-center motion-reduce:block"
            style={{
              backgroundImage: 'url(/images/hero-poster.jpg)',
              filter: 'grayscale(0.4) contrast(1.08) brightness(0.88)',
            }}
          />
        </motion.div>

        {/* Base tint + radial vignette (keeps the wordmark legible over video) */}
        <div className="absolute inset-0 z-[1] bg-[#0b0a09]/15" />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(11,10,9,0.12) 0%, rgba(11,10,9,0.55) 72%, rgba(11,10,9,0.90) 100%)',
          }}
        />

        {/* Film grain — masks the low-res upscaling and gives the hero an editorial texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '160px 160px',
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

      {/* ── DROP STATUS + BEHIND TEASER ── */}
      <section className="mx-auto max-w-[760px] px-6 pb-[120px] text-center">
        {/* Drop 03 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center pb-[90px]"
        >
          <div className="mb-5 font-mono text-[12px] uppercase tracking-[0.22em] text-[#8a8178]">
            Připravujeme
          </div>
          <div className="font-anton uppercase leading-[0.9] text-[#eae3d6]" style={{ fontSize: 'clamp(56px, 9vw, 110px)' }}>
            Drop 03
          </div>
          <p className="mb-[30px] mt-6 max-w-[440px] text-[16px] leading-[1.6] text-[#b3a99c]">
            Drop 03 už chystáme — sleduj Instagram pro první info.
          </p>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#eae3d6]"
          >
            <span>Sledovat</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        {/* Behind the Brand */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-[#eae3d6]/10 pt-[90px]"
        >
          <Link href="/behind-the-brand" className="group flex flex-col items-center">
            <div className="mb-[26px] font-mono text-[12px] uppercase tracking-[0.26em] text-[#8a8178]">
              O nás
            </div>
            <div className="font-anton uppercase leading-[0.9] text-[#eae3d6]" style={{ fontSize: 'clamp(44px, 8vw, 96px)' }}>
              Behind the Brand
            </div>
            <p className="mb-[30px] mt-7 max-w-[500px] text-[16px] leading-[1.6] text-[#b3a99c]">
              Jak Atlantic Ave vzniklo a co za ním stojí.<br />Od nápadu v Americe po první limitovaný drop.
            </p>
            <span className="inline-flex items-center gap-2 border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.14em] text-[#eae3d6]">
              <span>Přečíst příběh</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </motion.div>
      </section>

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
