import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Diff Tool - Compare JSON & Text - Leafpad';
export const size = ogSize;
export const contentType = ogContentType;

export default function OGImage() {
  return generateOgImage(
    'Diff Tool',
    'Compare JSON or text side-by-side with word-level change detection'
  );
}
