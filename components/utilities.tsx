'use client';

import { useState, useCallback, useMemo } from 'react';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useEditorTheme } from '@/lib/theme/editor-theme-provider';
import {
  RefreshCwIcon,
  ClipboardCopyIcon,
  CheckIcon,
  ArrowRightLeftIcon,
  InfoIcon,
  FingerprintIcon,
  SparklesIcon,
  FileDigitIcon,
  ShieldCheckIcon,
  LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── ID Generators ──────────────────────────────────────────────

function generateUUID(): string {
  return crypto.randomUUID();
}

const NANOID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function generateNanoID(size = 21): string {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  let id = '';
  for (let i = 0; i < size; i++) {
    id += NANOID_ALPHABET[bytes[i] & 63];
  }
  return id;
}

function estimateCrackTime(length: number): string {
  const guessesPerSecond = 1e10;
  const totalCombinations = Math.pow(64, length);
  const seconds = totalCombinations / (2 * guessesPerSecond);

  if (!isFinite(seconds) || seconds > 1e30) return '∞ (heat death of universe)';
  if (seconds < 0.001) return '< 1 millisecond';
  if (seconds < 1) return `~${Math.round(seconds * 1000)} milliseconds`;
  if (seconds < 60) return `~${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `~${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `~${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 365) return `~${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365 * 1e3) return `~${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1e6) return `~${Math.round(seconds / (86400 * 365 * 1e3))}K years`;
  if (seconds < 86400 * 365 * 1e9) return `~${Math.round(seconds / (86400 * 365 * 1e6))}M years`;
  if (seconds < 86400 * 365 * 1e12) return `~${Math.round(seconds / (86400 * 365 * 1e9))}B years`;
  return `~${(seconds / (86400 * 365 * 1e12)).toExponential(1)} trillion years`;
}

// ── Hash Generator ─────────────────────────────────────────────

async function computeHash(algorithm: string, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Shared Components ──────────────────────────────────────────

function CopyButton({ value, compact }: { value: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="text-muted-foreground hover:text-foreground shrink-0 p-1 transition-colors disabled:opacity-30"
          >
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <ClipboardCopyIcon className="size-3.5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!value}
          className="text-muted-foreground hover:text-foreground shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-30"
        >
          {copied ? <CheckIcon className="size-4" /> : <ClipboardCopyIcon className="size-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{copied ? 'Copied!' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <InfoIcon className="size-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function Card({
  icon,
  title,
  info,
  children
}: {
  icon: React.ReactNode;
  title: string;
  info: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <InfoTooltip text={info} />
      </div>
      {children}
    </div>
  );
}

function ModeToggle({
  value,
  onChange
}: {
  value: 'encode' | 'decode';
  onChange: (v: 'encode' | 'decode') => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border">
      <button
        onClick={() => onChange('encode')}
        className={cn(
          'px-2.5 py-1 text-xs font-medium transition-colors',
          value === 'encode'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Encode
      </button>
      <button
        onClick={() => onChange('decode')}
        className={cn(
          'px-2.5 py-1 text-xs font-medium transition-colors',
          value === 'decode'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Decode
      </button>
    </div>
  );
}

// ── UUID Generator ─────────────────────────────────────────────

function UUIDGenerator() {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;
  const [value, setValue] = useState('');

  return (
    <Card
      icon={<FingerprintIcon className="size-4" />}
      title="UUID v4"
      info="Universally Unique Identifier v4. 128-bit random ID with 122 bits of entropy. Standard format: 8-4-4-4-12 hex characters. Collision probability is negligible (~1 in 2.7 quintillion)."
    >
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2"
        style={{ background: c.bg, borderColor: c.border }}
      >
        <span
          className={cn('flex-1 font-mono text-sm', !value && 'text-muted-foreground italic')}
          style={value ? { color: c.text } : undefined}
        >
          {value || 'Click generate...'}
        </span>
        <CopyButton value={value} />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setValue(generateUUID())}
              className="text-primary hover:text-primary/80 shrink-0 rounded-md p-1.5 transition-colors"
            >
              <RefreshCwIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Generate</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
}

// ── NanoID Generator ───────────────────────────────────────────

function NanoIDGenerator() {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;
  const [value, setValue] = useState('');
  const [length, setLength] = useState(21);

  const crackTime = estimateCrackTime(length);
  const entropy = length * 6;

  return (
    <Card
      icon={<SparklesIcon className="size-4" />}
      title="Nano ID"
      info="Compact URL-safe unique ID using a 64-character alphabet (A-Z, a-z, 0-9, -, _). Each character provides 6 bits of entropy. Default length of 21 gives 126 bits, comparable to UUID v4."
    >
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: c.bg, borderColor: c.border }}
        >
          <span
            className={cn('flex-1 font-mono text-sm', !value && 'text-muted-foreground italic')}
            style={value ? { color: c.text } : undefined}
          >
            {value || 'Click generate...'}
          </span>
          <CopyButton value={value} />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setValue(generateNanoID(length))}
                className="text-primary hover:text-primary/80 shrink-0 rounded-md p-1.5 transition-colors"
              >
                <RefreshCwIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Generate</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <label className="text-muted-foreground">Length</label>
            <input
              type="number"
              min={1}
              max={256}
              value={length}
              onChange={(e) => setLength(Math.max(1, Math.min(256, Number(e.target.value) || 21)))}
              className="w-14 rounded-md border px-2 py-1 text-center text-xs outline-none"
              style={{ background: c.bg, borderColor: c.border, color: c.text }}
            />
          </div>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">{entropy} bits</span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">{crackTime}</span>
          <InfoTooltip text="Time to brute-force at 10 billion guesses/second. Average case (half keyspace). Real-world attacks are much slower due to network latency and rate limiting." />
        </div>
      </div>
    </Card>
  );
}

// ── Base64 Encoder/Decoder ─────────────────────────────────────

function Base64Tool() {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (direction === 'encode') {
        const bytes = new TextEncoder().encode(input);
        let binary = '';
        for (const byte of bytes) {
          binary += String.fromCharCode(byte);
        }
        return btoa(binary);
      } else {
        const binary = atob(input.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
    } catch {
      return '⚠ Invalid input';
    }
  }, [input, direction]);

  const handleSwap = useCallback(() => {
    if (!output || output === '⚠ Invalid input') return;
    setDirection((d) => (d === 'encode' ? 'decode' : 'encode'));
    setInput(output);
  }, [output]);

  return (
    <Card
      icon={<FileDigitIcon className="size-4" />}
      title="Base64"
      info="Encode binary or text data into ASCII using Base64 (RFC 4648). Commonly used for data URIs, embedding images in CSS/HTML, and transmitting binary data over text-only channels."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ModeToggle value={direction} onChange={setDirection} />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!output || output === '⚠ Invalid input'}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors disabled:opacity-30"
              >
                <ArrowRightLeftIcon className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Swap input/output</TooltipContent>
          </Tooltip>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'
          }
          spellCheck={false}
          rows={2}
          className="w-full resize-none rounded-lg border p-3 font-mono text-sm leading-relaxed outline-none"
          style={{ background: c.bg, borderColor: c.border, color: c.text }}
        />
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5"
          style={{ background: c.bg, borderColor: c.border }}
        >
          <span
            className={cn(
              'flex-1 font-mono text-sm leading-relaxed break-all',
              !output && 'text-muted-foreground italic'
            )}
            style={output && !output.startsWith('⚠') ? { color: c.text } : undefined}
          >
            {output || 'Output...'}
          </span>
          {output && !output.startsWith('⚠') && <CopyButton value={output} compact />}
        </div>
      </div>
    </Card>
  );
}

// ── URL Encoder/Decoder ────────────────────────────────────────

function URLTool() {
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (direction === 'encode') {
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input.trim());
      }
    } catch {
      return '⚠ Invalid input';
    }
  }, [input, direction]);

  const handleSwap = useCallback(() => {
    if (!output || output === '⚠ Invalid input') return;
    setDirection((d) => (d === 'encode' ? 'decode' : 'encode'));
    setInput(output);
  }, [output]);

  return (
    <Card
      icon={<LinkIcon className="size-4" />}
      title="URL Encode/Decode"
      info="Encode special characters for use in URLs using percent-encoding (RFC 3986). Spaces become %20, ampersands become %26, etc. Essential for building query strings and handling user input in URLs."
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ModeToggle value={direction} onChange={setDirection} />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleSwap}
                disabled={!output || output === '⚠ Invalid input'}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors disabled:opacity-30"
              >
                <ArrowRightLeftIcon className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Swap input/output</TooltipContent>
          </Tooltip>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            direction === 'encode'
              ? 'Enter text or URL to encode...'
              : 'Enter URL-encoded string to decode...'
          }
          spellCheck={false}
          rows={2}
          className="w-full resize-none rounded-lg border p-3 font-mono text-sm leading-relaxed outline-none"
          style={{ background: c.bg, borderColor: c.border, color: c.text }}
        />
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5"
          style={{ background: c.bg, borderColor: c.border }}
        >
          <span
            className={cn(
              'flex-1 font-mono text-sm leading-relaxed break-all',
              !output && 'text-muted-foreground italic'
            )}
            style={output && !output.startsWith('⚠') ? { color: c.text } : undefined}
          >
            {output || 'Output...'}
          </span>
          {output && !output.startsWith('⚠') && <CopyButton value={output} compact />}
        </div>
      </div>
    </Card>
  );
}

// ── Hash Generator ─────────────────────────────────────────────

const HASH_ALGORITHMS = [
  { id: 'SHA-1', label: 'SHA-1', bits: 160 },
  { id: 'SHA-256', label: 'SHA-256', bits: 256 },
  { id: 'SHA-384', label: 'SHA-384', bits: 384 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512 }
] as const;

function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { editorTheme } = useEditorTheme();
  const c = editorTheme.colors;

  const handleInputChange = useCallback((text: string) => {
    setInput(text);
    if (!text) {
      setHashes({});
      return;
    }
    (async () => {
      const results: Record<string, string> = {};
      for (const algo of HASH_ALGORITHMS) {
        results[algo.id] = await computeHash(algo.id, text);
      }
      setHashes(results);
    })();
  }, []);

  return (
    <Card
      icon={<ShieldCheckIcon className="size-4" />}
      title="Hash Generator"
      info="Cryptographic hash functions produce a fixed-size digest from any input. SHA-256 is the most widely used. SHA-1 is deprecated for security but still used for checksums. Hashes are one-way: you cannot reverse them to get the original input."
    >
      <div className="space-y-3">
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to hash..."
          spellCheck={false}
          rows={3}
          className="w-full resize-none rounded-lg border p-3 font-mono text-sm leading-relaxed outline-none"
          style={{ background: c.bg, borderColor: c.border, color: c.text }}
        />
        {input && (
          <div className="space-y-2">
            {HASH_ALGORITHMS.map((algo) => (
              <div key={algo.id} className="bg-muted/30 rounded-lg border px-3 py-2.5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">
                    {algo.label} <span className="text-muted-foreground/60">({algo.bits}-bit)</span>
                  </span>
                  <CopyButton value={hashes[algo.id] ?? ''} compact />
                </div>
                <div
                  className="font-mono text-xs leading-relaxed break-all"
                  style={{ color: c.text }}
                >
                  {hashes[algo.id] || '...'}
                </div>
              </div>
            ))}
          </div>
        )}
        {!input && (
          <div className="text-muted-foreground py-4 text-center text-sm italic">
            Start typing to see hashes update live
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function Utilities() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <UUIDGenerator />
          <NanoIDGenerator />
        </div>
        <HashGenerator />
        <div className="grid gap-4 sm:grid-cols-2">
          <Base64Tool />
          <URLTool />
        </div>
      </div>
    </div>
  );
}
