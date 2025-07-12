/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Handle system preference check
    const getSystemTheme = () => 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
    // Return priority: saved theme > system preference
    return ['dark', 'light'].includes(savedTheme) ? savedTheme : getSystemTheme();
  });
  
  const themeHandler = useCallback((newTheme) => {
    const resolvedTheme = newTheme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : newTheme;
  
    setTheme(resolvedTheme);
    localStorage.setItem('theme', newTheme); // Store the preference (even if 'system')
  }, []);
  
  useEffect(() => {
    // Safely apply theme class
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Optional: Store actual theme being used
    localStorage.setItem('theme', theme);
    console.log(theme, 'theme applied');
  }, [theme]);
  
  // Bonus: System preference change listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') === 'system') {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    themeHandler
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}