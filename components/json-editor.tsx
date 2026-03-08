'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ClipboardCopyIcon, CheckIcon } from 'lucide-react';
import type { EditorTheme } from '@/lib/theme/editor-themes';

export type LineStatus = 'added' | 'removed' | null;

type TokenType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'text';

function tokenizeLine(line: string): { type: TokenType; text: string }[] {
  const tokens: { type: TokenType; text: string }[] = [];
  // Match JSON tokens: strings, numbers, booleans, null, punctuation
  const regex =
    /("(?:[^"\\]|\\.)*")\s*(:)|("(?:[^"\\]|\\.)*")|(true|false)|(null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\]:,])|(\s+)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', text: line.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      // Key (string followed by colon)
      tokens.push({ type: 'key', text: match[1] });
      tokens.push({ type: 'punctuation', text: ':' });
      // Skip whitespace between key and colon captured in \s*
      const fullMatch = match[0];
      const colonIdx = fullMatch.indexOf(':');
      const afterKey = match[1].length;
      if (colonIdx > afterKey) {
        tokens.push({ type: 'text', text: fullMatch.slice(afterKey, colonIdx) });
      }
    } else if (match[3]) {
      tokens.push({ type: 'string', text: match[3] });
    } else if (match[4]) {
      tokens.push({ type: 'boolean', text: match[4] });
    } else if (match[5]) {
      tokens.push({ type: 'null', text: match[5] });
    } else if (match[6]) {
      tokens.push({ type: 'number', text: match[6] });
    } else if (match[7]) {
      tokens.push({ type: 'punctuation', text: match[7] });
    } else if (match[8]) {
      tokens.push({ type: 'text', text: match[8] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ type: 'text', text: line.slice(lastIndex) });
  }

  return tokens;
}

function HighlightedLine({
  line,
  syntax
}: {
  line: string;
  syntax: EditorTheme['colors']['syntax'];
}) {
  const tokens = tokenizeLine(line);
  return (
    <div>
      {tokens.map((token, i) => {
        const color = token.type === 'text' ? undefined : syntax[token.type as keyof typeof syntax];
        return (
          <span key={i} style={color ? { color } : undefined}>
            {token.text}
          </span>
        );
      })}
      {tokens.length === 0 && '\n'}
    </div>
  );
}

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  error?: boolean;
  lineStatuses?: LineStatus[];
  syntaxHighlight?: boolean;
}

export function JsonEditor({
  value,
  onChange,
  readOnly,
  placeholder,
  error,
  lineStatuses,
  syntaxHighlight
}: JsonEditorProps) {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const lineCount = value ? value.split('\n').length : 1;

  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  const enterEditor = useCallback(() => {
    setEditing(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const exitEditor = useCallback(() => {
    setEditing(false);
    wrapperRef.current?.focus();
  }, []);

  const handleWrapperKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (editing) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        enterEditor();
      }
    },
    [editing, enterEditor]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        exitEditor();
        return;
      }
      if (e.key === 'Tab' && !readOnly) {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange?.(newValue);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toast.success("No need to save — it's automatic", {
          duration: 2000,
          position: 'bottom-center'
        });
      }
    },
    [value, onChange, readOnly, exitEditor]
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      if (overlayRef.current) {
        overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      }
      if (highlightRef.current) {
        highlightRef.current.scrollTop = textareaRef.current.scrollTop;
        highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }
    }
  }, []);

  const statusBg = (status: LineStatus) => {
    if (status === 'added') return 'bg-green-500/15';
    if (status === 'removed') return 'bg-red-500/15';
    return '';
  };

  const gutterBg = (status: LineStatus) => {
    if (status === 'added') return 'bg-green-500/25';
    if (status === 'removed') return 'bg-red-500/25';
    return '';
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      role="group"
      aria-label={placeholder ?? 'JSON editor'}
      onKeyDown={handleWrapperKeyDown}
      onClick={enterEditor}
      className={cn(
        'focus:ring-ring/50 flex h-full overflow-hidden border focus:ring-2 focus:outline-none',
        error && 'border-destructive'
      )}
      style={{ background: c.bg, borderColor: error ? undefined : c.border }}
    >
      {/* Line numbers gutter */}
      <div
        ref={lineNumbersRef}
        className="overflow-hidden border-r px-3 py-3 text-right font-mono text-sm leading-relaxed select-none"
        style={{ background: c.gutterBg, color: c.gutterText, borderColor: c.border }}
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i + 1}
            className={cn('-mx-3 px-3', lineStatuses && gutterBg(lineStatuses[i] ?? null))}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Textarea wrapper with overlay */}
      <div
        className="group/editor relative flex-1"
        style={{ background: readOnly ? c.readOnlyBg : undefined }}
      >
        {/* Line highlight overlay */}
        {lineStatuses && (
          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 overflow-hidden p-3 font-mono text-sm leading-relaxed"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className={cn('-mx-3 px-3', statusBg(lineStatuses[i] ?? null))}>
                &nbsp;
              </div>
            ))}
          </div>
        )}

        {/* Copy button */}
        {value && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="absolute top-2 right-2 z-10 rounded-md p-1.5 opacity-100 transition-opacity md:opacity-0 md:group-hover/editor:opacity-100"
                style={{
                  background: c.gutterBg,
                  color: c.gutterText,
                  border: `1px solid ${c.border}`
                }}
                tabIndex={-1}
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <ClipboardCopyIcon className="size-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
          </Tooltip>
        )}

        {/* Syntax highlight layer */}
        {syntaxHighlight && (
          <div
            ref={highlightRef}
            className="pointer-events-none absolute inset-0 overflow-hidden p-3 font-mono text-sm leading-relaxed break-words whitespace-pre-wrap"
            aria-hidden="true"
          >
            {(value || ' ').split('\n').map((line, i) => (
              <HighlightedLine key={i} line={line} syntax={c.syntax} />
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          tabIndex={editing ? 0 : -1}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          onScroll={handleScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className={cn(
            'relative h-full w-full resize-none bg-transparent p-3 font-mono text-sm leading-relaxed outline-none select-text',
            readOnly && 'cursor-default'
          )}
          style={{
            color: syntaxHighlight ? 'transparent' : c.text,
            background: 'transparent',
            caretColor: c.text
          }}
        />
      </div>
    </div>
  );
}
