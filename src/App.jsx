        <StorySection lang={lang} />import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS, mergeSettings } from './defaultSettings';


function StorySection({ lang }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const nodes = [...document.querySelectorAll('[data-story-step]')];
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStep(Number(visible.target.dataset.storyStep));
      },
      { threshold: [0.35, 0.6, 0.85], rootMargin: '-20% 0px -35% 0px' }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const steps = lang === 'ar'
    ? [
        ['01', 'اكتشاف', 'نفهم نشاطك، جمهورك، والفرصة التي يجب أن يصنعها الموقع.'],
        ['02', 'تصميم وبناء', 'نحوّل الفكرة إلى تجربة بصرية دقيقة، سريعة، ومصممة حول المستخدم.'],
        ['03', 'إطلاق وتطوير', 'نطلق المشروع بثقة، ثم نطوره مع نمو النشاط واحتياجاته.']
      ]
    : [
        ['01', 'Discover', 'Understand your business, audience, and the opportunity the site should create.'],
        ['02', 'Design & Build', 'Turn the idea into a precise, fast experience designed around the user.'],
        ['03', 'Launch & Evolve', 'Launch with confidence, then evolve it as the business grows.']
      ];

  return (
    <section id="approach" className="relative px-4 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-180px)] flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[.24em] text-zinc-500 uppercase">HOW WE WORK</span>
              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {lang === 'ar' ? 'نبني التجربة، مو بس الموقع.' : 'We build the experience, not just the website.'}
              </h2>
            </div>
            <div className="relative mt-12 hidden lg:block overflow-hidden">
              <div className="text-[clamp(9rem,18vw,15rem)] leading-none font-semibold tracking-[-.08em] text-zinc-200 dark:text-zinc-800 transition-all duration-700">
                {steps[activeStep][0]}
              </div>
              <div className="absolute bottom-5 start-2 h-px w-32 bg-zinc-300 dark:bg-zinc-700">
                <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-700" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="relative">
            {steps.map(([number, title, desc], index) => (
              <article
                key={number}
                data-story-step={index}
                className="min-h-[72vh] flex items-center py-16 md:py-24"
              >
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-7">
                  <div className="flex items-start justify-between gap-8">
                    <span className="font-mono text-xs text-zinc-400">{number}</span>
                    <span className="text-xs text-zinc-400">{`0${index + 1} / 03`}</span>
                  </div>
                  <h3 className="mt-20 text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {title}
                  </h3>
                  <p className="mt-7 max-w-xl text-lg md:text-xl leading-9 text-zinc-500 dark:text-zinc-400">
                    {desc}
                  </p>
                  <div className="mt-14 h-px w-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-700" style={{ width: activeStep === index ? '100%' : '0%' }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

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
