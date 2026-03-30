import { markdownExamples } from '../markdown-examples';
import { jsonExamples } from '../json-examples';
import { diffPresets } from '../diff-presets';
import { themes, getThemeDefinition } from '../theme/theme-registry';

describe('markdown examples', () => {
  it('has at least one example', () => {
    expect(markdownExamples.length).toBeGreaterThan(0);
  });

  it('each example has id, name, and content', () => {
    for (const ex of markdownExamples) {
      expect(ex.id).toBeTruthy();
      expect(ex.name).toBeTruthy();
      expect(ex.content).toBeTruthy();
    }
  });

  it('has unique ids', () => {
    const ids = markdownExamples.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('json examples', () => {
  it('has at least one example', () => {
    expect(jsonExamples.length).toBeGreaterThan(0);
  });

  it('each example contains valid JSON', () => {
    for (const ex of jsonExamples) {
      expect(() => JSON.parse(ex.data)).not.toThrow();
    }
  });

  it('has unique ids', () => {
    const ids = jsonExamples.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('diff presets', () => {
  it('has at least one preset', () => {
    expect(diffPresets.length).toBeGreaterThan(0);
  });

  it('each preset has left and right content and a valid category', () => {
    for (const p of diffPresets) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.left).toBeTruthy();
      expect(p.right).toBeTruthy();
      expect(['json', 'text']).toContain(p.category);
    }
  });

  it('has presets for both json and text categories', () => {
    expect(diffPresets.some((p) => p.category === 'json')).toBe(true);
    expect(diffPresets.some((p) => p.category === 'text')).toBe(true);
  });

  it('left and right are different in each preset', () => {
    for (const p of diffPresets) {
      expect(p.left).not.toBe(p.right);
    }
  });
});

describe('theme registry', () => {
  it('has at least one theme', () => {
    expect(themes.length).toBeGreaterThan(0);
  });

  it('has both light and dark themes', () => {
    const hasLight = themes.some((t) => !t.isDark);
    const hasDark = themes.some((t) => t.isDark);
    expect(hasLight).toBe(true);
    expect(hasDark).toBe(true);
  });

  it('each theme has required preview colors', () => {
    for (const t of themes) {
      expect(t.previewColors.bg).toBeTruthy();
      expect(t.previewColors.primary).toBeTruthy();
      expect(t.previewColors.accent).toBeTruthy();
    }
  });

  it('has unique ids', () => {
    const ids = themes.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getThemeDefinition returns correct theme', () => {
    const theme = getThemeDefinition('light');
    expect(theme).toBeDefined();
    expect(theme?.name).toBe('Light');
  });

  it('getThemeDefinition returns undefined for unknown id', () => {
    expect(getThemeDefinition('nonexistent')).toBeUndefined();
  });
});
