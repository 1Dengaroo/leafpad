import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Developer Utilities - UUID, NanoID, Base64 & Hash - Leafpad';
export const size = ogSize;
export const contentType = ogContentType;

export default function OGImage() {
  return generateOgImage('Developer Utilities', 'UUID, NanoID, Base64, URL encoding, and SHA-256/512 hashing');
}
