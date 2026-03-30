import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found. Return to Leafpad developer tools.',
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-4">
      <Image src="/logo.svg" alt="Leafpad" width={64} height={64} className="mb-6 select-none" />
      <h1 className="mb-1 text-6xl font-bold tracking-tighter sm:text-8xl">404</h1>
      <p className="text-muted-foreground mb-1 text-base sm:text-lg">
        This page got minified into nothing.
      </p>
      <p className="text-muted-foreground mb-8 text-sm">Check the URL or head back to the tools.</p>
      <Button asChild>
        <Link href="/" className="gap-2">
          <HomeIcon className="size-4" />
          Back to Leafpad
        </Link>
      </Button>
    </div>
  );
}
