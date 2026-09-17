import React from 'react';
import { Logo } from './Logo';
import { Moon, Sun, Globe } from 'lucide-react';

export function Navbar({ lang, setLang, theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="fixed top-4 inset-x-0 max-w-4xl mx-auto z-50 rounded-full px-6 py-3 border border-zinc-200 dark:border-zinc-800/60 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2.5">
        <Logo />
        <span className="font-english font-semibold tracking-wide text-zinc-900 dark:text-zinc-50">ABOUD WEB</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
        >
          <Globe className="w-4 h-4" />
          <span className="font-english">{lang === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </nav>
  );
}
