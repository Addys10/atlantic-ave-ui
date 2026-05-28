'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const drops = [
  {
    num: '01',
    year: '2025',
    banner: '/images/formula.png',
    products: [
      { name: 'Atlantic Tee — Black', image: '/images/drop1/Drop1Black.jpeg', text: '' },
      { name: 'Atlantic Tee — White', image: '/images/drop1/Drop1White.jpeg', text: '' },
    ],
  },
] as const;

export default function ArchivPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen relative">

      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      <div className="relative z-[2]">

        {/* ── Hero ── */}
        <div className="pt-8 md:pt-10 pb-0 overflow-hidden">

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-7 md:px-14 mb-6 md:mb-8 flex items-center gap-4"
          >
            <div className="h-px flex-1 max-w-[40px] bg-[#1f1f1f]" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#555]">
              Atlantic Ave — Historie dropů
            </span>
          </motion.div>

          <div className="px-5 md:px-10 overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: '60%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase leading-[0.85] tracking-tight text-[#f4f1ea] select-none"
              style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}
            >
              Archiv
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 md:mt-10 px-5 md:px-10 pb-0 border-b border-[#1f1f1f]"
          >
            <div className="flex items-end justify-between pb-5 gap-6">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#555] max-w-[40ch] leading-relaxed">
                Každý drop existoval jednou. Tady zůstává navždy.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Drop sections ── */}
        {drops.map((drop) => (
          <motion.div
            key={drop.num}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="border-t border-[#1f1f1f]"
          >
            {/* Drop banner */}
            <div className="relative aspect-[16/5] overflow-hidden">
              <Image
                src={drop.banner}
                alt={`Drop ${drop.num}`}
                fill
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-[#0a0a0a]/72" />
              <div className="absolute inset-0 flex flex-col items-start justify-end px-8 md:px-14 pb-10 md:pb-14">
                <span className="font-mono text-[13px] tracking-[0.26em] uppercase text-[#555] mb-3">
                  {drop.year}
                </span>
                <h2
                  className="font-anton uppercase leading-[0.88] tracking-tight text-[#f4f1ea]"
                  style={{ fontSize: 'clamp(52px, 8vw, 120px)' }}
                >
                  {drop.num}
                </h2>
              </div>
            </div>

            {/* Products — foto | text | foto | text */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#1f1f1f]">
              {drop.products.map((product, i) => (
                <div key={product.name} className="col-span-2 grid grid-cols-2 md:contents border-b md:border-b-0 border-[#1f1f1f] last:border-b-0">
                  {/* Photo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    className={`relative aspect-[4/5] overflow-hidden border-r border-[#1f1f1f] ${i % 2 !== 0 ? 'order-2 md:order-none' : ''}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: i * 0.12 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex flex-col justify-start px-6 md:px-8 py-8 md:py-12 md:border-r border-[#1f1f1f] last:border-r-0 ${i % 2 !== 0 ? 'order-1 md:order-none' : ''}`}
                  >
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#383832] mb-4">
                      Vyprodáno
                    </span>
                    <h3
                      className="font-anton uppercase leading-[0.9] tracking-tight text-[#f4f1ea] mb-4"
                      style={{ fontSize: 'clamp(22px, 2.8vw, 44px)' }}
                    >
                      {product.name}
                    </h3>
                    {product.text && (
                      <p className="font-mono text-[11px] tracking-[0.06em] leading-[1.8] text-[#7a7a74]">
                        {product.text}
                      </p>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* ── Drop 02 coming soon ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="border-t border-[#1f1f1f] flex flex-col items-start justify-center px-8 md:px-14 py-10 md:py-14"
        >
          <div className="flex flex-col items-start">
            <span className="font-mono text-[13px] tracking-[0.26em] uppercase text-[#555] mb-3">
              Coming soon
            </span>
            <h2
              className="font-anton uppercase leading-[0.88] tracking-tight text-[#f4f1ea]"
              style={{ fontSize: 'clamp(52px, 8vw, 120px)' }}
            >
              02
            </h2>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
