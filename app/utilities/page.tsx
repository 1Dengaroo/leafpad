import type { Metadata } from 'next';
import { ToolPage } from '@/components/tool-page';
import { Utilities } from '@/components/utilities';

export const metadata: Metadata = {
  title: 'Free Developer Utilities - UUID, NanoID, Base64 & Hash Generator',
  description:
    'Generate UUIDs (v4), NanoIDs, encode/decode Base64, URL encode/decode, and hash text with SHA-256 or SHA-512. Free, ad-free developer utilities. No sign-ups.',
  keywords: [
    'uuid generator',
    'nanoid generator',
    'base64 encoder',
    'base64 decoder',
    'url encoder',
    'sha256 hash',
    'sha512 hash',
    'hash generator',
    'free developer utilities',
    'online uuid generator'
  ],
  openGraph: {
    title: 'Free Developer Utilities - UUID, NanoID, Base64 & Hash | Leafpad',
    description:
      'Generate UUIDs, NanoIDs, encode/decode Base64, and hash with SHA-256/512. Free and ad-free.',
    url: 'https://leafpad.vercel.app/utilities'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Utilities - UUID, NanoID, Base64 & Hash | Leafpad',
    description:
      'Generate UUIDs, NanoIDs, encode/decode Base64, and hash with SHA-256/512. Free and ad-free.'
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
