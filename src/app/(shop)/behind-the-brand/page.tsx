'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  {
    num: '01',
    heading: null,
    body: [
      `Myšlenka na vlastní značku se mi poprvé objevila v hlavě ve chvíli, kdy jsem žil v Americe. Nebyl to plán ani konkrétní cíl. Spíš jen pocit, který se občas vrátil a zase zmizel.`,
      `Když jsem se vrátil zpátky do Česka, ta myšlenka už nezmizela. Vracívala se každý den. Přemýšlel jsem nad ní pořád dokola, až jsem jednoho dne narazil na video, kde dva týpci sprejovali na trička. A řekl jsem si: proč to nezkusit?`,
      `V tu chvíli jsem ale vůbec neměl v hlavě, že by se z toho někdy měla stát skutečná značka. Neřešil jsem výrobu, fabriky, tisk, balení nebo e-shop. Bylo to jen o tom začít a něco si vyzkoušet.`,
    ],
  },
  {
    num: '02',
    heading: 'Od zkoušení k něčemu reálnému',
    body: [
      `Když jsem zjistil, že sprejování není ta správná cesta, začal jsem se víc zajímat o klasický tisk a reálnou výrobu oblečení. Objednal jsem první kusy. Zkusil jsem natisknout první návrhy. Testoval jsem. Učil se.`,
      `A někde mezi tím jsem si uvědomil, že už vlastně netestuji. Že už pomalu vzniká něco, co má vlastní směr.`,
      `Bez velkého rozpočtu. Bez prostoru pro zbytečné chyby. Každé rozhodnutí jsem musel promýšlet víc, než bych možná chtěl. A právě to mě naučilo přemýšlet nad každým detailem.`,
    ],
  },
  {
    num: '03',
    heading: 'Jak nad věcmi přemýšlím',
    body: [
      `Do každého kusu se snažím dát maximum. Neznamená to, že je všechno dokonalé — ale znamená to, že nic nepouštím ven jen proto, že „už by to mohlo stačit".`,
      `Často vznikne 50 návrhů a použijí se dva. Zbytek beru jako součást cesty, ne jako chybu. Bez nich by ty dva nikdy nevznikly.`,
      `Tenhle přístup se promítá do každého kusu, který jde ven — ať už jde o střih, materiál, potisk nebo detaily.`,
    ],
  },
  {
    num: '04',
    heading: 'Od návrhu po výrobu',
    body: [
      `Byl jsem u všeho. Od hledání fabrik, přes tisk, střihy a materiály, až po štítky, balení, nálepky a e-shop.`,
      `Ne proto, že bych nevěřil ostatním, ale proto, že jsem chtěl rozumět celému procesu. Jak věci vznikají. Co má vliv na kvalitu. Co dělá rozdíl mezi průměrným a dobrým kusem.`,
      `Nešlo mi jen o to, aby to dobře vypadalo. Chtěl jsem, aby se to dobře nosilo. Aby to něco vydrželo. Aby to dávalo smysl i za rok, ne jen dnes.`,
    ],
  },
  {
    num: '05',
    heading: 'Limitované dropy',
    body: [
      `Atlantic Ave funguje na principu menších, limitovaných kolekcí.`,
      `Nechci vydávat co nejvíc kusů. Chci vydávat věci, za kterými si můžu stát.`,
      `První oficiální drop se vyprodal. Neberu to jako důkaz, že „to umím". Beru to spíš jako potvrzení, že tenhle přístup má smysl.`,
    ],
  },
  {
    num: '06',
    heading: 'Tohle je teprve začátek',
    body: [
      `Atlantic Ave není hotová věc. Je to proces, který se vyvíjí s každým dalším krokem.`,
      `Učím se. Zlepšuji se. A snažím se dělat věci o trochu lépe než minule.`,
    ],
    closing: `Tohle je teprve začátek.`,
  },
] as const;

function Section({ section, index }: { section: typeof sections[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[52px_1fr] md:grid-cols-[96px_1fr] border-t border-[#1f1f1f]"
    >
      {/* Index column */}
      <div className="flex flex-col items-center pt-8 md:pt-12 border-r border-[#1f1f1f]">
        <span className="font-mono text-[10px] tracking-[0.24em] text-[#383832] select-none">
          {section.num}
        </span>
        <div className="mt-5 flex-1 w-px bg-[#1f1f1f]" />
      </div>

      {/* Content */}
      <div className="pt-8 md:pt-12 pb-16 md:pb-24 pl-6 md:pl-12 pr-6 md:pr-16">
        {section.heading && (
          <motion.h2
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-anton text-[clamp(24px,3.5vw,42px)] uppercase leading-[0.92] tracking-tight text-[#f4f1ea] mb-8 md:mb-10"
          >
            {section.heading}
          </motion.h2>
        )}

        <div className="flex flex-col gap-5 md:gap-6">
          {section.body.map((para, i) => (
            <p
              key={i}
              className="font-sans text-[15px] md:text-[16px] leading-[1.85] text-[#7a7a74] max-w-[58ch]"
            >
              {para}
            </p>
          ))}
        </div>

        {'closing' in section && section.closing && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-anton text-[clamp(28px,4.5vw,58px)] uppercase leading-[0.9] tracking-tight text-[#f4f1ea] mt-10 md:mt-14"
          >
            {section.closing}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default function BehindTheBrandPage() {
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
        <div className="px-0 pt-16 md:pt-20 pb-0 overflow-hidden">

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-7 md:px-14 mb-6 md:mb-8 flex items-center gap-4"
          >
            <div className="h-px flex-1 max-w-[40px] bg-[#1f1f1f]" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#555]">
              Atlantic Ave — O nás
            </span>
          </motion.div>

          {/* Headline */}
          <div className="px-5 md:px-10 overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: '60%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-anton uppercase leading-[0.85] tracking-tight text-[#f4f1ea] select-none"
              style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}
            >
              Behind
            </motion.h1>
          </div>
          <div className="px-5 md:px-10 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: '60%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-4 md:gap-7"
            >
              <span
                className="font-anton uppercase leading-[0.85] tracking-tight text-[#f4f1ea] select-none"
                style={{ fontSize: 'clamp(72px, 14vw, 200px)' }}
              >
                the
              </span>
              <span
                className="font-anton uppercase leading-[0.85] tracking-tight select-none"
                style={{
                  fontSize: 'clamp(72px, 14vw, 200px)',
                  WebkitTextStroke: '1.5px #f4f1ea',
                  color: 'transparent',
                }}
              >
                Brand
              </span>
            </motion.div>
          </div>

          {/* Rule + sub */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 md:mt-10 px-5 md:px-10 pb-0 border-b border-[#1f1f1f]"
          >
            <div className="flex items-end justify-between pb-5 gap-6">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#555] max-w-[40ch] leading-relaxed">
                Jak Atlantic Ave vzniklo a co za ním stojí
              </p>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#383832] flex-shrink-0">
                {sections.length} kapitol
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Sections ── */}
        <div>
          {sections.map((section, i) => (
            <Section key={section.num} section={section} index={i} />
          ))}
        </div>

        {/* ── Closing strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-[#1f1f1f] grid grid-cols-[52px_1fr] md:grid-cols-[96px_1fr]"
        >
          <div className="border-r border-[#1f1f1f]" />
          <div className="px-6 md:px-12 py-14 md:py-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">
                Kolekce
              </div>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#7a7a74] max-w-[34ch] leading-relaxed">
                Každý kus je výsledek tohoto procesu. Limitovaně.
              </p>
            </div>
            <Link
              href="/shop"
              className="flex-shrink-0 inline-flex items-center gap-4 py-4 px-7 border border-[#f4f1ea] font-mono text-[11px] tracking-[0.28em] uppercase text-[#f4f1ea] hover:bg-[#f4f1ea] hover:text-[#0a0a0a] transition-colors duration-200 group"
            >
              <span>Zobrazit kolekci</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
