'use client';

import { Suspense, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MarkdownWorkspace } from '@/components/markdown-workspace';
import { JsonFormatter } from '@/components/json-formatter';
import { JsonDiff } from '@/components/json-diff';
import { ToolSwitcher, type Tool } from '@/components/tool-switcher';
import { SettingsDialog } from '@/components/settings-dialog';
import { AboutDialog } from '@/components/about-dialog';

const VALID_TOOLS: Tool[] = ['markdown', 'json-formatter', 'json-diff'];

function isValidTool(value: string | null): value is Tool {
  return VALID_TOOLS.includes(value as Tool);
}

function EditorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramTool = searchParams.get('tool');
  const [tool, setToolState] = useState<Tool>(isValidTool(paramTool) ? paramTool : 'markdown');

  const setTool = useCallback(
    (t: Tool) => {
      setToolState(t);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tool', t);
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '/', { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-y-auto md:overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.svg" alt="Leafpad" width={22} height={22} className="select-none" />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">Leafpad</span>
          <span className="text-border hidden sm:inline">|</span>
          <ToolSwitcher tool={tool} setTool={setTool} />
        </div>
        <div className="flex gap-1">
          <SettingsDialog />
          <AboutDialog />
        </div>
      </div>

      {/* Active tool */}
      {tool === 'markdown' && <MarkdownWorkspace />}
      {tool === 'json-formatter' && <JsonFormatter />}
      {tool === 'json-diff' && <JsonDiff />}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorInner />
    </Suspense>
  );
}
