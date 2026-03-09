import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { JsonDiff } from '@/components/json-diff';

export const metadata: Metadata = {
  title: 'Diff Tool - Compare JSON & Text | Leafpad',
  description:
    'Compare JSON or text side-by-side with inline highlighting. Free, ad-free diff tool with word-level change detection. No sign-ups.',
  openGraph: {
    title: 'Diff Tool - Compare JSON & Text | Leafpad',
    description: 'Compare JSON or text side-by-side with inline highlighting. Free and ad-free.',
    url: 'https://leafpad.vercel.app/diff-tool'
  },
  twitter: {
    card: 'summary',
    title: 'Diff Tool - Compare JSON & Text | Leafpad',
    description: 'Compare JSON or text side-by-side with inline highlighting. Free and ad-free.'
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
