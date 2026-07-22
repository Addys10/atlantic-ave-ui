'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type Chapter = {
  num: string;
  title: string | null;
  body: string[];
};

const chapters: Chapter[] = [
  {
    num: '01',
    title: null,
    body: [
      `Myšlenka na vlastní značku se zrodila, když jsem žil v Americe. Nebyl to žádný jasný plán ani konkrétní cíl. Spíš jen pocit, který se občas objevil a zase odezněl.`,
      `Po návratu do Česka se mě ale tenhle nápad pustit nechtěl. Vracel se mi každý den. Přemýšlel jsem nad tím pořád dokola, až jsem jednoho dne narazil na video, kde dva týpci sprejovali na trička. A řekl jsem si: proč to nezkusit?`,
      `V tu chvíli jsem vůbec neplánoval, že by se z toho někdy měla stát skutečná značka. Neřešil jsem výrobu, fabriky, tisk, balení nebo e-shop. Bylo to jen o tom udělat první krok a něco si vyzkoušet.`,
    ],
  },
  {
    num: '02',
    title: 'Od zkoušení k něčemu reálnému',
    body: [
      `Když jsem zjistil, že sprejování není ta správná cesta, začal jsem se víc zajímat o klasický tisk a reálnou výrobu oblečení. Objednal jsem první kusy. Zkusil natisknout první návrhy. Testoval jsem. Učil se.`,
      `A někde mezi tím mi došlo, že už vlastně netestuji. Že už pomalu vzniká něco, co má svůj vlastní směr.`,
      `Všechno to vznikalo bez velkého rozpočtu. Bez prostoru pro zbytečné chyby. Každé rozhodnutí jsem musel zvažovat mnohem víc, než bych možná chtěl. A právě to mě naučilo dát si záležet na každém detailu.`,
    ],
  },
  {
    num: '03',
    title: 'Jak nad věcmi přemýšlím',
    body: [
      `Do každého kousku se snažím dát maximum. Neznamená to, že je vždycky všechno dokonalé — ale znamená to, že nic nevypustím do světa jen proto, že „už by to mohlo stačit".`,
      `Často vznikne padesát návrhů a použijí se z nich jen dva. Ten zbytek beru jako nezbytnou součást cesty, ne jako chybu. Bez nich by totiž ty dva finální nikdy nevznikly.`,
      `Tenhle přístup se promítá do všeho, co tvořím — ať už jde o samotný střih, materiál, potisk nebo ty nejmenší detaily.`,
    ],
  },
  {
    num: '04',
    title: 'Od návrhu po výrobu',
    body: [
      `Byl jsem u všeho. Od hledání fabrik přes tisk, střihy a materiály až po štítky, balení, nálepky a samotný e-shop.`,
      `Ne proto, že bych nevěřil ostatním, ale proto, že jsem chtěl rozumět celému procesu. Zjistit, jak věci vznikají. Co má reálný vliv na kvalitu. Co dělá ten rozdíl mezi průměrným a skvělým kouskem.`,
      `Nešlo mi jen o to, aby to dobře vypadalo. Chtěl jsem, aby se to dobře nosilo. Aby to něco vydrželo. Aby to dávalo smysl i za rok, nejen dnes.`,
    ],
  },
  {
    num: '05',
    title: 'Limitované dropy',
    body: [
      `Atlantic Ave funguje na principu menších, limitovaných kolekcí.`,
      `Nejde mi o to chrlit co nejvíc kusů oblečení. Chci tvořit věci, za kterými si můžu stoprocentně stát.`,
      `První oficiální drop se vyprodal. Neberu to jako důkaz, že už „všechno umím". Beru to spíš jako obrovské potvrzení toho, že tenhle přístup má smysl.`,
    ],
  },
  {
    num: '06',
    title: 'Tohle je teprve začátek',
    body: [
      `Atlantic Ave není hotová věc. Je to proces, který se vyvíjí s každým dalším krokem.`,
      `Učím se. Zlepšuji se. A snažím se dělat věci vždycky o trochu lépe než minule. Tohle je teprve začátek.`,
    ],
  },
];

export default function BehindTheBrandPage() {
  return (
    <div className="min-h-screen bg-[#0b0a09] text-[#eae3d6]">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[900px] px-6 pb-10 pt-24 md:pt-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7 font-mono text-[12px] uppercase tracking-[0.26em] text-[#8a8178]"
        >
          O nás
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: '40%' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="m-0 font-anton uppercase leading-[0.88] text-[#eae3d6] select-none"
          style={{ fontSize: 'clamp(60px, 13vw, 170px)' }}
        >
          Behind<br />The Brand
        </motion.h1>
      </section>

      {/* ── Chapters ── */}
      <section className="mx-auto max-w-[720px] px-6 py-10">
        {chapters.map((c) => (
          <motion.div
            key={c.num}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[#eae3d6]/10 py-14"
          >
            <div className="mb-6 font-mono text-[12px] tracking-[0.2em] text-[#8a8178]">
              {c.num}
            </div>
            {c.title && (
              <h2 className="mb-6 font-anton uppercase leading-none tracking-tight text-[#eae3d6]" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
                {c.title}
              </h2>
            )}
            <div className="flex flex-col gap-5">
              {c.body.map((para, i) => (
                <p key={i} className="font-grotesk text-[17px] leading-[1.7] text-[#c3bab0]">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── Outro ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-[#eae3d6]/10 px-6 pb-[120px] pt-[90px] text-center"
      >
        <div className="mb-[22px] font-mono text-[12px] uppercase tracking-[0.24em] text-[#8a8178]">
          Kolekce
        </div>
        <div
          className="mx-auto mb-8 max-w-[620px] font-anton uppercase leading-[0.96] text-[#eae3d6]"
          style={{ fontSize: 'clamp(32px, 6vw, 60px)' }}
        >
          Každý kus je výsledek tohoto procesu.
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 border-b border-[#eae3d6] pb-1.5 font-mono text-[13px] uppercase tracking-[0.16em] text-[#eae3d6]"
        >
          <span>Zobrazit kolekci</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </motion.section>

    </div>
  );
}
