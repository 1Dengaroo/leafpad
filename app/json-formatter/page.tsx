import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { JsonFormatter } from '@/components/json-formatter';

export const metadata: Metadata = {
  title: 'JSON Formatter & Minifier | Leafpad',
  description:
    'Format, minify, and sort JSON online. Free, ad-free JSON beautifier with configurable indentation. No sign-ups.',
  openGraph: {
    title: 'JSON Formatter & Minifier | Leafpad',
    description: 'Format, minify, and sort JSON online. Free and ad-free.',
    url: 'https://leafpad.vercel.app/json-formatter'
  },
  twitter: {
    card: 'summary',
    title: 'JSON Formatter & Minifier | Leafpad',
    description: 'Format, minify, and sort JSON online. Free and ad-free.'
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
