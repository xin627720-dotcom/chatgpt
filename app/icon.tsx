import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2563eb',
          color: '#2563eb',
          fontSize: 220,
          fontWeight: 700
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 90,
            width: 360,
            height: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          词
        </div>
      </div>
    ),
    size
  );
}
