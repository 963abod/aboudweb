import React, { useState, useEffect } from 'react';
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
      { threshold: [0.3, 0.55, 0.8], rootMargin: '-25% 0px -40% 0px' }
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
    <section id="approach" className="story-section">
      <div className="story-shell">
        <div className="story-intro">
          <div className="story-eyebrow">HOW WE WORK</div>
          <h2>{lang === 'ar' ? 'نبني التجربة، مو بس الموقع.' : 'We build the experience, not just the website.'}</h2>
          <p>{lang === 'ar' ? 'من أول فكرة إلى تجربة رقمية جاهزة للنمو.' : 'From the first idea to a digital experience built to grow.'}</p>
        </div>

        <div className="story-stage">
          <div className="story-stage-number" aria-hidden="true">{steps[activeStep][0]}</div>
          <div className="story-progress"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>

          <div className="story-steps">
            {steps.map(([number, title, desc], index) => (
              <article
                key={number}
                data-story-step={index}
                className={`story-step ${activeStep === index ? 'is-active' : ''}`}
              >
                <div className="story-step-meta">
                  <span>{number}</span>
                  <span>0{index + 1} / 03</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="story-step-line"><span /></div>
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
        <StorySection lang={lang} />
        <Portfolio lang={lang} customProjects={customProjects} />
        <Pricing lang={lang} settings={siteSettings} />
      </main>
      <Footer lang={lang} settings={siteSettings} />
    </div>
  );
}

export default App;
