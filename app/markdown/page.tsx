import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { MarkdownWorkspace } from '@/components/markdown-workspace';

export const metadata: Metadata = {
  title: 'Markdown Editor with Live Preview',
  description:
    'Write markdown with a live preview, formatting toolbar, and syntax-highlighted code blocks. Export to .md or .html. Free and ad-free.',
  openGraph: {
    title: 'Markdown Editor with Live Preview | Leafpad',
    description: 'Write markdown with live preview and formatting toolbar. Free and ad-free.',
    url: 'https://leafpad.vercel.app/markdown'
  },
  twitter: {
    card: 'summary',
    title: 'Markdown Editor with Live Preview | Leafpad',
    description: 'Write markdown with live preview and formatting toolbar. Free and ad-free.'
  },
  alternates: {
    canonical: '/markdown'
  }
};

export default function MarkdownPage() {
  return (
    <ToolPage>
      <MarkdownWorkspace />
    </ToolPage>
  );
}
