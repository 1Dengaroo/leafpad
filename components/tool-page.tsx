'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ToolSwitcher } from '@/components/tool-switcher';
import { SettingsDialog } from '@/components/settings-dialog';
import { AboutDialog } from '@/components/about-dialog';

export function ToolPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-y-auto md:overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="hover:bg-accent/60 flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors sm:gap-2.5"
          >
            <Image src="/logo.svg" alt="Leafpad" width={20} height={20} className="select-none" />
            <span className="text-sm font-semibold tracking-tight sm:text-[15px]">Leafpad</span>
          </Link>
          <span className="text-border text-xs">/</span>
          <ToolSwitcher />
        </div>
        <div className="flex items-center gap-0.5">
          <SettingsDialog />
          <AboutDialog />
        </div>
      </header>

      {/* Active tool */}
      {children}
    </div>
  );
}
