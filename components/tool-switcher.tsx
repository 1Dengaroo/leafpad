'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  GitCompareArrowsIcon,
  WrenchIcon
} from 'lucide-react';

export type Tool = 'markdown' | 'json-formatter' | 'diff-tool' | 'utilities';

const tools: {
  id: Tool;
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'markdown',
    href: '/markdown',
    label: 'Markdown',
    description: 'Editor with live preview',
    icon: <PencilLineIcon className="size-4" />
  },
  {
    id: 'json-formatter',
    href: '/json-formatter',
    label: 'JSON Formatter',
    description: 'Format, minify & sort',
    icon: <BracesIcon className="size-4" />
  },
  {
    id: 'diff-tool',
    href: '/diff-tool',
    label: 'Diff Tool',
    description: 'Compare JSON or text',
    icon: <GitCompareArrowsIcon className="size-4" />
  },
  {
    id: 'utilities',
    href: '/utilities',
    label: 'Utilities',
    description: 'UUID, NanoID & Base64',
    icon: <WrenchIcon className="size-4" />
  }
];

function getActiveTool(pathname: string): Tool | null {
  const match = tools.find((t) => t.href === pathname);
  return match?.id ?? null;
}

export function ToolSwitcher() {
  const pathname = usePathname();
  const activeTool = getActiveTool(pathname);
  const activeLabel = activeTool
    ? (tools.find((t) => t.id === activeTool)?.label ?? 'Select Tool...')
    : 'Select Tool...';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-base font-bold tracking-tight sm:gap-2 sm:text-lg"
        >
          {activeLabel}
          <ChevronDownIcon className="size-3.5 opacity-50 sm:size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tools.map((t) => (
          <DropdownMenuItem key={t.id} asChild>
            <Link href={t.href} className="gap-3 py-2">
              <span className="text-muted-foreground">{t.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-muted-foreground text-xs">{t.description}</div>
              </div>
              {t.id === activeTool && <CheckIcon className="text-primary size-3.5" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
