export interface EditorTheme {
  id: string;
  name: string;
  colors: {
    bg: string;
    text: string;
    gutterBg: string;
    gutterText: string;
    border: string;
    placeholder: string;
    readOnlyBg: string;
    syntax: {
      key: string;
      string: string;
      number: string;
      boolean: string;
      null: string;
      punctuation: string;
    };
  };
}

export const editorThemes: EditorTheme[] = [
  {
    id: 'auto',
    name: 'Theme Default',
    colors: {
      bg: 'hsl(var(--card))',
      text: 'hsl(var(--foreground))',
      gutterBg: 'hsl(var(--muted) / 0.5)',
      gutterText: 'hsl(var(--muted-foreground))',
      border: 'hsl(var(--border))',
      placeholder: 'hsl(var(--muted-foreground) / 0.5)',
      readOnlyBg: 'hsl(var(--muted) / 0.3)',
      syntax: {
        key: '#e05260',
        string: '#16a34a',
        number: '#c45e00',
        boolean: '#0284c7',
        null: '#9333ea',
        punctuation: 'hsl(var(--foreground))'
      }
    }
  },
  {
    id: 'paper',
    name: 'Paper',
    colors: {
      bg: '#ffffff',
      text: '#1a1a1a',
      gutterBg: '#f7f7f7',
      gutterText: '#a0a0a0',
      border: '#e5e5e5',
      placeholder: '#b0b0b0',
      readOnlyBg: '#fafafa',
      syntax: {
        key: '#b5002a',
        string: '#186a2e',
        number: '#1a00b8',
        boolean: '#0a3d8f',
        null: '#6a1b8a',
        punctuation: '#333333'
      }
    }
  },
  {
    id: 'slate',
    name: 'Slate',
    colors: {
      bg: '#2d3748',
      text: '#e2e8f0',
      gutterBg: '#252f3f',
      gutterText: '#718096',
      border: '#4a5568',
      placeholder: '#718096',
      readOnlyBg: '#2a3444',
      syntax: {
        key: '#ff7b85',
        string: '#b5e890',
        number: '#ffcb6b',
        boolean: '#89ddff',
        null: '#d8a0f0',
        punctuation: '#a0b4c8'
      }
    }
  },
  {
    id: 'ink',
    name: 'Ink',
    colors: {
      bg: '#0d0d0d',
      text: '#e8e8e8',
      gutterBg: '#080808',
      gutterText: '#4a4a4a',
      border: '#1f1f1f',
      placeholder: '#4a4a4a',
      readOnlyBg: '#0a0a0a',
      syntax: {
        key: '#ff8a8a',
        string: '#8aeea0',
        number: '#ffe066',
        boolean: '#99d5ff',
        null: '#e8a0ff',
        punctuation: '#888888'
      }
    }
  },
  {
    id: 'sepia',
    name: 'Sepia',
    colors: {
      bg: '#f5f0e8',
      text: '#433422',
      gutterBg: '#ede7dd',
      gutterText: '#a09080',
      border: '#d9d0c3',
      placeholder: '#a09080',
      readOnlyBg: '#f0ebe2',
      syntax: {
        key: '#8b3a1a',
        string: '#3d6b1e',
        number: '#a85c00',
        boolean: '#1a5c8a',
        null: '#6a2e6a',
        punctuation: '#4a3d30'
      }
    }
  }
];
