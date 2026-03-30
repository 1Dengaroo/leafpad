'use client';

import { useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { toast } from 'sonner';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ClipboardCopyIcon, CheckIcon } from 'lucide-react';

export interface CodeEditorHandle {
  insertText: (text: string) => void;
  wrapSelection: (before: string, after: string) => void;
  insertAtLineStart: (prefix: string) => void;
}

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(function CodeEditor(
  { value, onChange, placeholder },
  ref
) {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const lineCount = value ? value.split('\n').length : 1;

  // Native insert that preserves the browser undo stack
  const nativeInsert = useCallback((ta: HTMLTextAreaElement, text: string) => {
    ta.focus();
    document.execCommand('insertText', false, text);
  }, []);

  const nativeWrap = useCallback((ta: HTMLTextAreaElement, before: string, after: string) => {
    ta.focus();
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    document.execCommand('insertText', false, before + selected + after);
    requestAnimationFrame(() => {
      if (selected.length > 0) {
        ta.selectionStart = start + before.length;
        ta.selectionEnd = start + before.length + selected.length;
      } else {
        ta.selectionStart = ta.selectionEnd = start + before.length;
      }
    });
  }, []);

  const nativeInsertAtLineStart = useCallback((ta: HTMLTextAreaElement, prefix: string) => {
    ta.focus();
    const start = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf('\n', start - 1) + 1;
    ta.selectionStart = lineStart;
    ta.selectionEnd = lineStart;
    document.execCommand('insertText', false, prefix);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + prefix.length;
    });
  }, []);

  useImperativeHandle(ref, () => ({
    insertText(text: string) {
      const ta = textareaRef.current;
      if (!ta) return;
      nativeInsert(ta, text);
    },
    wrapSelection(before: string, after: string) {
      const ta = textareaRef.current;
      if (!ta) return;
      nativeWrap(ta, before, after);
    },
    insertAtLineStart(prefix: string) {
      const ta = textareaRef.current;
      if (!ta) return;
      nativeInsertAtLineStart(ta, prefix);
    }
  }));

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
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        nativeInsert(ta, '  ');
      }
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toast.success("No need to save, it's automatic", {
          duration: 2000,
          position: 'bottom-center'
        });
      }

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const ta = textareaRef.current;
      if (!ta) return;

      if (e.key === 'b' && !e.shiftKey) {
        e.preventDefault();
        nativeWrap(ta, '**', '**');
      } else if (e.key === 'i' && !e.shiftKey) {
        e.preventDefault();
        nativeWrap(ta, '*', '*');
      } else if (e.key === 'k' && !e.shiftKey) {
        e.preventDefault();
        nativeWrap(ta, '[', '](url)');
      } else if (e.key === 'k' && e.shiftKey) {
        e.preventDefault();
        nativeWrap(ta, '\n```\n', '\n```\n');
      } else if (e.key === 'x' && e.shiftKey) {
        e.preventDefault();
        nativeWrap(ta, '~~', '~~');
      } else if (e.key === '.' && e.shiftKey) {
        e.preventDefault();
        nativeInsertAtLineStart(ta, '> ');
      }
    },
    [exitEditor, nativeInsert, nativeWrap, nativeInsertAtLineStart]
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      role="group"
      aria-label={placeholder ?? 'Markdown editor'}
      onKeyDown={handleWrapperKeyDown}
      onClick={enterEditor}
      className="focus:ring-ring/50 flex h-full overflow-hidden border focus:ring-2 focus:outline-none"
      style={{ background: c.bg, borderColor: c.border }}
    >
      {/* Line numbers gutter */}
      <div
        ref={lineNumbersRef}
        className="overflow-hidden border-r px-3 py-3 text-right font-mono text-sm leading-relaxed select-none"
        style={{ background: c.gutterBg, color: c.gutterText, borderColor: c.border }}
        aria-hidden="true"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>

      {/* Textarea wrapper */}
      <div className="group/editor relative flex-1">
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

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          tabIndex={editing ? 0 : -1}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          className="relative h-full w-full resize-none bg-transparent p-3 font-mono text-sm leading-relaxed outline-none select-text"
          style={{
            color: c.text,
            caretColor: c.text
          }}
        />
      </div>
    </div>
  );
});
