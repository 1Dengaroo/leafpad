'use client';

import { type RefObject } from 'react';
import type { CodeEditorHandle } from '@/components/code-editor';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListIcon,
  ListOrderedIcon,
  ListChecksIcon,
  LinkIcon,
  ImageIcon,
  CodeIcon,
  CodeSquareIcon,
  QuoteIcon,
  MinusIcon,
  TableIcon
} from 'lucide-react';

interface ToolbarAction {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  action: (editor: CodeEditorHandle) => void;
}

const toolbarGroups: ToolbarAction[][] = [
  [
    { icon: Heading1Icon, label: 'Heading 1', action: (e) => e.insertAtLineStart('# ') },
    { icon: Heading2Icon, label: 'Heading 2', action: (e) => e.insertAtLineStart('## ') },
    { icon: Heading3Icon, label: 'Heading 3', action: (e) => e.insertAtLineStart('### ') }
  ],
  [
    { icon: BoldIcon, label: 'Bold', shortcut: '⌘B', action: (e) => e.wrapSelection('**', '**') },
    { icon: ItalicIcon, label: 'Italic', shortcut: '⌘I', action: (e) => e.wrapSelection('*', '*') },
    {
      icon: StrikethroughIcon,
      label: 'Strikethrough',
      shortcut: '⌘⇧X',
      action: (e) => e.wrapSelection('~~', '~~')
    }
  ],
  [
    { icon: ListIcon, label: 'Bullet List', action: (e) => e.insertAtLineStart('- ') },
    { icon: ListOrderedIcon, label: 'Ordered List', action: (e) => e.insertAtLineStart('1. ') },
    { icon: ListChecksIcon, label: 'Task List', action: (e) => e.insertAtLineStart('- [ ] ') }
  ],
  [
    {
      icon: LinkIcon,
      label: 'Link',
      shortcut: '⌘K',
      action: (e) => e.wrapSelection('[', '](url)')
    },
    { icon: ImageIcon, label: 'Image', action: (e) => e.insertText('![alt](url)') },
    { icon: CodeIcon, label: 'Inline Code', action: (e) => e.wrapSelection('`', '`') },
    {
      icon: CodeSquareIcon,
      label: 'Code Block',
      shortcut: '⌘⇧K',
      action: (e) => e.insertText('\n```\n\n```\n')
    }
  ],
  [
    {
      icon: QuoteIcon,
      label: 'Blockquote',
      shortcut: '⌘⇧.',
      action: (e) => e.insertAtLineStart('> ')
    },
    { icon: MinusIcon, label: 'Horizontal Rule', action: (e) => e.insertText('\n---\n') },
    {
      icon: TableIcon,
      label: 'Table',
      action: (e) =>
        e.insertText(
          '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n'
        )
    }
  ]
];

export function MarkdownToolbar({ editorRef }: { editorRef: RefObject<CodeEditorHandle | null> }) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {toolbarGroups.map((group, gi) => (
        <div key={gi} className="flex items-center">
          {gi > 0 && <div className="bg-border mx-1 h-5 w-px" />}
          {group.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors"
                  onClick={() => {
                    if (editorRef.current) {
                      item.action(editorRef.current);
                    }
                  }}
                  aria-label={item.label}
                >
                  <item.icon className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {item.label}
                {item.shortcut && (
                  <span className="text-muted-foreground ml-1.5">({item.shortcut})</span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  );
}
