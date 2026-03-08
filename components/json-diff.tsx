'use client';

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { JsonEditor, type LineStatus } from '@/components/json-editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { diffPresets } from '@/lib/diff-presets';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import { ResizeHandle } from '@/components/resize-handle';
import {
  GitCompareArrowsIcon,
  Trash2Icon,
  FlaskConicalIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// LCS-based line diff algorithm
function computeDiff(leftLines: string[], rightLines: string[]) {
  const m = leftLines.length;
  const n = rightLines.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (leftLines[i - 1] === rightLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to get per-line statuses
  const leftStatuses: LineStatus[] = new Array(m).fill(null);
  const rightStatuses: LineStatus[] = new Array(n).fill(null);

  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i - 1] === rightLines[j - 1]) {
      // unchanged
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rightStatuses[j - 1] = 'added';
      j--;
    } else {
      leftStatuses[i - 1] = 'removed';
      i--;
    }
  }

  return { leftStatuses, rightStatuses };
}

const LEFT_KEY = 'leafpad-diff-left';
const RIGHT_KEY = 'leafpad-diff-right';

export function JsonDiff() {
  const { syntaxHighlight } = useEditorTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitFraction, setSplitFraction] = useState(0.5);
  const [left, setLeft] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(LEFT_KEY) ?? '';
  });
  const [right, setRight] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(RIGHT_KEY) ?? '';
  });
  const leftTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rightTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [mobileTab, setMobileTab] = useState<'left' | 'right'>('left');
  const loaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [leftStatuses, setLeftStatuses] = useState<LineStatus[] | undefined>();
  const [rightStatuses, setRightStatuses] = useState<LineStatus[] | undefined>();

  const handleCompare = useCallback(() => {
    const leftLines = left.split('\n');
    const rightLines = right.split('\n');
    const { leftStatuses: ls, rightStatuses: rs } = computeDiff(leftLines, rightLines);
    setLeftStatuses(ls);
    setRightStatuses(rs);
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft('');
    setRight('');
    setLeftStatuses(undefined);
    setRightStatuses(undefined);
    localStorage.removeItem(LEFT_KEY);
    localStorage.removeItem(RIGHT_KEY);
  }, []);

  const handleLeftChange = useCallback((v: string) => {
    setLeft(v);
    setLeftStatuses(undefined);
    setRightStatuses(undefined);
    if (leftTimerRef.current) clearTimeout(leftTimerRef.current);
    leftTimerRef.current = setTimeout(() => {
      localStorage.setItem(LEFT_KEY, v);
    }, 300);
  }, []);

  const handleRightChange = useCallback((v: string) => {
    setRight(v);
    setLeftStatuses(undefined);
    setRightStatuses(undefined);
    if (rightTimerRef.current) clearTimeout(rightTimerRef.current);
    rightTimerRef.current = setTimeout(() => {
      localStorage.setItem(RIGHT_KEY, v);
    }, 300);
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = diffPresets.find((p) => p.id === presetId);
    if (!preset) return;
    setLeft(preset.left);
    setRight(preset.right);
    setLeftStatuses(undefined);
    setRightStatuses(undefined);
    localStorage.setItem(LEFT_KEY, preset.left);
    localStorage.setItem(RIGHT_KEY, preset.right);
  }, []);

  if (!loaded) return null;

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 sm:px-4">
        <Button
          size="sm"
          onClick={handleCompare}
          disabled={!left.trim() && !right.trim()}
          className="gap-1.5"
        >
          <GitCompareArrowsIcon className="size-3.5" />
          Compare
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear} className="gap-1.5">
          <Trash2Icon className="size-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      {/* Mobile tab bar */}
      <div className="flex border-b md:hidden">
        <button
          onClick={() => setMobileTab('left')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'left'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <ArrowLeftIcon className="size-3.5" />
          Left
        </button>
        <button
          onClick={() => setMobileTab('right')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'right'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <ArrowRightIcon className="size-3.5" />
          Right
        </button>
      </div>

      {/* Editor panels */}
      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col gap-0 md:flex-row">
        <div
          className={cn(
            'mobile-tab-panel flex flex-col p-3 md:flex md:border-b-0',
            mobileTab === 'left' ? 'min-h-0' : 'hidden'
          )}
          style={{ flex: `0 0 ${splitFraction * 100}%` }}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-muted-foreground hidden text-xs font-medium md:inline">Left</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" className="text-muted-foreground gap-1">
                  <FlaskConicalIcon className="size-3" />
                  Presets
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Load Preset</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {diffPresets.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => loadPreset(p.id)}>
                    {p.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="min-h-0 flex-1">
            <JsonEditor
              value={left}
              onChange={handleLeftChange}
              placeholder="Paste first JSON here..."
              lineStatuses={leftStatuses}
              syntaxHighlight={syntaxHighlight}
            />
          </div>
        </div>
        <ResizeHandle onResize={setSplitFraction} containerRef={containerRef} />
        <div
          className={cn(
            'mobile-tab-panel flex flex-col p-3 md:flex',
            mobileTab === 'right' ? 'min-h-0' : 'hidden'
          )}
          style={{ flex: 1 }}
        >
          <div className="mb-1.5 flex h-6 items-center">
            <span className="text-muted-foreground hidden text-xs font-medium md:inline">
              Right
            </span>
          </div>
          <div className="min-h-0 flex-1">
            <JsonEditor
              value={right}
              onChange={handleRightChange}
              placeholder="Paste second JSON here..."
              lineStatuses={rightStatuses}
              syntaxHighlight={syntaxHighlight}
            />
          </div>
        </div>
      </div>
    </>
  );
}
