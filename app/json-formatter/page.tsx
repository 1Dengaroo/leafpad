import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { JsonFormatter } from '@/components/json-formatter';

export const metadata: Metadata = {
  title: 'Free JSON Formatter, Beautifier & Minifier',
  description:
    'Format, beautify, minify, and sort JSON keys online with configurable indentation. Validate JSON syntax instantly. Free, ad-free, no sign-ups required.',
  keywords: [
    'json formatter',
    'json beautifier',
    'json minifier',
    'json validator',
    'online json formatter',
    'free json formatter',
    'json pretty print',
    'json sort keys'
  ],
  openGraph: {
    title: 'Free JSON Formatter, Beautifier & Minifier | Leafpad',
    description:
      'Format, beautify, minify, and sort JSON online. Configurable indentation and instant validation. Free and ad-free.',
    url: 'https://leafpad.vercel.app/json-formatter'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free JSON Formatter, Beautifier & Minifier | Leafpad',
    description:
      'Format, beautify, minify, and sort JSON online. Free and ad-free.'
  },
  alternates: {
    canonical: '/json-formatter'
  }
};

export default function JsonFormatterPage() {
  return (
    <ToolPage>
      <JsonFormatter />
    </ToolPage>
  );
}
