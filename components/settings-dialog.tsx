'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import { SettingsIcon, CheckIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useFont } from '@/lib/theme/font-provider';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import { themes } from '@/lib/theme/theme-registry';
import { editorThemes } from '@/lib/theme/editor-themes';
import { fonts } from '@/lib/theme/font-registry';
import { useSyncExternalStore } from 'react';

export function SettingsDialog() {
  const { theme, setTheme } = useTheme();
  const { currentFont, setFont } = useFont();
  const { editorThemeId, setEditorTheme, syntaxHighlight, setSyntaxHighlight } = useEditorTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const currentTheme = themes.find((t) => t.id === theme) ?? themes[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/60"
        >
          <SettingsIcon className="size-[15px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your editor appearance.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Theme */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`hover:bg-accent/50 flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors ${
                    mounted && t.id === currentTheme.id
                      ? 'border-primary ring-primary ring-1'
                      : 'border-border'
                  }`}
                >
                  <div className="flex gap-1">
                    <span
                      className="border-border/50 inline-block size-3.5 rounded-full border"
                      style={{ background: t.previewColors.bg }}
                    />
                    <span
                      className="border-border/50 inline-block size-3.5 rounded-full border"
                      style={{ background: t.previewColors.primary }}
                    />
                    <span
                      className="border-border/50 inline-block size-3.5 rounded-full border"
                      style={{ background: t.previewColors.accent }}
                    />
                  </div>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Editor Theme */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Editor Color</h3>
            <div className="grid grid-cols-3 gap-2">
              {editorThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEditorTheme(t.id)}
                  className={`hover:bg-accent/50 flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors ${
                    t.id === editorThemeId ? 'border-primary ring-primary ring-1' : 'border-border'
                  }`}
                >
                  <div className="flex gap-1">
                    <span
                      className="border-border/50 inline-block size-3.5 rounded-sm border"
                      style={{ background: t.colors.bg }}
                    />
                    <span
                      className="border-border/50 inline-block size-3.5 rounded-sm border"
                      style={{ background: t.colors.text }}
                    />
                  </div>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Syntax Highlighting */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Syntax Highlighting</h3>
              <button
                onClick={() => setSyntaxHighlight(!syntaxHighlight)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  syntaxHighlight ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block size-3.5 rounded-full bg-white transition-transform ${
                    syntaxHighlight ? 'translate-x-[18px]' : 'translate-x-[3px]'
                  }`}
                />
              </button>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Color JSON tokens in the editor</p>
          </section>

          {/* Font */}
          <section>
            <h3 className="mb-3 text-sm font-medium">Font</h3>
            <div className="flex flex-col gap-1">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`hover:bg-accent/50 flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                    f.id === currentFont.id ? 'border-primary ring-primary ring-1' : 'border-border'
                  }`}
                  style={{ fontFamily: `var(${f.variable})` }}
                >
                  <span>{f.name}</span>
                  {f.id === currentFont.id && <CheckIcon className="text-primary size-3.5" />}
                </button>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
