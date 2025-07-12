/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  // Get saved theme from localStorage
  const [themeLabel, setThemeLabel] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'system' || savedTheme === null) {
      return systemIsDark ? 'system-dark' : 'system-light';
    }
    return savedTheme;
  });
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return systemIsDark ? 'dark' : 'light';
  });
  
  const themeHandler = useCallback((newTheme) => {
    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = newTheme === 'system' ? (systemIsDark ? 'dark' : 'light') : newTheme;
    const resolvedThemeLabel = newTheme === 'system' ? (systemIsDark ? 'system-dark' : 'system-light') : newTheme;
    
    setTheme(resolvedTheme);
    setThemeLabel(resolvedThemeLabel);
    localStorage.setItem('theme', newTheme); // Store user preference
    localStorage.setItem('activeTheme', resolvedTheme); // Store computed theme
  }, []);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemChange = (e) => {
      const userPrefersSystem = localStorage.getItem('theme') === 'system';
      if (userPrefersSystem) {
        const newTheme = e.matches ? 'dark' : 'light';
        const newLabel = e.matches ? 'system-dark' : 'system-light';
        setTheme(newTheme);
        setThemeLabel(newLabel);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('activeTheme', newTheme);
      }
    };
  
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);
  
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  
  

  const contextValue = useMemo(() => ({
    theme,
    themeLabel,
    themeHandler
  }), [theme, themeLabel]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}