import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CostEstimator } from './components/CostEstimator';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { supabase } from './supabase';

function App() {
  const [lang, setLang] = useState('ar');
  const [theme, setTheme] = useState('dark');
  const [availabilityText, setAvailabilityText] = useState(null);
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
    // Fetch dynamic data from Supabase with fallback defaults
    async function loadData() {
      try {
        // Fetch availability setting
        const { data: settingsData, error: settingsErr } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'availability')
          .maybeSingle();

        if (settingsData && !settingsErr) {
          setAvailabilityText({
            ar: settingsData.value_ar,
            en: settingsData.value_en
          });
        }

        // Fetch projects
        const { data: projectsData, error: projectsErr } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: true });

        if (projectsData && projectsData.length > 0 && !projectsErr) {
          setCustomProjects(projectsData);
        }
      } catch (e) {
        console.log('Supabase fetch notice:', e);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <main>
        <Hero lang={lang} availabilityText={availabilityText} />
        <CostEstimator lang={lang} />
        <Portfolio lang={lang} customProjects={customProjects} />
        <Pricing lang={lang} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
