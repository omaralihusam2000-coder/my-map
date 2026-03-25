import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Theme } from '../types';

export function useDarkMode(): [Theme, () => void] {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t: Theme) => (t === 'light' ? 'dark' : 'light'));

  return [theme, toggleTheme];
}
