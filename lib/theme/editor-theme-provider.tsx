'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { editorThemes, type EditorTheme } from './editor-themes';

interface EditorThemeContext {
  editorTheme: EditorTheme;
  editorThemeId: string;
  setEditorTheme: (id: string) => void;
  syntaxHighlight: boolean;
  setSyntaxHighlight: (on: boolean) => void;
}

const SYNTAX_KEY = 'leafpad-syntax-highlight';

const Context = createContext<EditorThemeContext>({
  editorTheme: editorThemes[0],
  editorThemeId: 'auto',
  setEditorTheme: () => {},
  syntaxHighlight: true,
  setSyntaxHighlight: () => {}
});

export function EditorThemeProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState('auto');
  const [syntaxHighlight, setSyntaxHighlightState] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(SYNTAX_KEY);
    return saved !== null ? saved === 'true' : true;
  });

  const editorTheme = editorThemes.find((t) => t.id === id) ?? editorThemes[0];

  const setEditorTheme = useCallback((newId: string) => {
    setId(newId);
  }, []);

  const setSyntaxHighlight = useCallback((on: boolean) => {
    setSyntaxHighlightState(on);
    localStorage.setItem(SYNTAX_KEY, String(on));
  }, []);

  return (
    <Context.Provider
      value={{
        editorTheme,
        editorThemeId: id,
        setEditorTheme,
        syntaxHighlight,
        setSyntaxHighlight
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useEditorTheme() {
  return useContext(Context);
}
