import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CostEstimator } from './components/CostEstimator';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS, mergeSettings } from './defaultSettings';

function App() {
  const [lang, setLang] = useState('ar');
  const [theme, setTheme] = useState('dark');
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);
  const [customProjects, setCustomProjects] = useState(null);

  useEffect(() => {
    // Check local storage for language preference, otherwise default to Arabic
    const savedLang = localStorage.getItem('site_lang');
    if (savedLang === 'en') {
      setLang('en');
    } else {
      setLang('ar');
    }

    // Theme check
    const savedTheme = localStorage.getItem('site_theme');
    if (savedTheme === 'light') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Fetch dynamic data from Supabase
    async function loadData() {
      try {
        // Fetch unified settings from 'settings' table where id = 1
        const { data: settingsData, error: settingsErr } = await supabase
          .from('settings')
          .select('data')
          .eq('id', 1);

        if (settingsData && settingsData.length > 0 && settingsData[0].data && !settingsErr) {
          setSiteSettings(mergeSettings(settingsData[0].data));
        } else {
          setSiteSettings(DEFAULT_SETTINGS);
        }

        // Fetch projects from 'projects' table
        const { data: projectsData, error: projectsErr } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (projectsData && projectsData.length > 0 && !projectsErr) {
          setCustomProjects(projectsData);
        }
      } catch (e) {
        console.log('Supabase fetch notice:', e);
        setSiteSettings(DEFAULT_SETTINGS);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    // Apply lang and dir
    const htmlEl = document.documentElement;
    htmlEl.lang = lang;
    htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';
    htmlEl.className = lang;

    // Theme class
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }

    // Set global font based on language
    if (lang === 'en') {
      document.body.classList.add('font-english');
      document.body.classList.remove('font-arabic');
    } else {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-english');
    }

    localStorage.setItem('site_lang', lang);
    localStorage.setItem('site_theme', theme);
  }, [lang, theme]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-arabic">
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main>
        <Hero lang={lang} settings={siteSettings} />
        <CostEstimator lang={lang} settings={siteSettings} />
        <Portfolio lang={lang} customProjects={customProjects} />
        <Pricing lang={lang} settings={siteSettings} />
      </main>
      <Footer lang={lang} settings={siteSettings} />
    </div>
  );
}

export default App;
