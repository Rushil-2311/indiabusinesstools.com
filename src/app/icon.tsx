import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #1A56DB 0%, #0A2466 100%)',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Saffron top stripe */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: '#FF8000', opacity: 0.85,
          borderRadius: '14px 14px 0 0',
          display: 'flex',
        }} />

        {/* Bar 1 — short */}
        <div style={{
          position: 'absolute', left: 10, bottom: 8,
          width: 11, height: 16,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 3,
          display: 'flex',
        }} />

        {/* Bar 2 — medium */}
        <div style={{
          position: 'absolute', left: 26, bottom: 8,
          width: 11, height: 28,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 3,
          display: 'flex',
        }} />

        {/* Bar 3 — tall */}
        <div style={{
          position: 'absolute', left: 42, bottom: 8,
          width: 11, height: 38,
          background: 'rgba(255,255,255,0.93)',
          borderRadius: 3,
          display: 'flex',
        }} />

        {/* Green peak dot */}
        <div style={{
          position: 'absolute', left: 42, top: 14,
          width: 11, height: 11,
          background: '#138808',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 5, height: 5,
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
          }} />
        </div>
      </div>
    ),
    { width: 64, height: 64 }
  );
}
