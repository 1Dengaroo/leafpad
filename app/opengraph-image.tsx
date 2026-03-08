import { ImageResponse } from 'next/og';

export const alt = 'Leafpad - Markdown Editor, JSON Formatter & JSON Diff';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4BAE4F 0%, #388E3C 100%)',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-2px',
          marginBottom: 24
        }}
      >
        Leafpad
      </div>
      <div
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 400
        }}
      >
        Markdown Editor · JSON Formatter · JSON Diff
      </div>
    </div>,
    { ...size }
  );
}
