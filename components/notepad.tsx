'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PlusIcon,
  Trash2Icon,
  TrashIcon,
  LayoutGridIcon,
  SquareIcon,
  CheckSquare2Icon,
  ListChecksIcon,
  XIcon,
  EllipsisVerticalIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { type Note, loadNotes, saveNotes } from '@/lib/notepad-storage';

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

const COLUMN_OPTIONS: { value: ColumnCount; label: string }[] = [
  { value: 1, label: '1 column' },
  { value: 2, label: '2 columns' },
  { value: 3, label: '3 columns' },
  { value: 4, label: '4 columns' }
];

const gridClasses: Record<ColumnCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
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
      title: '',
      text: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setNotes((prev) => [note, ...prev]);
    return note.id;
  }, []);

  const updateNote = useCallback((id: string, fields: Partial<Pick<Note, 'title' | 'text'>>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...fields, updatedAt: Date.now() } : n))
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
  }, []);

  return { notes, hydrated, addNote, updateNote, deleteNote, deleteNotes, deleteAll };
}

// ── NoteCard ───────────────────────────────────────────────────

function NoteCard({
  note,
  isNew,
  isSelecting,
  isSelected,
  onChange,
  onDelete,
  onToggleSelect
}: {
  note: Note;
  isNew: boolean;
  isSelecting: boolean;
  isSelected: boolean;
  onChange: (fields: Partial<Pick<Note, 'title' | 'text'>>) => void;
  onDelete: () => void;
  onToggleSelect: () => void;
}) {
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNew && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isNew]);

  function resizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  useEffect(() => {
    if (textareaRef.current) {
      resizeTextarea(textareaRef.current);
    }
  }, []);

  return (
    <Card
      className={cn(
        'group relative border-l-[3px] border-l-primary transition-colors',
        isSelecting && 'cursor-pointer',
        isSelected && 'bg-primary/5 ring-1 ring-primary/20'
      )}
      onClick={isSelecting ? onToggleSelect : undefined}
    >
      <CardContent className="relative px-4 pt-4 pb-0">
        {isSelecting && (
          <div className="absolute top-3 right-3 z-10">
            {isSelected ? (
              <CheckSquare2Icon className="text-primary size-4" />
            ) : (
              <SquareIcon className="text-muted-foreground size-4" />
            )}
          </div>
        )}

        {!isSelecting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              'absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-md transition-all',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              'sm:opacity-0 sm:group-hover:opacity-100'
            )}
            aria-label="Delete note"
          >
            <Trash2Icon className="size-3.5" />
          </button>
        )}

        <div className="flex flex-col gap-2 pr-6">
          <Input
            ref={titleRef}
            value={note.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Title"
            tabIndex={isSelecting ? -1 : 0}
            className={cn(
              'h-auto rounded-none border-transparent px-0 py-1 text-sm font-semibold shadow-none',
              'focus-visible:border-b-primary focus-visible:ring-0',
              isSelecting && 'pointer-events-none'
            )}
            style={{ userSelect: 'text' }}
          />
          <Textarea
            ref={textareaRef}
            value={note.text}
            onChange={(e) => {
              onChange({ text: e.target.value });
              resizeTextarea(e.target);
            }}
            placeholder="Description"
            tabIndex={isSelecting ? -1 : 0}
            rows={2}
            className={cn(
              'min-h-0 resize-none rounded-none border-transparent px-0 py-1 shadow-none',
              'focus-visible:border-b-primary focus-visible:ring-0',
              'text-[16px] sm:text-sm',
              isSelecting && 'pointer-events-none'
            )}
            style={{ userSelect: 'text' }}
          />
        </div>
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
  const [newestId, setNewestId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [deleteSelectedDialogOpen, setDeleteSelectedDialogOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnCount>(3);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(COLUMNS_KEY);
    if (saved) {
      const n = Number(saved);
      if (n >= 1 && n <= 4) setColumns(n as ColumnCount);
    }
  }, []);

  function setColumnCount(value: ColumnCount) {
    setColumns(value);
    localStorage.setItem(COLUMNS_KEY, String(value));
  }

  function handleNewNote() {
    if (selecting) return;
    const id = addNote();
    setNewestId(id);
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
      deleteNote(singleDeleteId);
      setSingleDeleteId(null);
      toast.success('Note deleted');
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 sm:px-4">
        {selecting ? (
          <>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={exitSelecting}>
              <XIcon className="size-3.5" />
              Done
            </Button>
            <Button
              size="sm"
              variant="outline"
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
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5"
              disabled={selected.size === 0}
              onClick={() => setDeleteSelectedDialogOpen(true)}
            >
              <TrashIcon className="size-3.5" />
              Delete{selected.size > 0 && ` (${selected.size})`}
            </Button>
            <span className="text-muted-foreground ml-auto text-xs tabular-nums">
              {selected.size} of {notes.length} selected
            </span>
          </>
        ) : (
          <>
            <Button size="sm" onClick={handleNewNote} className="gap-1.5">
              <PlusIcon className="size-3.5" />
              New note
            </Button>

            {/* Layout dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <LayoutGridIcon className="size-3.5" />
                  <span className="hidden sm:inline">Layout</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {COLUMN_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setColumnCount(opt.value)}
                  >
                    {columns === opt.value && <CheckSquare2Icon className="size-3.5" />}
                    {columns !== opt.value && <SquareIcon className="size-3.5" />}
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <EllipsisVerticalIcon className="size-3.5" />
                  <span className="hidden sm:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  disabled={notes.length < 2}
                  onClick={() => setSelecting(true)}
                >
                  <ListChecksIcon className="size-3.5" />
                  Select notes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={notes.length === 0}
                  className="text-destructive focus:text-destructive"
                  onClick={() => setClearDialogOpen(true)}
                >
                  <TrashIcon className="size-3.5" />
                  Delete all notes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span className="text-muted-foreground ml-auto text-xs tabular-nums">
              {hydrated && notes.length > 0 && (
                <>{notes.length} {notes.length === 1 ? 'note' : 'notes'}</>
              )}
            </span>
          </>
        )}
      </div>

      {/* Note grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 sm:pb-4">
        {hydrated && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="bg-muted flex size-12 items-center justify-center rounded-full">
              <PlusIcon className="text-muted-foreground size-5" />
            </div>
            <div className="text-center">
              <p className="text-foreground text-sm font-medium">No notes yet</p>
              <p className="text-muted-foreground mt-1 max-w-[200px] text-xs leading-relaxed">
                Create your first note to start jotting things down.
              </p>
            </div>
            <Button size="sm" onClick={handleNewNote} className="gap-1.5">
              <PlusIcon className="size-3.5" />
              New note
            </Button>
          </div>
        )}

        <div className={cn('grid gap-3 auto-rows-min', gridClasses[columns])}>
          <AnimatePresence initial={false} mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { type: 'spring', stiffness: 500, damping: 35 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  y: { duration: 0.25 }
                }}
              >
                <NoteCard
                  note={note}
                  isNew={newestId === note.id}
                  isSelecting={selecting}
                  isSelected={selected.has(note.id)}
                  onChange={(fields) => {
                    updateNote(note.id, fields);
                    if (newestId === note.id) setNewestId(null);
                  }}
                  onDelete={() => setSingleDeleteId(note.id)}
                  onToggleSelect={() => toggleSelect(note.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
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
