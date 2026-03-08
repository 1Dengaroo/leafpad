'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  CheckIcon,
  ChevronDownIcon,
  PencilLineIcon,
  BracesIcon,
  GitCompareArrowsIcon
} from 'lucide-react';

export type Tool = 'markdown' | 'json-formatter' | 'json-diff';

const tools: { id: Tool; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'markdown',
    label: 'Markdown',
    description: 'Editor with live preview',
    icon: <PencilLineIcon className="size-4" />
  },
  {
    id: 'json-formatter',
    label: 'JSON Formatter',
    description: 'Format, minify & sort',
    icon: <BracesIcon className="size-4" />
  },
  {
    id: 'json-diff',
    label: 'JSON Diff',
    description: 'Compare two JSONs',
    icon: <GitCompareArrowsIcon className="size-4" />
  }
];

const toolLabels: Record<Tool, string> = {
  markdown: 'Markdown',
  'json-formatter': 'JSON Formatter',
  'json-diff': 'JSON Diff'
};

export function ToolSwitcher({ tool, setTool }: { tool: Tool; setTool: (t: Tool) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-base font-bold tracking-tight sm:gap-2 sm:text-lg"
        >
          {toolLabels[tool]}
          <ChevronDownIcon className="size-3.5 opacity-50 sm:size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTool(t.id)} className="gap-3 py-2">
            <span className="text-muted-foreground">{t.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{t.label}</div>
              <div className="text-muted-foreground text-xs">{t.description}</div>
            </div>
            {t.id === tool && <CheckIcon className="text-primary size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
