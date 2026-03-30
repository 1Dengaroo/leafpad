export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  previewColors: {
    bg: string;
    primary: string;
    accent: string;
  };
}

export const themes: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Fresh spring green, soft and airy',
    isDark: false,
    previewColors: {
      bg: 'hsl(48 28% 96%)',
      primary: 'hsl(158 42% 37%)',
      accent: 'hsl(80 12% 93%)'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Deep forest dark, rich and quiet',
    isDark: true,
    previewColors: {
      bg: 'hsl(155 22% 7%)',
      primary: 'hsl(158 48% 50%)',
      accent: 'hsl(155 14% 14%)'
    }
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Blurple on dark gray, bold and playful',
    isDark: true,
    previewColors: {
      bg: 'hsl(228 7% 14%)',
      primary: 'hsl(235 86% 65%)',
      accent: 'hsl(228 6% 20%)'
    }
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Warm sand and terracotta, thoughtful',
    isDark: false,
    previewColors: {
      bg: 'hsl(40 33% 97%)',
      primary: 'hsl(24 70% 50%)',
      accent: 'hsl(36 14% 93%)'
    }
  },
  {
    id: 'spotify',
    name: 'Spotify',
    description: 'Vibrant green on jet black, bold',
    isDark: true,
    previewColors: {
      bg: 'hsl(0 0% 7%)',
      primary: 'hsl(141 73% 42%)',
      accent: 'hsl(0 0% 14%)'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: 'Warm muted dark with soft pink and green',
    isDark: true,
    previewColors: {
      bg: 'hsl(330 5% 11%)',
      primary: 'hsl(349 60% 64%)',
      accent: 'hsl(330 4% 15%)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
