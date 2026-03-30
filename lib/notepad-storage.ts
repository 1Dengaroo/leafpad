const STORAGE_KEY = 'leafpad:notepad:notes';

export interface Note {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

interface NotepadStorage {
  version: 1;
  notes: Note[];
}

export function loadNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: NotepadStorage = JSON.parse(raw);
    if (data.version === 1 && Array.isArray(data.notes))
      return data.notes.map((n) => ({ ...n, title: n.title ?? '' }));
    return [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === 'undefined') return;
  const data: NotepadStorage = { version: 1, notes };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
