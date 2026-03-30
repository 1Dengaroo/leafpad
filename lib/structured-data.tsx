export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Leafpad',
  url: 'https://leafpad.vercel.app',
  description:
    'Free developer tools: JSON formatter, markdown editor, diff tool, notepad, and utilities. No ads, no sign-ups.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'Markdown editor with live preview',
    'JSON formatter, beautifier & minifier',
    'Text and JSON diff comparison',
    'Quick notepad with local storage',
    'UUID and NanoID generator',
    'Base64 encoder/decoder',
    'SHA-256 and SHA-512 hashing'
  ]
};
