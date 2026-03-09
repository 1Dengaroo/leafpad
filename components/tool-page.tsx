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
      <div className="flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
            <Image src="/logo.svg" alt="Leafpad" width={22} height={22} className="select-none" />
            <span className="hidden text-lg font-bold tracking-tight sm:inline">Leafpad</span>
          </Link>
          <span className="text-border hidden sm:inline">|</span>
          <ToolSwitcher />
        </div>
        <div className="flex gap-1">
          <SettingsDialog />
          <AboutDialog />
        </div>
      </div>

      {/* Active tool */}
      {children}
    </div>
  );
}
