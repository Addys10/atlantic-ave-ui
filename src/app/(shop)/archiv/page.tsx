'use client';

import { motion } from 'framer-motion';
import ShotsCarousel, { type Shot } from '@/components/ShotsCarousel';

type Drop = {
  title: string;
  status: string;
  date: string;
  shots: Shot[];
};

const drops: Drop[] = [
  {
    title: 'Drop 01',
    status: 'Vyprodáno',
    date: '2024',
    shots: [
      { img: '/images/drop1/Drop1Black.jpeg', label: 'Apex Tee' },
      { img: '/images/drop1/Drop1White.jpeg', label: 'Pitstop Stories Tee' },
      { img: '/images/formula.png', label: 'Formula Print' },
    ],
  },
  {
    title: 'Drop 02',
    status: 'Vyprodáno',
    date: '2025',
    shots: [
      { img: '/images/drop2/blue-m.jpeg', label: 'No Limits Tee' },
      { img: '/images/drop2/white-j.jpeg', label: 'Rivals Tee' },
      { img: '/images/drop2/black-m.jpeg', label: 'Burn Out Tee' },
    ],
  },
];

export default function ArchivPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] text-[#eae3d6]">
      <div className="mx-auto max-w-[1200px] px-6 pb-[120px] pt-16 md:pt-20">

        {/* ── Header ── */}
        <div className="mb-5">
          <motion.h1
            initial={{ opacity: 0, y: '40%' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="m-0 font-anton uppercase leading-[0.86] text-[#eae3d6] select-none"
            style={{ fontSize: 'clamp(46px, 9vw, 100px)' }}
          >
            Archiv
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-[480px] text-[15px] leading-[1.6] text-[#8a8178]"
          >
            Každý drop jednou a nikdy znovu. Tady zůstává jako záznam.
          </motion.p>
        </div>

        {/* ── Drops ── */}
        {drops.map((drop) => (
          <motion.div
            key={drop.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[#eae3d6]/10 py-[50px]"
          >
            <div className="mb-[30px] flex flex-wrap items-baseline gap-5">
              <div className="font-anton uppercase leading-[0.9] text-[#eae3d6]" style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}>
                {drop.title}
              </div>
              <div className="font-mono text-[12px] tracking-[0.12em] text-[#8a8178]">
                {drop.status} — {drop.date}
              </div>
            </div>
            <ShotsCarousel shots={drop.shots} />
          </motion.div>
        ))}

        {/* ── Coming soon ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-baseline gap-5 border-t border-[#eae3d6]/10 py-[50px]"
        >
          <div className="font-anton uppercase leading-[0.9] text-[#4d463c]" style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}>
            Drop 03
          </div>
          <div className="font-mono text-[12px] tracking-[0.12em] text-[#8a8178]">
            Připravujeme
          </div>
        </motion.div>

      </div>
    </div>
  );
}
