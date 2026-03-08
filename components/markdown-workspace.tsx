'use client';

import { useState, useRef, useCallback, useMemo, useSyncExternalStore } from 'react';
import { CodeEditor, type CodeEditorHandle } from '@/components/code-editor';
import { MarkdownToolbar } from '@/components/markdown-toolbar';
import { MarkdownPreview } from '@/components/markdown-preview';
import { markdownExamples } from '@/lib/markdown-examples';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileTextIcon, DownloadIcon, PencilLineIcon, EyeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ResizeHandle } from '@/components/resize-handle';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'leafpad-markdown';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function MarkdownWorkspace() {
  const editorRef = useRef<CodeEditorHandle>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitFraction, setSplitFraction] = useState(0.5);
  const [markdown, setMarkdown] = useState(() => {
    if (typeof window === 'undefined') return '';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : markdownExamples[0].content;
  });
  const loaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced save to localStorage
  const handleChange = useCallback((value: string) => {
    setMarkdown(value);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, value);
    }, 300);
  }, []);

  const stats = useMemo(() => {
    const text = markdown.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown ? markdown.split('\n').length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, lines, readingTime };
  }, [markdown]);

  const handleExportMd = useCallback(() => {
    downloadFile('document.md', markdown, 'text/markdown');
  }, [markdown]);

  const handleExportHtml = useCallback(() => {
    const html = previewRef.current?.innerHTML ?? '';
    const doc = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head>
<body>${html}</body>
</html>`;
    downloadFile('document.html', doc, 'text/html');
  }, []);

  const handleCopyHtml = useCallback(() => {
    const html = previewRef.current?.innerHTML ?? '';
    navigator.clipboard.writeText(html);
    toast.success('HTML copied to clipboard', { duration: 2000, position: 'bottom-center' });
  }, []);

  if (!loaded) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar row */}
      <div className="flex items-center justify-between border-b">
        <MarkdownToolbar editorRef={editorRef} />
        <div className="flex items-center gap-1 pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <DownloadIcon className="size-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportMd}>Download .md</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportHtml}>Download .html</DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyHtml}>Copy HTML</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <FileTextIcon className="size-3.5" />
                <span className="hidden sm:inline">Examples</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {markdownExamples.map((ex) => (
                <DropdownMenuItem key={ex.id} onClick={() => handleChange(ex.content)}>
                  {ex.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="flex border-b md:hidden">
        <button
          onClick={() => setMobileTab('editor')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'editor'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <PencilLineIcon className="size-3.5" />
          Editor
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            mobileTab === 'preview'
              ? 'border-primary text-foreground border-b-2'
              : 'text-muted-foreground'
          )}
        >
          <EyeIcon className="size-3.5" />
          Preview
        </button>
      </div>

      {/* Split pane (desktop) / Tabbed view (mobile) */}
      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Editor */}
        <div
          className={cn(
            'mobile-tab-panel flex min-h-0 flex-col',
            mobileTab === 'editor' ? 'flex' : 'hidden md:flex'
          )}
          style={{ flex: `0 0 ${splitFraction * 100}%` }}
        >
          <CodeEditor
            ref={editorRef}
            value={markdown}
            onChange={handleChange}
            placeholder="Write markdown here..."
          />
        </div>

        <ResizeHandle onResize={setSplitFraction} containerRef={containerRef} />

        {/* Preview */}
        <div
          className={cn(
            'mobile-tab-panel min-h-0 overflow-hidden',
            mobileTab === 'preview' ? 'flex flex-col' : 'hidden md:block'
          )}
          style={{ flex: 1 }}
        >
          <MarkdownPreview ref={previewRef} content={markdown} />
        </div>
      </div>

      {/* Stats bar */}
      <div className="text-muted-foreground flex items-center gap-3 border-t px-3 py-1.5 text-xs sm:gap-4 sm:px-4">
        <span>{stats.words} words</span>
        <span className="hidden sm:inline">{stats.chars} characters</span>
        <span>{stats.lines} lines</span>
        <span>{stats.readingTime} min read</span>
      </div>
    </div>
  );
}
