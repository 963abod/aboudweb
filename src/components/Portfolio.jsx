import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight } from 'lucide-react';

export function Portfolio({ lang, customProjects }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const content = {
    ar: {
      title: 'معرض الأعمال',
      subtitle: 'مشاريع متميزة تجمع بين التصميم المبتكر والهندسة البرمجية الدقيقة',
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
          desc: 'تجربة تسوق فاخرة لعلامة عطور خليجية مع متجر إلكتروني متكامل وسريع.',
          category: 'ecommerce',
          color: 'from-amber-500/20 via-neutral-900 to-neutral-950'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'واجهة مستخدم متطورة لمنصة تحليلات بيانات عالية الأداء SaaS.',
          category: 'corporate',
          color: 'from-blue-500/20 via-neutral-900 to-neutral-950'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'معرض أعمال بتصميم معماري مبسط واستوديو إبداعي عالي الجودة.',
          category: 'landing',
          color: 'from-rose-500/20 via-neutral-900 to-neutral-950'
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
          color: 'from-amber-500/20 via-neutral-900 to-neutral-950'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'High-scale analytics platform & SaaS UI.',
          category: 'corporate',
          color: 'from-blue-500/20 via-neutral-900 to-neutral-950'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'Minimalist architectural design portfolio.',
          category: 'landing',
          color: 'from-rose-500/20 via-neutral-900 to-neutral-950'
        }
      ]
    }
  };

  const text = content[lang] || content.ar;

  // Map custom projects from Supabase if available
  const casesToDisplay = (customProjects && customProjects.length > 0)
    ? customProjects.map(p => ({
        id: p.id,
        title: lang === 'ar' ? (p.title_ar || p.title) : (p.title_en || p.title),
        desc: lang === 'ar' ? (p.desc_ar || p.desc_en) : (p.desc_en || p.desc_ar),
        category: p.category || 'ecommerce',
        liveUrl: p.live_url || p.url || '',
        imageUrl: p.image_url || p.cover_image || '',
        color: p.color || 'from-amber-500/20 via-neutral-900 to-neutral-950'
      }))
    : text.cases;

  const filteredCases = activeFilter === 'all'
    ? casesToDisplay
    : casesToDisplay.filter(c => c.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          {text.title}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {text.subtitle}
        </p>
      </div>

      {/* Filtering Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
        {Object.entries(text.filters).map(([key, label]) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={twMerge(
                "rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 border",
                isActive
                  ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  : "border-white/10 text-neutral-400 hover:text-white hover:border-white/20 bg-transparent"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Horizontal Snap Scroll Track */}
      <div className="relative group/track">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2 px-1">
          {filteredCases.map(item => {
            const categoryLabel = text.filters[item.category] || item.category;

            return (
              <div
                key={item.id}
                className="w-[85vw] sm:w-[420px] flex-shrink-0 snap-center group relative bg-neutral-900/40 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 rounded-3xl p-4 sm:p-5 flex flex-col justify-between"
              >
                {/* Subtle Inner Spotlight Glow Effect */}
                <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.06),transparent_40%)]" />

                <div>
                  {/* Media / Image Container */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
                    {/* Category Pill Floating Top-Start */}
                    <span className="absolute top-3 start-3 z-10 bg-white/[0.06] backdrop-blur-md border border-white/10 text-[11px] text-neutral-300 px-3 py-1 rounded-full font-medium">
                      {categoryLabel}
                    </span>

                    {/* Image or Dark Luxury Gradient */}
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${item.color} group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
                        <span className="text-white/10 font-bold text-4xl sm:text-5xl tracking-widest select-none uppercase">
                          {item.title.substring(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata Content */}
                  <div className="mt-4 sm:mt-5 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-lg sm:text-xl tracking-tight truncate">
                        {item.title}
                      </h3>
                      {item.desc && (
                        <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    {/* Circular Action Button */}
                    {item.liveUrl ? (
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={item.title}
                        className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 shrink-0 mt-0.5"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
