import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './colors';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  currentMode: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () => {},
  setMode: () => {},
  currentMode: 'dark',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('dark');

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setMode, currentMode: mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
