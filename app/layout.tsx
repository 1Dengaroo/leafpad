import type { Metadata } from 'next';
import { Sora, Space_Grotesk, Literata, Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { FontProvider } from '@/lib/theme/font-provider';
import { EditorThemeProvider } from '@/lib/theme/editor-theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { JsonLd, websiteSchema } from '@/lib/structured-data';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-newsreader' });

const fontVariables = [
  sora.variable,
  spaceGrotesk.variable,
  literata.variable,
  plusJakarta.variable,
  newsreader.variable
].join(' ');

export const metadata: Metadata = {
  title: {
    default: 'Leafpad | Free Developer Tools',
    template: '%s | Leafpad'
  },
  description:
    'Free, ad-free developer tools. JSON formatter, markdown editor, diff tool, notepad, and utilities like UUID generator, Base64 encoder, and SHA-256 hashing. No sign-ups, no tracking.',
  keywords: [
    'developer tools',
    'devtools',
    'json formatter',
    'json beautifier',
    'json minifier',
    'online json formatter',
    'markdown editor',
    'free markdown editor',
    'json diff',
    'text diff',
    'diff tool',
    'uuid generator',
    'nanoid generator',
    'base64 encoder',
    'base64 decoder',
    'hash generator',
    'sha256',
    'sha512',
    'notepad',
    'sticky notes',
    'quick notes',
    'developer notepad',
    'free developer tools',
    'online developer tools'
  ],
  icons: { icon: '/logo.svg' },
  metadataBase: new URL('https://leafpad.vercel.app'),
  openGraph: {
    title: 'Leafpad | Free Developer Tools',
    description:
      'Free developer tools: JSON formatter, markdown editor, diff tool, notepad, and utilities. No ads, no sign-ups.',
    url: 'https://leafpad.vercel.app',
    type: 'website',
    siteName: 'Leafpad'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leafpad | Free Developer Tools',
    description:
      'Free developer tools: JSON formatter, markdown editor, diff tool, notepad, and utilities. No ads, no sign-ups.'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={websiteSchema} />
      </head>
      <body className={`${fontVariables} antialiased`} style={{ fontFamily: 'var(--font-sora)' }}>
        <ThemeProvider>
          <FontProvider>
            <EditorThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster
                  toastOptions={{
                    classNames: {
                      success: '[&>[data-icon]]:text-green-500'
                    }
                  }}
                />
              </TooltipProvider>
              <Analytics />
            </EditorThemeProvider>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
