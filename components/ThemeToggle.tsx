'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-slate-600" />
      )}
    </button>
  );
}