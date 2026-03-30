import { generateOgImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'JSON Formatter & Minifier - Leafpad';
export const size = ogSize;
export const contentType = ogContentType;

export default function OGImage() {
  return generateOgImage('JSON Formatter', 'Pretty-print, minify, and sort keys with configurable indentation');
}
