import React from 'react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#09090b] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-english font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">ABOUD WEB</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            © 2026 ABOUD WEB. All rights reserved
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">All systems operational</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a href="https://wa.me/963951708141" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">WhatsApp</a>
            <a href="https://t.me/aboudweb" target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Telegram</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">X</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
