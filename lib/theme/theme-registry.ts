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
    id: 'meadow',
    name: 'Meadow',
    description: 'Fresh spring green, warm and clear',
    isDark: false,
    previewColors: {
      bg: 'hsl(48 28% 96%)',
      primary: 'hsl(158 42% 37%)',
      accent: 'hsl(80 12% 93%)'
    }
  },
  {
    id: 'canopy',
    name: 'Canopy',
    description: 'Deep forest dark, rich and quiet',
    isDark: true,
    previewColors: {
      bg: 'hsl(155 22% 7%)',
      primary: 'hsl(158 48% 50%)',
      accent: 'hsl(155 14% 14%)'
    }
  },
  {
    id: 'grove',
    name: 'Grove',
    description: 'Sage on cool gray, calm and minimal',
    isDark: false,
    previewColors: {
      bg: 'hsl(200 10% 97%)',
      primary: 'hsl(162 30% 40%)',
      accent: 'hsl(180 8% 93%)'
    }
  },
  {
    id: 'moss',
    name: 'Moss',
    description: 'Warm dark earth, soft and organic',
    isDark: true,
    previewColors: {
      bg: 'hsl(50 16% 8%)',
      primary: 'hsl(128 38% 48%)',
      accent: 'hsl(50 10% 14%)'
    }
  },
  {
    id: 'fern',
    name: 'Fern',
    description: 'Bright emerald, bold and modern',
    isDark: false,
    previewColors: {
      bg: 'hsl(0 0% 99%)',
      primary: 'hsl(152 50% 34%)',
      accent: 'hsl(150 10% 94%)'
    }
  },
  {
    id: 'thicket',
    name: 'Thicket',
    description: 'Deep teal on charcoal, sharp and focused',
    isDark: true,
    previewColors: {
      bg: 'hsl(195 20% 7%)',
      primary: 'hsl(180 50% 45%)',
      accent: 'hsl(195 12% 14%)'
    }
  }
];

export const themeIds = themes.map((t) => t.id);
export const darkThemeIds = themes.filter((t) => t.isDark).map((t) => t.id);

export function getThemeDefinition(id: string): ThemeDefinition | undefined {
  return themes.find((t) => t.id === id);
}
