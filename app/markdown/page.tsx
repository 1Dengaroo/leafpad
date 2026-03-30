import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { MarkdownWorkspace } from '@/components/markdown-workspace';

export const metadata: Metadata = {
  title: 'Free Markdown Editor with Live Preview',
  description:
    'Write and preview markdown in real time with GFM support, a formatting toolbar, and syntax-highlighted code blocks. Export to .md or .html. Free, ad-free, no sign-ups.',
  keywords: [
    'markdown editor',
    'free markdown editor',
    'online markdown editor',
    'markdown preview',
    'markdown to html',
    'gfm editor',
    'github flavored markdown'
  ],
  openGraph: {
    title: 'Free Markdown Editor with Live Preview | Leafpad',
    description:
      'Write and preview markdown in real time. GFM support, formatting toolbar, syntax highlighting, and export. Free and ad-free.',
    url: 'https://leafpad.vercel.app/markdown'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Markdown Editor with Live Preview | Leafpad',
    description:
      'Write and preview markdown in real time. GFM support, formatting toolbar, and export. Free and ad-free.'
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
