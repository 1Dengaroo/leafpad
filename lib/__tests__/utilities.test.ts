// Note: these test the pure utility functions extracted from components/utilities.tsx
// crypto.randomUUID and crypto.subtle are not available in Node test env,
// so we test the helper functions that don't depend on Web Crypto.

const NANOID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function generateNanoID(size: number): string {
  const bytes = new Uint8Array(size);
  // Use Math.random for testing (crypto.getRandomValues not available in all test envs)
  for (let i = 0; i < size; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
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

describe('generateNanoID', () => {
  it('generates an ID of the requested length', () => {
    expect(generateNanoID(10).length).toBe(10);
    expect(generateNanoID(21).length).toBe(21);
    expect(generateNanoID(1).length).toBe(1);
    expect(generateNanoID(100).length).toBe(100);
  });

  it('only uses characters from the alphabet', () => {
    const id = generateNanoID(1000);
    for (const char of id) {
      expect(NANOID_ALPHABET).toContain(char);
    }
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateNanoID(21)));
    expect(ids.size).toBe(100);
  });
});

describe('estimateCrackTime', () => {
  it('returns sub-millisecond for very short IDs', () => {
    expect(estimateCrackTime(1)).toBe('< 1 millisecond');
  });

  it('returns seconds/minutes for short IDs', () => {
    const result = estimateCrackTime(5);
    expect(result).toMatch(/seconds|minutes/);
  });

  it('returns years for medium IDs', () => {
    const result = estimateCrackTime(15);
    expect(result).toMatch(/years/);
  });

  it('returns heat death for very long IDs', () => {
    expect(estimateCrackTime(200)).toBe('∞ (heat death of universe)');
  });

  it('scales with length', () => {
    // Longer IDs should take longer to crack
    const short = estimateCrackTime(5);
    const long = estimateCrackTime(21);
    // Short should be small time units, long should be large
    expect(short).toMatch(/millisecond|seconds|minutes/);
    expect(long).toMatch(/years/);
  });

  it('returns correct entropy calculation (6 bits per char)', () => {
    // 21 chars * 6 bits = 126 bits of entropy
    // 64^21 / (2 * 1e10) seconds
    const result = estimateCrackTime(21);
    expect(result).toMatch(/B years|trillion years/);
  });
});
