import type { Metadata } from 'next';
import { Sora, Space_Grotesk, Literata, Plus_Jakarta_Sans, Newsreader } from 'next/font/google';
import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { FontProvider } from '@/lib/theme/font-provider';
import { EditorThemeProvider } from '@/lib/theme/editor-theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

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
    default: 'Leafpad | Markdown Editor & Developer Tools',
    template: '%s | Leafpad'
  },
  description:
    'Free, ad-free developer tools. Markdown editor with live preview, JSON formatter, diff tool, and utilities. No sign-ups, no tracking.',
  keywords: [
    'markdown editor',
    'json formatter',
    'json diff',
    'text diff',
    'json beautifier',
    'json minifier',
    'developer tools',
    'devtools',
    'uuid generator',
    'nanoid',
    'base64 encoder',
    'hash generator',
    'sha256',
    'free markdown editor',
    'online json formatter'
  ],
  icons: { icon: '/logo.svg' },
  metadataBase: new URL('https://leafpad.vercel.app'),
  openGraph: {
    title: 'Leafpad | Markdown Editor & Developer Tools',
    description:
      'Free developer tools: markdown editor, JSON formatter, diff tool, and utilities. No ads, no sign-ups.',
    url: 'https://leafpad.vercel.app',
    type: 'website',
    siteName: 'Leafpad'
  },
  twitter: {
    card: 'summary',
    title: 'Leafpad | Markdown Editor & Developer Tools',
    description:
      'Free developer tools: markdown editor, JSON formatter, diff tool, and utilities. No ads, no sign-ups.'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
