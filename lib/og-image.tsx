import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

export function generateOgImage(title: string, description: string) {
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
        fontFamily: 'system-ui, sans-serif',
        padding: '60px'
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: 16,
          letterSpacing: '2px',
          textTransform: 'uppercase' as const
        }}
      >
        Leafpad
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: 'white',
          letterSpacing: '-2px',
          marginBottom: 20,
          textAlign: 'center' as const,
          lineHeight: 1.1
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 28,
          color: 'rgba(255, 255, 255, 0.85)',
          fontWeight: 400,
          textAlign: 'center' as const,
          maxWidth: '800px'
        }}
      >
        {description}
      </div>
    </div>,
    { ...ogSize }
  );
}
