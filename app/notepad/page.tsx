import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { Notepad } from '@/components/notepad';

export const metadata: Metadata = {
  title: 'Free Notepad for Developers - Quick Notes & Snippets',
  description:
    'Jot down quick notes, code snippets, and reminders. Saved locally in your browser with no account needed. Free, ad-free notepad for developers. No sign-ups, no tracking.',
  keywords: [
    'notepad',
    'online notepad',
    'developer notepad',
    'quick notes',
    'sticky notes',
    'code snippets',
    'free notepad',
    'browser notepad',
    'local storage notes'
  ],
  openGraph: {
    title: 'Free Notepad for Developers | Leafpad',
    description:
      'Quick sticky notes saved locally in your browser. Jot down notes, snippets, and reminders. Free and ad-free.',
    url: 'https://leafpad.vercel.app/notepad'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Notepad for Developers | Leafpad',
    description: 'Quick sticky notes saved locally in your browser. Free and ad-free.'
  },
  alternates: {
    canonical: '/notepad'
  }
};

export default function NotepadPage() {
  return (
    <ToolPage>
      <Notepad />
    </ToolPage>
  );
}
