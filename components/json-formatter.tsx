'use client';

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { JsonEditor } from '@/components/json-editor';
import { IndentDropdown } from '@/components/indent-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { jsonExamples } from '@/lib/json-examples';
import { toast } from 'sonner';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import { ResizeHandle } from '@/components/resize-handle';
import {
  SparklesIcon,
  Trash2Icon,
  FlaskConicalIcon,
  MinimizeIcon,
  ArrowDownAZIcon,
  DownloadIcon,
  CopyIcon,
  ArrowLeftIcon,
  PencilLineIcon,
  FileOutputIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'leafpad-json-input';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function sortKeysDeep(val: unknown): unknown {
  if (Array.isArray(val)) return val.map(sortKeysDeep);
  if (val !== null && typeof val === 'object') {
    return Object.keys(val as Record<string, unknown>)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = sortKeysDeep((val as Record<string, unknown>)[key]);
          return acc;
        },
        {} as Record<string, unknown>
      );
  }
  return val;
}

export function JsonFormatter() {
  const { syntaxHighlight } = useEditorTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitFraction, setSplitFraction] = useState(0.5);
  const [input, setInput] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY) ?? '';
  });
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const outputRef = useRef(output);
  outputRef.current = output;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>('input');
  const loaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value);
    }, 300);
  }, []);

  const handleIndentChange = useCallback((size: number) => {
    setIndentSize(size);
    const current = outputRef.current;
    if (current) {
      try {
        const parsed = JSON.parse(current);
        setOutput(JSON.stringify(parsed, null, size));
      } catch {
        // output is already invalid, do nothing
      }
    }
  }, []);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setError('');
      setMobileTab('output');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, indentSize]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
      setMobileTab('output');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input]);

  const handleSortKeys = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const sorted = sortKeysDeep(parsed);
      setOutput(JSON.stringify(sorted, null, indentSize));
      setError('');
      setMobileTab('output');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, indentSize]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!loaded) return null;

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 sm:px-4">
        <Button size="sm" onClick={handleFormat} className="gap-1.5">
          <SparklesIcon className="size-3.5" />
          Format
        </Button>
        <Button size="sm" variant="outline" onClick={handleMinify} className="gap-1.5">
          <MinimizeIcon className="size-3.5" />
          <span className="hidden sm:inline">Minify</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleSortKeys} className="gap-1.5">
          <ArrowDownAZIcon className="size-3.5" />
          <span className="hidden sm:inline">Sort Keys</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear} className="gap-1.5">
          <Trash2Icon className="size-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
        <IndentDropdown indentSize={indentSize} setIndentSize={handleIndentChange} />
        {output && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5">
                <DownloadIcon className="size-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  downloadFile('formatted.json', output, 'application/json');
                }}
              >
                <DownloadIcon className="size-3.5" />
                Download .json
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success('Copied to clipboard');
                }}
              >
                <CopyIcon className="size-3.5" />
                Copy to clipboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {error && <span className="text-destructive order-last basis-full text-sm">{error}</span>}
      </div>

      {/* Mobile tab bar */}
      <div className="flex border-b md:hidden">
        <button
          onClick={() => setMobileTab('input')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'input'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <PencilLineIcon className="size-3.5" />
          Input
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'output'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <FileOutputIcon className="size-3.5" />
          Output
        </button>
      </div>

      {/* Editor panels */}
      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col gap-0 md:flex-row">
        <div
          className={cn(
            'mobile-tab-panel flex flex-col p-3 md:flex md:border-b-0',
            mobileTab === 'input' ? 'min-h-0' : 'hidden'
          )}
          style={{ flex: `0 0 ${splitFraction * 100}%` }}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-muted-foreground hidden text-xs font-medium md:inline">
              Input
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="xs" className="text-muted-foreground gap-1">
                  <FlaskConicalIcon className="size-3" />
                  Examples
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Load Example</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {jsonExamples.map((ex) => (
                  <DropdownMenuItem key={ex.id} onClick={() => handleInputChange(ex.data)}>
                    {ex.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="min-h-0 flex-1">
            <JsonEditor
              value={input}
              onChange={handleInputChange}
              placeholder="Paste JSON here..."
              syntaxHighlight={syntaxHighlight}
            />
          </div>
        </div>
        <ResizeHandle onResize={setSplitFraction} containerRef={containerRef} />
        <div
          className={cn(
            'mobile-tab-panel flex flex-col p-3 md:flex',
            mobileTab === 'output' ? 'min-h-0' : 'hidden'
          )}
          style={{ flex: 1 }}
        >
          <div className="mb-1.5 flex h-6 items-center justify-between">
            <span className="text-muted-foreground hidden text-xs font-medium md:inline">
              Output
            </span>
            {output && (
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground gap-1"
                onClick={() => {
                  handleInputChange(output);
                  setMobileTab('input');
                }}
              >
                <ArrowLeftIcon className="size-3" />
                Use as input
              </Button>
            )}
          </div>
          <div className="min-h-0 flex-1">
            <JsonEditor
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              error={!!error}
              syntaxHighlight={syntaxHighlight}
            />
          </div>
        </div>
      </div>
    </>
  );
}
