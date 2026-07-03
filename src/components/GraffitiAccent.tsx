import { SVGProps } from 'react';

/**
 * Ambient street-flavour SVG marks used at very low opacity as background
 * accents. Each variant is hand-crafted (not tileable, not a pattern) so
 * placements read like real spray/marker interventions rather than a
 * decorative CSS pattern.
 *
 * Placed with absolute positioning + pointer-events-none + z-0 by the
 * parent. Colour is `currentColor` so opacity/hue come from Tailwind
 * text classes on the wrapper.
 */

type Variant = 'spray' | 'scribble' | 'tag-star' | 'cross-out' | 'squiggle' | 'drip';

interface Props extends SVGProps<SVGSVGElement> {
  variant: Variant;
}

export function GraffitiAccent({ variant, ...props }: Props) {
  switch (variant) {
    case 'spray':
      return <SpraySplatter {...props} />;
    case 'scribble':
      return <MarkerScribble {...props} />;
    case 'tag-star':
      return <TagStar {...props} />;
    case 'cross-out':
      return <CrossOut {...props} />;
    case 'squiggle':
      return <Squiggle {...props} />;
    case 'drip':
      return <PaintDrip {...props} />;
  }
}

function SpraySplatter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 160" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="24" r="2.4" />
      <circle cx="34" cy="12" r="1.2" />
      <circle cx="48" cy="30" r="0.9" />
      <circle cx="65" cy="8" r="1.6" />
      <circle cx="78" cy="20" r="0.7" />
      <circle cx="96" cy="14" r="1.1" />
      <circle cx="118" cy="26" r="2.1" />
      <circle cx="142" cy="10" r="0.8" />
      <circle cx="160" cy="22" r="1.4" />
      <circle cx="182" cy="16" r="1.9" />
      <circle cx="205" cy="30" r="0.9" />
      <circle cx="220" cy="14" r="1.3" />
      <circle cx="20" cy="60" r="1.7" />
      <circle cx="42" cy="72" r="0.8" />
      <circle cx="58" cy="54" r="1.1" />
      <circle cx="82" cy="66" r="2.2" />
      <circle cx="104" cy="58" r="0.6" />
      <circle cx="128" cy="70" r="1.4" />
      <circle cx="150" cy="52" r="1.8" />
      <circle cx="176" cy="68" r="0.9" />
      <circle cx="198" cy="60" r="1.2" />
      <circle cx="222" cy="72" r="1.5" />
      <circle cx="14" cy="100" r="1.3" />
      <circle cx="36" cy="112" r="1.8" />
      <circle cx="60" cy="98" r="0.7" />
      <circle cx="84" cy="110" r="1.5" />
      <circle cx="108" cy="102" r="2.4" />
      <circle cx="132" cy="118" r="0.9" />
      <circle cx="158" cy="104" r="1.1" />
      <circle cx="184" cy="116" r="1.6" />
      <circle cx="210" cy="106" r="0.8" />
      <circle cx="28" cy="140" r="1.1" />
      <circle cx="70" cy="132" r="0.8" />
      <circle cx="112" cy="144" r="1.5" />
      <circle cx="154" cy="134" r="0.9" />
      <circle cx="196" cy="148" r="1.3" />
    </svg>
  );
}

function MarkerScribble(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M8 32 Q 40 12, 72 30 T 138 28 T 210 34 T 288 24" />
      <path d="M14 44 Q 50 30, 88 42 T 168 40 T 250 46" opacity="0.55" />
    </svg>
  );
}

function TagStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M40 6 L46 30 L72 32 L52 46 L60 70 L40 56 L20 70 L28 46 L8 32 L34 30 Z" />
      <path d="M40 20 L42 34 L54 34 L44 42 L48 54 L40 46 L32 54 L36 42 L26 34 L38 34 Z" opacity="0.6" />
    </svg>
  );
}

function CrossOut(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M10 12 Q 40 45, 88 92" />
      <path d="M92 8 Q 55 45, 12 90" />
    </svg>
  );
}

function Squiggle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 15 Q 20 4, 36 15 T 68 15 T 100 15 T 132 15 T 164 15 T 196 15" />
    </svg>
  );
}

function PaintDrip(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 200" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 8 Q 6 60, 12 92 Q 8 130, 14 174 Q 12 190, 16 198 L 22 198 Q 26 188, 22 172 Q 28 128, 24 92 Q 30 58, 20 8 Z" />
      <path d="M40 12 Q 38 80, 44 120 Q 40 160, 48 196 L 54 196 Q 58 158, 52 118 Q 60 78, 50 10 Z" opacity="0.75" />
      <path d="M78 6 Q 76 40, 82 68 Q 78 108, 86 138 L 92 138 Q 96 106, 90 66 Q 98 38, 86 4 Z" opacity="0.5" />
      <circle cx="20" cy="200" r="6" opacity="0.85" />
      <circle cx="52" cy="200" r="5" opacity="0.65" />
      <circle cx="90" cy="142" r="4" opacity="0.55" />
    </svg>
  );
}
