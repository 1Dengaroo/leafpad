import Link from 'next/link';
import Image from 'next/image';
import { ToolPage } from '@/components/tool-page';
import {
  PencilLineIcon,
  BracesIcon,
  GitCompareArrowsIcon,
  WrenchIcon,
  StickyNoteIcon,
  ArrowRightIcon
} from 'lucide-react';

export default function LandingPage() {
  return (
    <ToolPage>
      <div className="landing-grid-bg relative flex flex-1 flex-col overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="bento-grid">
            {/* ── Hero ── */}
            <div className="bento-hero landing-animate landing-delay-1 flex flex-col justify-center py-4 sm:py-8">
              <div className="mb-3 flex items-center gap-4">
                <Image
                  src="/logo.svg"
                  alt="Leafpad"
                  width={44}
                  height={44}
                  className="landing-animate-scale landing-delay-1 select-none"
                />
                <h1
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                  }}
                >
                  leafpad
                </h1>
              </div>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
                Developer tools that stay out of your way. Clean, fast, and
                entirely free.
              </p>
            </div>

            {/* ── Markdown (featured, 2 cols) ── */}
            <Link
              href="/markdown"
              className="bento-md bento-card landing-animate landing-delay-3 bg-card group flex flex-col rounded-xl border p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="landing-icon-circle text-primary">
                    <PencilLineIcon className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Markdown</h2>
                </div>
                <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                Editor with live preview, formatting toolbar, and export to .md
                or .html
              </p>
              <div className="preview-block mt-auto flex-1">
                <div
                  className="mb-1 text-sm font-bold"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  # Getting Started
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Write in{' '}
                  <span
                    className="font-bold"
                    style={{ color: 'hsl(var(--foreground))' }}
                  >
                    **markdown**
                  </span>{' '}
                  with live preview.
                </div>
                <div
                  className="mt-1.5 text-xs"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> GFM
                  support
                  <br />
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> Syntax
                  highlighting
                  <br />
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> Export
                  to HTML
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  GFM
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Live Preview
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Export
                </span>
              </div>
            </Link>

            {/* ── JSON Formatter ── */}
            <Link
              href="/json-formatter"
              className="bento-json bento-card landing-animate landing-delay-4 bg-card group flex flex-col rounded-xl border p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="landing-icon-circle text-primary">
                    <BracesIcon className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">JSON Formatter</h2>
                </div>
                <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                Pretty-print, minify, and sort keys with configurable
                indentation
              </p>
              <div className="preview-block mt-auto flex-1">
                <span className="json-bracket">{'{'}</span>
                <br />
                <span>&nbsp;&nbsp;</span>
                <span className="json-key">&quot;name&quot;</span>
                <span className="json-bracket">: </span>
                <span className="json-string">&quot;leafpad&quot;</span>
                <span className="json-bracket">,</span>
                <br />
                <span>&nbsp;&nbsp;</span>
                <span className="json-key">&quot;version&quot;</span>
                <span className="json-bracket">: </span>
                <span className="json-number">2.0</span>
                <span className="json-bracket">,</span>
                <br />
                <span>&nbsp;&nbsp;</span>
                <span className="json-key">&quot;free&quot;</span>
                <span className="json-bracket">: </span>
                <span className="json-number">true</span>
                <br />
                <span className="json-bracket">{'}'}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Format
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Minify
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Sort Keys
                </span>
              </div>
            </Link>

            {/* ── Diff Tool ── */}
            <Link
              href="/diff-tool"
              className="bento-diff bento-card landing-animate landing-delay-5 bg-card group flex flex-col rounded-xl border p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="landing-icon-circle text-primary">
                    <GitCompareArrowsIcon className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Diff Tool</h2>
                </div>
                <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                Compare JSON or text side-by-side with word-level change
                highlighting
              </p>
              <div className="preview-block mt-auto flex-1 space-y-0.5">
                <div className="diff-remove rounded px-1.5 py-0.5">
                  - &quot;status&quot;: &quot;draft&quot;
                </div>
                <div className="diff-add rounded px-1.5 py-0.5">
                  + &quot;status&quot;: &quot;published&quot;
                </div>
                <div className="text-muted-foreground px-1.5 py-0.5">
                  {'  '}&quot;version&quot;: 1
                </div>
                <div className="diff-add rounded px-1.5 py-0.5">
                  + &quot;version&quot;: 2
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  JSON
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Text
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Inline Diff
                </span>
              </div>
            </Link>

            {/* ── Utilities ── */}
            <Link
              href="/utilities"
              className="bento-utils bento-card landing-animate landing-delay-6 bg-card group flex flex-col rounded-xl border p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="landing-icon-circle text-primary">
                    <WrenchIcon className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Utilities</h2>
                </div>
                <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                Generate UUIDs, NanoIDs, encode/decode Base64, and hash with
                SHA-256
              </p>
              <div className="preview-block mt-auto flex-1 space-y-1.5">
                <div>
                  <span className="text-muted-foreground text-[9px] uppercase tracking-widest">
                    UUID
                  </span>
                  <div className="text-primary mt-0.5">
                    f47ac10b-58cc-4372-a567-0e02b2c3d479
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[9px] uppercase tracking-widest">
                    NanoID
                  </span>
                  <div className="text-primary mt-0.5">
                    V1StGXR8_Z5jdHi6B-myT
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  UUID
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  NanoID
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Base64
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Hash
                </span>
              </div>
            </Link>

            {/* ── Notepad ── */}
            <Link
              href="/notepad"
              className="bento-notepad bento-card landing-animate landing-delay-7 bg-card group flex flex-col rounded-xl border p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="landing-icon-circle text-primary">
                    <StickyNoteIcon className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Notepad</h2>
                </div>
                <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
                Quick sticky notes saved locally in your browser. Jot, revisit,
                delete.
              </p>
              <div className="preview-block mt-auto flex-1 space-y-1">
                <div
                  className="text-xs font-medium"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  Meeting notes
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Review API changes before deploy...
                </div>
                <div
                  className="mt-1 border-t pt-1 text-xs font-medium"
                  style={{
                    color: 'hsl(var(--foreground))',
                    borderColor: 'hsl(var(--border) / 0.5)'
                  }}
                >
                  TODO
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                >
                  Fix auth middleware bug
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Notes
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Snippets
                </span>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Local Storage
                </span>
              </div>
            </Link>
          </div>

          {/* ── Footer ── */}
          <div className="landing-animate landing-delay-9 mt-10">
            <div className="landing-separator mb-5" />
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="bg-primary inline-block size-1.5 rounded-full" />
                No tracking
              </span>
              <span className="flex items-center gap-1.5">
                <span className="bg-primary inline-block size-1.5 rounded-full" />
                No ads
              </span>
              <span className="flex items-center gap-1.5">
                <span className="bg-primary inline-block size-1.5 rounded-full" />
                No sign-ups
              </span>
              <a
                href="https://github.com/1dengaroo/leafpad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 underline underline-offset-4"
              >
                <span className="bg-primary inline-block size-1.5 rounded-full" />
                Open source
              </a>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
