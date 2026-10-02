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

        if (!projectsErr) {
          setCustomProjects(projectsData || []);
        }
      } catch (e) {
        console.log('Supabase fetch notice:', e);
        setSiteSettings(DEFAULT_SETTINGS);
        setCustomProjects([]);
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
        <section id="approach" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-16 items-end">
            <div>
              <span className="text-[10px] tracking-[.24em] text-zinc-500 uppercase">
                {lang === 'ar' ? 'HOW WE WORK' : 'HOW WE WORK'}
              </span>
              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {lang === 'ar' ? 'من الفكرة إلى تجربة رقمية متكاملة.' : 'From idea to a complete digital experience.'}
              </h2>
            </div>
            <p className="max-w-xl lg:ml-auto text-zinc-500 dark:text-zinc-400 leading-8">
              {lang === 'ar'
                ? 'كل مشروع يبدأ بفهم النشاط والهدف، ثم يتحول إلى تصميم واضح، تجربة سريعة، وتنفيذ قابل للتوسع.'
                : 'Every project starts with the business and its goal, then becomes a clear design, fast experience, and scalable implementation.'}
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-px bg-zinc-200/70 dark:bg-zinc-800/70">
            {(lang === 'ar'
              ? [
                  ['01', 'اكتشاف', 'نفهم النشاط، الجمهور، وما الذي يجب أن يحققه الموقع.'],
                  ['02', 'تصميم وبناء', 'نحوّل الفكرة إلى واجهة دقيقة وسريعة ومصممة حول المستخدم.'],
                  ['03', 'إطلاق وتطوير', 'نطلق المشروع بشكل احترافي ونبقيه جاهزاً للتوسع والتحسين.']
                ]
              : [
                  ['01', 'Discover', 'Understand the business, audience, and what the site needs to achieve.'],
                  ['02', 'Design & Build', 'Turn the idea into a precise, fast interface built around the user.'],
                  ['03', 'Launch & Evolve', 'Launch professionally and keep the product ready to grow.']
                ]
            ).map(([number, title, desc]) => (
              <article key={number} className="group bg-zinc-50 dark:bg-[#09090b] p-8 md:p-10 min-h-[230px] transition-colors duration-500 hover:bg-white dark:hover:bg-zinc-900/70">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">{number}</span>
                <h3 className="mt-14 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-500 dark:text-zinc-400 max-w-sm">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
        <Portfolio lang={lang} customProjects={customProjects} />
        <Pricing lang={lang} settings={siteSettings} />
      </main>
      <Footer lang={lang} settings={siteSettings} />
    </div>
  );
}

export default App;
