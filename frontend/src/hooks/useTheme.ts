import { useState, useEffect } from 'react';
import { themes, DEFAULT_THEME, type Theme } from '../config/themes';

const THEME_STORAGE_KEY = 'rustodo-theme';

interface UseThemeReturn {
  currentTheme: string;
  changeTheme: (themeId: string) => void;
  getCurrentThemeInfo: () => Theme | undefined;
  availableThemes: Theme[];
}

export const useTheme = (): UseThemeReturn => {
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
  });

  useEffect(() => {
    const existingLink = document.getElementById('theme-stylesheet');
    if (existingLink) {
      existingLink.remove();
    }

    const theme = themes.find((t) => t.id === currentTheme);
    if (!theme) return;

    const link = document.createElement('link');
    link.id = 'theme-stylesheet';
    link.rel = 'stylesheet';
    link.href = theme.cssFile;
    document.head.appendChild(link);

    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentTheme(themeId);
    }
  };

  const getCurrentThemeInfo = (): Theme | undefined => {
    return themes.find((t) => t.id === currentTheme);
  };

  return {
    currentTheme,
    changeTheme,
    getCurrentThemeInfo,
    availableThemes: themes,
  };
};
