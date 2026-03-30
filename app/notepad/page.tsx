import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { Notepad } from '@/components/notepad';

export const metadata: Metadata = {
  title: 'Notepad - Quick Notes for Developers | Leafpad',
  description:
    'Jot down quick notes, snippets, and reminders. Saved locally in your browser. Free, ad-free notepad for developers. No sign-ups.',
  openGraph: {
    title: 'Notepad - Quick Notes for Developers | Leafpad',
    description: 'Quick sticky notes for developers. Saved locally, free and ad-free.',
    url: 'https://leafpad.vercel.app/notepad'
  },
  twitter: {
    card: 'summary',
    title: 'Notepad - Quick Notes for Developers | Leafpad',
    description: 'Quick sticky notes for developers. Saved locally, free and ad-free.'
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
