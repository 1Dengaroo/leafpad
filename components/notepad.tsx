'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlusIcon,
  Trash2Icon,
  TrashIcon,
  Columns2Icon,
  Columns3Icon,
  Columns4Icon,
  SquareIcon,
  CheckSquare2Icon,
  CheckIcon,
  XIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { type Note, loadNotes, saveNotes, clearNotes } from '@/lib/notepad-storage';

// ── Helpers ────────────────────────────────────────────────────

function formatTime(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const COLUMNS_KEY = 'leafpad:notepad:columns';

type ColumnCount = 1 | 2 | 3 | 4;

const columnIcons: Record<ColumnCount, React.ReactNode> = {
  1: <SquareIcon className="size-3.5" />,
  2: <Columns2Icon className="size-3.5" />,
  3: <Columns3Icon className="size-3.5" />,
  4: <Columns4Icon className="size-3.5" />
};

const columnClasses: Record<ColumnCount, string> = {
  1: 'columns-1',
  2: 'columns-1 sm:columns-2',
  3: 'columns-1 sm:columns-2 lg:columns-3',
  4: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'
};

// ── useNotes hook ──────────────────────────────────────────────

function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveNotes(notes);
  }, [notes, hydrated]);

  const addNote = useCallback(() => {
    const note: Note = {
      id: crypto.randomUUID(),
      text: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((prev) => [note, ...prev]);
    return note.id;
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text, updatedAt: Date.now() } : n))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const deleteNotes = useCallback((ids: Set<string>) => {
    setNotes((prev) => prev.filter((n) => !ids.has(n.id)));
  }, []);

  const deleteAll = useCallback(() => {
    setNotes([]);
    clearNotes();
  }, []);

  return { notes, hydrated, addNote, updateNote, deleteNote, deleteNotes, deleteAll };
}

// ── NoteCard ───────────────────────────────────────────────────

function NoteCard({
  note,
  isEditing,
  isSelecting,
  isSelected,
  onStartEdit,
  onFinishEdit,
  onDelete,
  onToggleSelect
}: {
  note: Note;
  isEditing: boolean;
  isSelecting: boolean;
  isSelected: boolean;
  onStartEdit: () => void;
  onFinishEdit: (text: string) => void;
  onDelete: () => void;
  onToggleSelect: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState(note.text);
  const prevTextRef = useRef(note.text);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const ta = textareaRef.current;
      ta.focus();
      ta.selectionStart = ta.value.length;
      ta.selectionEnd = ta.value.length;
      resizeTextarea(ta);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setDraft(note.text);
      prevTextRef.current = note.text;
    }
  }, [note.text, isEditing]);

  function resizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function handleBlur() {
    const trimmed = draft.trim();
    onFinishEdit(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setDraft(prevTextRef.current);
      setTimeout(() => textareaRef.current?.blur(), 0);
    }
  }

  function handleClick() {
    if (isSelecting) {
      onToggleSelect();
    } else if (!isEditing) {
      onStartEdit();
    }
  }

  return (
    <Card
      className={cn(
        'group relative break-inside-avoid transition-colors min-h-[7rem] border-l-[3px] border-l-primary',
        !isEditing && !isSelecting && 'active:bg-accent/50 cursor-pointer',
        isEditing && 'ring-1 ring-primary/10',
        isSelecting && 'cursor-pointer',
        isSelected && 'bg-primary/5 ring-1 ring-primary/20'
      )}
      onClick={handleClick}
    >
      <CardContent className="relative px-4 pt-4 pb-0">
        {/* Selection checkbox */}
        {isSelecting && (
          <div className="absolute top-3 right-3">
            {isSelected ? (
              <CheckSquare2Icon className="text-primary size-4" />
            ) : (
              <SquareIcon className="text-muted-foreground size-4" />
            )}
          </div>
        )}

        {/* Delete button — only in normal mode */}
        {!isSelecting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              'absolute top-3 right-3 flex size-7 items-center justify-center rounded-md transition-all',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              'sm:opacity-0 sm:group-hover:opacity-100'
            )}
            aria-label="Delete note"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        )}

        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              resizeTextarea(e.target);
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Type your note..."
            rows={3}
            className={cn(
              'w-full resize-none bg-transparent leading-relaxed outline-none',
              'placeholder:text-muted-foreground/60',
              'pr-6',
              'text-[16px] sm:text-sm'
            )}
            style={{ userSelect: 'text' }}
          />
        ) : (
          <div className="pr-6">
            <p
              className="whitespace-pre-wrap text-sm leading-relaxed"
              style={{ userSelect: 'text' }}
            >
              {note.text || (
                <span className="text-muted-foreground italic">Empty note</span>
              )}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 pt-3 pb-3">
        <p className="text-muted-foreground text-[11px]">
          {formatTime(note.updatedAt)}
        </p>
      </CardFooter>
    </Card>
  );
}

// ── Notepad (main) ─────────────────────────────────────────────

export function Notepad() {
  const { notes, hydrated, addNote, updateNote, deleteNote, deleteNotes, deleteAll } = useNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnCount>(3);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Load saved column preference
  useEffect(() => {
    const saved = localStorage.getItem(COLUMNS_KEY);
    if (saved) {
      const n = Number(saved);
      if (n >= 1 && n <= 4) setColumns(n as ColumnCount);
    }
  }, []);

  function cycleColumns() {
    const next = (columns === 4 ? 1 : columns + 1) as ColumnCount;
    setColumns(next);
    localStorage.setItem(COLUMNS_KEY, String(next));
  }

  function handleNewNote() {
    if (selecting) return;
    const id = addNote();
    setEditingId(id);
  }

  function handleFinishEdit(id: string, text: string) {
    if (text === '') {
      deleteNote(id);
    } else {
      updateNote(id, text);
    }
    setEditingId(null);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelecting() {
    setSelecting(false);
    setSelected(new Set());
  }

  function handleDeleteSelected() {
    const count = selected.size;
    deleteNotes(selected);
    exitSelecting();
    toast.success(`${count} ${count === 1 ? 'note' : 'notes'} deleted`);
  }

  function handleConfirmSingleDelete() {
    if (singleDeleteId) {
      if (editingId === singleDeleteId) setEditingId(null);
      deleteNote(singleDeleteId);
      setSingleDeleteId(null);
      toast.success('Note deleted');
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <p className="text-muted-foreground text-xs tabular-nums">
          {hydrated && notes.length > 0 && (
            <>
              {selecting && selected.size > 0
                ? `${selected.size} selected`
                : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
            </>
          )}
        </p>
        <div className="flex items-center gap-1">
          {selecting ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  if (selected.size === notes.length) {
                    setSelected(new Set());
                  } else {
                    setSelected(new Set(notes.map((n) => n.id)));
                  }
                }}
              >
                <CheckSquare2Icon className="size-3.5" />
                <span className="hidden sm:inline">
                  {selected.size === notes.length ? 'Deselect all' : 'Select all'}
                </span>
              </Button>
              {selected.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive gap-1.5 hover:text-destructive"
                  onClick={() => setDeleteSelectedDialogOpen(true)}
                >
                  <TrashIcon className="size-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={exitSelecting}>
                <XIcon className="size-3.5" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={cycleColumns}>
                    {columnIcons[columns]}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{columns} {columns === 1 ? 'column' : 'columns'}</TooltipContent>
              </Tooltip>
              {notes.length > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelecting(true);
                        setEditingId(null);
                      }}
                    >
                      <CheckIcon className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Select notes</TooltipContent>
                </Tooltip>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1.5 sm:inline-flex"
                onClick={handleNewNote}
              >
                <PlusIcon className="size-3.5" />
                New note
              </Button>
              {notes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground gap-1.5 hover:text-destructive"
                  onClick={() => setClearDialogOpen(true)}
                >
                  <TrashIcon className="size-3.5" />
                  <span className="hidden sm:inline">Clear all</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-4">
        {hydrated && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-muted-foreground/60 text-sm">No notes yet</p>
            <p className="text-muted-foreground/40 mt-1 text-xs">
              Tap <span className="text-primary font-medium">+</span> to jot something down
            </p>
          </div>
        )}

        <div className={cn(columnClasses[columns], 'gap-3 [&>*]:mb-3')}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={!selecting && editingId === note.id}
              isSelecting={selecting}
              isSelected={selected.has(note.id)}
              onStartEdit={() => setEditingId(note.id)}
              onFinishEdit={(text) => handleFinishEdit(note.id, text)}
              onDelete={() => setSingleDeleteId(note.id)}
              onToggleSelect={() => toggleSelect(note.id)}
            />
          ))}
        </div>
      </div>

      {/* FAB — mobile only */}
      {!selecting && (
        <button
          onClick={handleNewNote}
          className={cn(
            'fixed bottom-6 right-6 z-10 flex size-14 items-center justify-center rounded-full shadow-lg transition-all sm:hidden',
            'bg-primary text-primary-foreground',
            'active:scale-95 hover:shadow-xl'
          )}
          aria-label="New note"
        >
          <PlusIcon className="size-6" />
        </button>
      )}

      {/* Alert: delete single note */}
      <AlertDialog open={!!singleDeleteId} onOpenChange={(open) => !open && setSingleDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This note will be permanently deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleConfirmSingleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert: delete selected notes */}
      <AlertDialog open={deleteSelectedDialogOpen} onOpenChange={setDeleteSelectedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} {selected.size === 1 ? 'note' : 'notes'}?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected.size === 1
                ? 'This note will be permanently deleted.'
                : `These ${selected.size} notes will be permanently deleted.`}{' '}
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteSelected}
            >
              Delete {selected.size} {selected.size === 1 ? 'note' : 'notes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert: clear all */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all notes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {notes.length}{' '}
              {notes.length === 1 ? 'note' : 'notes'}. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                deleteAll();
                setClearDialogOpen(false);
                setEditingId(null);
                exitSelecting();
                toast.success('All notes deleted');
              }}
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
