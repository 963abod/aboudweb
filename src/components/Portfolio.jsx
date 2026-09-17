import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function Portfolio({ lang, customProjects }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const content = {
    ar: {
      title: 'معرض الأعمال',
      subtitle: 'مشاريع متميزة تعكس دقة التصميم وقوة الأداء',
      filters: {
        all: 'الكل',
        ecommerce: 'متاجر إلكترونية',
        corporate: 'شركات ومؤسسات',
        landing: 'صفحات هبوط'
      },
      cases: [
        {
          id: 1,
          title: 'Aura Parfums',
          desc: 'تجربة تسوق فاخرة لعلامة عطور خليجية مع متجر إلكتروني متكامل.',
          category: 'ecommerce',
          color: 'from-amber-500/20 to-zinc-900/50'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'واجهة مستخدم متطورة لمنصة تحليلات بيانات عالية الأداء SaaS.',
          category: 'corporate',
          color: 'from-blue-500/20 to-zinc-900/50'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'معرض أعمال بتصميم معماري مبسط واستوديو إبداعي.',
          category: 'landing',
          color: 'from-rose-500/20 to-zinc-900/50'
        }
      ]
    },
    en: {
      title: 'Portfolio',
      subtitle: 'Featured case studies combining premium design with robust engineering',
      filters: {
        all: 'All',
        ecommerce: 'E-Commerce',
        corporate: 'Corporate',
        landing: 'Landing Pages'
      },
      cases: [
        {
          id: 1,
          title: 'Aura Parfums',
          desc: 'Luxury Gulf fragrance brand e-commerce experience.',
          category: 'ecommerce',
          color: 'from-amber-500/20 to-zinc-900/50'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'High-scale analytics platform & SaaS UI.',
          category: 'corporate',
          color: 'from-blue-500/20 to-zinc-900/50'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'Minimalist architectural design portfolio.',
          category: 'landing',
          color: 'from-rose-500/20 to-zinc-900/50'
        }
      ]
    }
  };

  const text = content[lang];

  // If custom projects exist from Supabase, map them to current language view format
  const casesToDisplay = (customProjects && customProjects.length > 0)
    ? customProjects.map(p => ({
        id: p.id,
        title: lang === 'ar' ? (p.title_ar || p.title) : (p.title_en || p.title),
        desc: lang === 'ar' ? (p.desc_ar || p.desc_en) : (p.desc_en || p.desc_ar),
        category: p.category || 'ecommerce',
        liveUrl: p.live_url || p.url || '',
        imageUrl: p.image_url || p.cover_image || '',
        color: p.color || 'from-amber-500/20 to-zinc-900/50'
      }))
    : text.cases;

  const filteredCases = activeFilter === 'all'
    ? casesToDisplay
    : casesToDisplay.filter(c => c.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{text.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(text.filters).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={twMerge(
                "px-5 py-2 rounded-full text-sm font-medium transition-colors",
                activeFilter === key
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(item => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 min-h-[320px] flex flex-col justify-end p-8"
            >
              {/* Cover Image or Abstract Gradient */}
              {item.imageUrl ? (
                <div className="absolute inset-0 z-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent"></div>
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
              )}

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-medium mb-4 backdrop-blur-sm">
                  {text.filters[item.category] || item.category}
                </span>
                <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                  {item.desc}
                </p>

                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium mt-1"
                  >
                    {lang === 'ar' ? 'معاينة الموقع ↗' : 'Visit Live Site ↗'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
