import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') ?? '512', 10);
  const clampedSize = [512, 1024].includes(size) ? size : 512;

  const scale = clampedSize / 200;
  const barsW = Math.round(38 * scale);
  const barsH1 = Math.round(50 * scale);
  const barsH2 = Math.round(80 * scale);
  const barsH3 = Math.round(110 * scale);
  const barLeft1 = Math.round(32 * scale);
  const barLeft2 = Math.round(81 * scale);
  const barLeft3 = Math.round(130 * scale);
  const barRadius = Math.round(9 * scale);
  const dotSize = Math.round(28 * scale);
  const dotInner = Math.round(14 * scale);
  const stripeH = Math.round(10 * scale);
  const barsBottom = Math.round(32 * scale);
  const bgRadius = Math.round(44 * scale);
  const dotTop = Math.round(58 * scale);

  return new ImageResponse(
    (
      <div
        style={{
          width: clampedSize,
          height: clampedSize,
          borderRadius: bgRadius,
          background: 'linear-gradient(135deg, #1A56DB 0%, #0A2466 100%)',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Saffron top stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: stripeH,
          background: '#FF8000', opacity: 0.85,
          borderRadius: `${bgRadius}px ${bgRadius}px 0 0`,
          display: 'flex',
        }} />

        {/* Bar 1 — short */}
        <div style={{
          position: 'absolute', left: barLeft1, bottom: barsBottom,
          width: barsW, height: barsH1,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: barRadius,
          display: 'flex',
        }} />

        {/* Bar 2 — medium */}
        <div style={{
          position: 'absolute', left: barLeft2, bottom: barsBottom,
          width: barsW, height: barsH2,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: barRadius,
          display: 'flex',
        }} />

        {/* Bar 3 — tall */}
        <div style={{
          position: 'absolute', left: barLeft3, bottom: barsBottom,
          width: barsW, height: barsH3,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: barRadius,
          display: 'flex',
        }} />

        {/* Green peak dot */}
        <div style={{
          position: 'absolute', left: barLeft3, top: dotTop,
          width: dotSize, height: dotSize,
          background: '#138808',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: dotInner, height: dotInner,
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
          }} />
        </div>
      </div>
    ),
    { width: clampedSize, height: clampedSize }
  );
}
