'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';
import { darkThemeIds, themeIds } from './theme-registry';

function DarkClassManager() {
  const { theme } = useTheme();

  useEffect(() => {
    const isDark = theme ? darkThemeIds.includes(theme) : false;
    document.documentElement.classList.toggle('dark', isDark);
  }, [theme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      themes={themeIds}
      enableSystem={false}
      disableTransitionOnChange
    >
      <DarkClassManager />
      {children}
    </NextThemesProvider>
  );
}
