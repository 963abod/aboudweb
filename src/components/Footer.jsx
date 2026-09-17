import React from 'react';
import { Logo } from './Logo';
import { DEFAULT_SETTINGS } from '../defaultSettings';

export function Footer({ lang = 'ar', settings }) {
  const activeSettings = settings || DEFAULT_SETTINGS;
  const contacts = activeSettings.contacts || DEFAULT_SETTINGS.contacts;

  const whatsappNumber = contacts.whatsapp || '963951708141';
  const telegramUsername = contacts.telegram || 'aboudweb';
  const instagramUrl = contacts.instagram || 'https://instagram.com/aboudweb';
  const xUrl = contacts.x || 'https://x.com/aboudweb';

  const cleanTelegram = telegramUsername.replace('@', '');
  const finalInstagramUrl = instagramUrl.startsWith('http') ? instagramUrl : `https://${instagramUrl}`;
  const finalXUrl = xUrl.startsWith('http') ? xUrl : `https://${xUrl}`;

  const copyrightText = lang === 'ar'
    ? (contacts.copyright_ar || DEFAULT_SETTINGS.contacts.copyright_ar)
    : (contacts.copyright_en || DEFAULT_SETTINGS.contacts.copyright_en);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#09090b] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="font-english font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">ABOUD WEB</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {copyrightText}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {lang === 'ar' ? 'جميع الأنظمة تعمل بكفاءة' : 'All systems operational'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">WhatsApp</a>
            <a href={`https://t.me/${cleanTelegram}`} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Telegram</a>
            <a href={finalInstagramUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">Instagram</a>
            <a href={finalXUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">X</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
