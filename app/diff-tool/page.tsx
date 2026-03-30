import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { JsonDiff } from '@/components/json-diff';

export const metadata: Metadata = {
  title: 'Free Diff Tool - Compare JSON & Text Online',
  description:
    'Compare JSON or text side-by-side with word-level inline diff highlighting. Spot differences instantly with color-coded additions and deletions. Free, ad-free, no sign-ups.',
  keywords: [
    'diff tool',
    'json diff',
    'text diff',
    'online diff tool',
    'compare json',
    'compare text',
    'free diff tool',
    'side by side diff',
    'inline diff'
  ],
  openGraph: {
    title: 'Free Diff Tool - Compare JSON & Text | Leafpad',
    description:
      'Compare JSON or text side-by-side with word-level change detection and color-coded highlighting. Free and ad-free.',
    url: 'https://leafpad.vercel.app/diff-tool'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Diff Tool - Compare JSON & Text | Leafpad',
    description:
      'Compare JSON or text side-by-side with word-level change detection. Free and ad-free.'
  },
  alternates: {
    canonical: '/diff-tool'
  }
};

export default function DiffToolPage() {
  return (
    <ToolPage>
      <JsonDiff />
    </ToolPage>
  );
}
