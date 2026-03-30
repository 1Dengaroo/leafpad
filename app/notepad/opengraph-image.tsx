import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Notepad - Quick Notes for Developers - Leafpad';
export const size = ogSize;
export const contentType = ogContentType;

export default function OGImage() {
  return generateOgImage('Notepad', 'Quick sticky notes saved locally in your browser');
}
