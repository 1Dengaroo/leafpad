import Link from 'next/link';
import Image from 'next/image';
import { ToolPage } from '@/components/tool-page';
import {
  PencilLineIcon,
  BracesIcon,
  GitCompareArrowsIcon,
  WrenchIcon,
  ArrowRightIcon
} from 'lucide-react';

const tools = [
  {
    href: '/markdown',
    icon: <PencilLineIcon className="size-5" />,
    name: 'Markdown',
    description: 'Editor with live preview, formatting toolbar, and export to .md or .html',
    tags: ['GFM', 'Live Preview', 'Export']
  },
  {
    href: '/json-formatter',
    icon: <BracesIcon className="size-5" />,
    name: 'JSON Formatter',
    description: 'Pretty-print, minify, and sort keys with configurable indentation',
    tags: ['Format', 'Minify', 'Sort Keys']
  },
  {
    href: '/diff-tool',
    icon: <GitCompareArrowsIcon className="size-5" />,
    name: 'Diff Tool',
    description: 'Compare JSON or text side-by-side with word-level change highlighting',
    tags: ['JSON', 'Text', 'Inline Diff']
  },
  {
    href: '/utilities',
    icon: <WrenchIcon className="size-5" />,
    name: 'Utilities',
    description: 'Generate UUIDs, NanoIDs, encode/decode Base64, and hash with SHA-256',
    tags: ['UUID', 'NanoID', 'Base64', 'Hash']
  }
];

export default function LandingPage() {
  return (
    <ToolPage>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="mb-10 text-center">
            <Image
              src="/logo.svg"
              alt="Leafpad"
              width={48}
              height={48}
              className="mx-auto mb-4 select-none"
            />
            <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Developer Tools</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Clean, fast, and free. No ads, no sign-ups.
            </p>
          </div>

          {/* Tool grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-card group flex flex-col rounded-xl border p-5 transition-all hover:border-transparent hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-primary">{tool.icon}</span>
                    <h2 className="text-sm font-semibold">{tool.name}</h2>
                  </div>
                  <ArrowRightIcon className="text-muted-foreground size-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <p className="text-muted-foreground mb-4 flex-1 text-xs leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom section */}
          <div className="text-muted-foreground mt-12 space-y-4 text-center text-xs">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
