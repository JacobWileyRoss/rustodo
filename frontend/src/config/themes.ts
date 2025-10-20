export interface Theme {
  id: string;
  name: string;
  description: string;
  cssFile: string;
}

export const themes: Theme[] = [
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Vibrant dark theme with bold colors',
    cssFile: '/styles/Dracula.css',
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    description: 'Retro groove with warm, earthy tones',
    cssFile: '/styles/GruvboxDark.css',
  },
  {
    id: 'malifex',
    name: 'Malifex',
    description: 'Custom dark theme with red accents',
    cssFile: '/styles/Malifex.css',
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Material Design inspired dark theme',
    cssFile: '/styles/ModernDark.css',
  },
  {
    id: 'modern-light',
    name: 'Modern Light',
    description: 'Material Design inspired light theme',
    cssFile: '/styles/ModernLight.css',
  },
  {
    id: 'rose-pine-dark',
    name: 'Rosé Pine Dark',
    description: 'Natural & elegant with soft pastels',
    cssFile: '/styles/RosePineDark.css',
  },
  {
    id: 'scary-monsters',
    name: 'Scary Monsters',
    description: 'Electric neon vibes - Skrillex inspired',
    cssFile: '/styles/ScaryMonsters.css',
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Precision colors for readability',
    cssFile: '/styles/SolarizedDark.css',
  },
];

export const DEFAULT_THEME = 'modern-dark';
