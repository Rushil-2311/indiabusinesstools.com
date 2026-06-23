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
          background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 900,
          color: 'white',
          fontFamily: 'serif',
        }}
      >
        ₹
      </div>
    ),
    { width: 64, height: 64 }
  );
}
