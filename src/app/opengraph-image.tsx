import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Atlantic Ave';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const antonFont = await fetch(
    'https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.woff2'
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'Anton',
          position: 'relative',
        }}
      >
        {/* Top label */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            color: '#555',
            fontSize: '14px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          atlanticave.cz
        </div>

        {/* Border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '4px',
            height: '100%',
            background: '#1f1f1f',
          }}
        />

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            lineHeight: '0.88',
          }}
        >
          <span
            style={{
              color: '#f4f1ea',
              fontSize: '148px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Atlantic
          </span>
          <span
            style={{
              color: 'transparent',
              fontSize: '148px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              WebkitTextStroke: '2px #f4f1ea',
            }}
          >
            Ave
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: '32px',
            color: '#8a8a85',
            fontSize: '16px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          Limitovaný streetwear. Každý kus je edice.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Anton',
          data: antonFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
