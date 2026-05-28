import Image from 'next/image';

export const metadata = {
  title: 'Size Guide | Atlantic Ave',
  description: 'Tabulka velikostí Atlantic Ave',
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-line px-8 py-6 flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.4em] uppercase text-dim">Size Guide</span>
        <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">Trička</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-20 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <h1 className="font-anton text-[clamp(36px,6vw,72px)] uppercase leading-[0.9] tracking-tight text-bone">
            Size Guide
          </h1>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-dim leading-relaxed">
            Všechny míry jsou v centimetrech
          </p>
        </div>

        <div className="border border-line overflow-hidden">
          <Image
            src="/images/size-guide.png"
            alt="Size guide — tabulka velikostí Atlantic Ave triček"
            width={1200}
            height={900}
            className="w-full h-auto"
            priority
          />
        </div>

        <div className="border-t border-line pt-8 flex flex-col gap-3">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-dim">Jak měřit</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute w-24 shrink-0 pt-0.5">Šířka</span>
              <p className="font-mono text-[12px] tracking-[0.06em] leading-relaxed text-dim">
                Měř vodorovně pod podpažím, z jedné strany na druhou.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute w-24 shrink-0 pt-0.5">Délka</span>
              <p className="font-mono text-[12px] tracking-[0.06em] leading-relaxed text-dim">
                Měř od nejvyššího bodu ramene dolů k dolnímu okraji.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
