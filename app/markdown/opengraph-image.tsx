import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Markdown Editor with Live Preview - Leafpad';
export const size = ogSize;
export const contentType = ogContentType;

export default function OGImage() {
  return generateOgImage(
    'Markdown Editor',
    'Live preview, formatting toolbar, and export to .md or .html'
  );
}
