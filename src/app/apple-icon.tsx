import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #1A56DB 0%, #0A2466 100%)',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Saffron top stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 10,
          background: '#FF8000', opacity: 0.85,
          borderRadius: '40px 40px 0 0',
          display: 'flex',
        }} />

        {/* Bar 1 — short */}
        <div style={{
          position: 'absolute', left: 28, bottom: 22,
          width: 30, height: 44,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 8,
          display: 'flex',
        }} />

        {/* Bar 2 — medium */}
        <div style={{
          position: 'absolute', left: 74, bottom: 22,
          width: 30, height: 76,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 8,
          display: 'flex',
        }} />

        {/* Bar 3 — tall */}
        <div style={{
          position: 'absolute', left: 120, bottom: 22,
          width: 30, height: 108,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 8,
          display: 'flex',
        }} />

        {/* Green peak dot */}
        <div style={{
          position: 'absolute', left: 120, top: 38,
          width: 30, height: 30,
          background: '#138808',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 14, height: 14,
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
          }} />
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
