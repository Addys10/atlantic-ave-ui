'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

export type Shot = { img: string; label: string };

function Tile({ shot }: { shot: Shot }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#141210]">
      <Image
        src={shot.img}
        alt={`Atlantic Ave — ${shot.label}`}
        fill
        sizes="(max-width: 768px) 85vw, 300px"
        className="object-cover"
      />
      <span className="absolute bottom-3 left-3 bg-[#0b0a09]/60 px-[7px] py-[3px] font-mono text-[10px] uppercase tracking-[0.12em] text-[#eae3d6]">
        {shot.label}
      </span>
    </div>
  );
}

export default function ShotsCarousel({ shots }: { shots: Shot[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const dist = Math.abs(cCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  return (
    <>
      {/* Mobile: swipe carousel */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {shots.map((shot) => (
            <div key={shot.label} className="w-[85%] flex-none snap-center">
              <Tile shot={shot} />
            </div>
          ))}
        </div>

        {shots.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {shots.map((shot, i) => (
              <span
                key={shot.label}
                className={`h-1 w-1 rounded-full transition-colors duration-300 ${
                  i === active ? 'bg-[#eae3d6]' : 'bg-[#eae3d6]/25'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {shots.map((shot) => (
          <Tile key={shot.label} shot={shot} />
        ))}
      </div>
    </>
  );
}
