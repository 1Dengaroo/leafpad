'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { InfoIcon } from 'lucide-react';

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/60"
        >
          <InfoIcon className="size-[15px]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About Leafpad</DialogTitle>
          <DialogDescription>Clean developer tools in one place.</DialogDescription>
        </DialogHeader>
        <div className="text-secondary-foreground space-y-3 text-sm">
          <p>
            I wanted developer tools with a clean interface that stay out of the way. Leafpad
            combines a markdown editor, JSON formatter, and JSON diff — no ads, no distractions, and
            a clean modern UX.
          </p>
          <p className="text-muted-foreground pt-1 text-xs">
            Built by{' '}
            <a
              href="https://andydeng.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Andy Deng
            </a>
          </p>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
