import Link from 'next/link';
import Image from 'next/image';
import { ToolPage } from '@/components/tool-page';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  PencilLineIcon,
  BracesIcon,
  GitCompareArrowsIcon,
  WrenchIcon,
  StickyNoteIcon,
  ArrowRightIcon
} from 'lucide-react';

function BentoCard({
  href,
  gridArea,
  icon,
  title,
  description,
  tags,
  delay,
  children
}: {
  href: string;
  gridArea: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${gridArea} bento-card landing-animate ${delay} group`}>
      <Card className="flex h-full flex-col p-5 sm:p-6">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-0 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="landing-icon-circle text-primary">{icon}</span>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </CardHeader>
        <CardDescription className="mb-4 text-xs leading-relaxed">{description}</CardDescription>
        <CardContent className="mt-auto flex-1 p-0">{children}</CardContent>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}

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
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                  }}
                >
                  Leafpad
                </h1>
              </div>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed sm:text-base">
                Developer tools that stay out of your way. Clean, fast, and entirely free.
              </p>
            </div>

            {/* ── Markdown (featured, 2 cols) ── */}
            <BentoCard
              href="/markdown"
              gridArea="bento-md"
              icon={<PencilLineIcon className="size-4" />}
              title="Markdown"
              description="Editor with live preview, formatting toolbar, and export to .md or .html"
              tags={['GFM', 'Live Preview', 'Export']}
              delay="landing-delay-3"
            >
              <div className="preview-block flex-1">
                <div className="mb-1 text-sm font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                  # Getting Started
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Write in{' '}
                  <span className="font-bold" style={{ color: 'hsl(var(--foreground))' }}>
                    **markdown**
                  </span>{' '}
                  with live preview.
                </div>
                <div className="mt-1.5 text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> GFM support
                  <br />
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> Syntax highlighting
                  <br />
                  <span style={{ color: 'hsl(var(--primary))' }}>-</span> Export to HTML
                </div>
              </div>
            </BentoCard>

            {/* ── JSON Formatter ── */}
            <BentoCard
              href="/json-formatter"
              gridArea="bento-json"
              icon={<BracesIcon className="size-4" />}
              title="JSON Formatter"
              description="Pretty-print, minify, and sort keys with configurable indentation"
              tags={['Format', 'Minify', 'Sort Keys']}
              delay="landing-delay-4"
            >
              <div className="preview-block flex-1">
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
            </BentoCard>

            {/* ── Diff Tool ── */}
            <BentoCard
              href="/diff-tool"
              gridArea="bento-diff"
              icon={<GitCompareArrowsIcon className="size-4" />}
              title="Diff Tool"
              description="Compare JSON or text side-by-side with word-level change highlighting"
              tags={['JSON', 'Text', 'Inline Diff']}
              delay="landing-delay-5"
            >
              <div className="preview-block flex-1 space-y-0.5">
                <div className="diff-remove rounded px-1.5 py-0.5">
                  - &quot;status&quot;: &quot;draft&quot;
                </div>
                <div className="diff-add rounded px-1.5 py-0.5">
                  + &quot;status&quot;: &quot;published&quot;
                </div>
                <div className="text-muted-foreground px-1.5 py-0.5">
                  {'  '}&quot;version&quot;: 1
                </div>
                <div className="diff-add rounded px-1.5 py-0.5">+ &quot;version&quot;: 2</div>
              </div>
            </BentoCard>

            {/* ── Utilities ── */}
            <BentoCard
              href="/utilities"
              gridArea="bento-utils"
              icon={<WrenchIcon className="size-4" />}
              title="Utilities"
              description="Generate UUIDs, NanoIDs, encode/decode Base64, and hash with SHA-256"
              tags={['UUID', 'NanoID', 'Base64', 'Hash']}
              delay="landing-delay-6"
            >
              <div className="preview-block flex-1 space-y-1.5">
                <div>
                  <span className="text-muted-foreground text-[9px] tracking-widest uppercase">
                    UUID
                  </span>
                  <div className="text-primary mt-0.5">f47ac10b-58cc-4372-a567-0e02b2c3d479</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[9px] tracking-widest uppercase">
                    NanoID
                  </span>
                  <div className="text-primary mt-0.5">V1StGXR8_Z5jdHi6B-myT</div>
                </div>
              </div>
            </BentoCard>

            {/* ── Notepad ── */}
            <BentoCard
              href="/notepad"
              gridArea="bento-notepad"
              icon={<StickyNoteIcon className="size-4" />}
              title="Notepad"
              description="Quick sticky notes saved locally in your browser. Jot, revisit, delete."
              tags={['Notes', 'Snippets', 'Local Storage']}
              delay="landing-delay-7"
            >
              <div className="preview-block flex-1 space-y-1">
                <div className="text-xs font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                  Meeting notes
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Fix auth middleware bug
                </div>
              </div>
            </BentoCard>
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
