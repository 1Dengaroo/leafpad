import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { Utilities } from '@/components/utilities';

export const metadata: Metadata = {
  title: 'Developer Utilities - UUID, NanoID, Base64 & Hash | Leafpad',
  description:
    'Generate UUIDs, NanoIDs, encode/decode Base64, and hash text with SHA-256/SHA-512. Free, ad-free developer utilities. No sign-ups.',
  openGraph: {
    title: 'Developer Utilities - UUID, NanoID, Base64 & Hash | Leafpad',
    description: 'Generate IDs, encode/decode Base64, and hash text. Free and ad-free.',
    url: 'https://leafpad.vercel.app/utilities'
  },
  twitter: {
    card: 'summary',
    title: 'Developer Utilities - UUID, NanoID, Base64 & Hash | Leafpad',
    description: 'Generate IDs, encode/decode Base64, and hash text. Free and ad-free.'
  },
  alternates: {
    canonical: '/utilities'
  }
};

export default function UtilitiesPage() {
  return (
    <ToolPage>
      <Utilities />
    </ToolPage>
  );
}
