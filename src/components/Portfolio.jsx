import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ExternalLink } from 'lucide-react';

export function Portfolio({ lang, customProjects }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
      previewBtn: 'معاينة الموقع ↗',
      cases: []
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
      previewBtn: 'Visit Live Site ↗',
      cases: []
    }
  };

  const text = content[lang];

  // If custom projects exist from Supabase, map them to current language view format
  const casesToDisplay = customProjects === null
    ? []
    : customProjects.map(p => ({
        id: p.id,
        title: lang === 'ar' ? (p.title_ar || p.title) : (p.title_en || p.title),
        desc: lang === 'ar' ? (p.desc_ar || p.desc_en) : (p.desc_en || p.desc_ar),
        category: p.category || 'ecommerce',
        liveUrl: p.live_url || p.url || '',
        imageUrl: p.image_url || p.cover_image || '',
        color: p.color || 'from-amber-500/20 to-zinc-900/50'
      }));

  const filteredCases = activeFilter === 'all'
    ? casesToDisplay
    : casesToDisplay.filter(c => c.category === activeFilter);

  const len = filteredCases.length;

  const handleFilterChange = (key) => { setActiveFilter(key); setSpotlightIndex(0); };

  const handleSpotlightKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSpotlightIndex(index);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSpotlightIndex((index + 1) % Math.max(len, 1));
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSpotlightIndex((index - 1 + len) % Math.max(len, 1));
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 35 && len > 1) {
      setSpotlightIndex((index) =>
        diff > 0
          ? (index + 1) % len
          : (index - 1 + len) % len
      );
    }
  };

  const activeProject = filteredCases[spotlightIndex] || filteredCases[0];

  return (
    <section id="portfolio" className="portfolio-premium py-28 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="portfolio-heading text-center mb-14">
          <div className="portfolio-eyebrow">SELECTED WORK</div><h2 className="text-4xl md:text-6xl font-bold mb-5 text-zinc-900 dark:text-zinc-50 tracking-tight">{text.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">{text.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters flex flex-wrap justify-center gap-7 mb-14">
          {Object.entries(text.filters).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={twMerge(
                "portfolio-filter relative py-2 text-sm font-medium transition-colors",
                activeFilter === key
                  ? "text-zinc-950 dark:text-zinc-50 portfolio-filter-active"
                  : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrolltide-style Fan Deck */}
        <div className="fan-deck-wrap">
          <div className="fan-deck" dir="ltr" role="region" aria-roledescription="carousel" aria-label={text.title} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="fan-deck-hinge">
              {filteredCases.map((item, i) => {
                const offset = i - spotlightIndex;
                const isActive = offset === 0;
                const abs = Math.abs(offset);
                const clamped = Math.max(-3, Math.min(3, offset));
                const rotation = isActive ? 0 : clamped * 12;
                const x = clamped * 104;
                const y = isActive ? -20 : Math.min(abs * 10, 30);
                const scale = isActive ? 1 : Math.max(.88, 1 - abs * .04);
                const z = isActive ? 28 : Math.max(0, 18 - abs * 6);
                return (
                  <article key={item.id || i} className={twMerge('fan-deck-card', isActive && 'is-active')}
                    style={{'--fan-x':'calc(-50% + '+x+'px)','--fan-y':y+'px','--fan-rotate':rotation+'deg','--fan-scale':scale,'--fan-z':z+'px',zIndex:isActive?30:20-abs}}
                    onClick={() => setSpotlightIndex(i)} onMouseEnter={() => setSpotlightIndex(i)} onFocus={() => setSpotlightIndex(i)}
                    onKeyDown={(e) => handleSpotlightKeyDown(e, i)} tabIndex={0} aria-current={isActive?'true':undefined} aria-label={item.title}>
                    <div className="fan-deck-card-inner">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} loading={i<3?'eager':'lazy'} draggable="false" /> :
                        <div className={twMerge('fan-deck-fallback','bg-gradient-to-br '+item.color)}><span>{item.title}</span></div>}
                      <div className="fan-deck-shade" />
                      <div className="fan-deck-caption">
                        <span className="fan-deck-kicker">{text.filters[item.category] || item.category}</span>
                        <h3>{item.title}</h3><p>{item.desc}</p>
                        {isActive && item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer" className="fan-deck-link" onClick={(e)=>e.stopPropagation()}>
                          {text.previewBtn}<ExternalLink className="w-4 h-4" />
                        </a>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="fan-deck-controls" dir="ltr">
            <button type="button" className="fan-deck-control" onClick={()=>setSpotlightIndex((spotlightIndex-1+len)%Math.max(len,1))} disabled={len<2} aria-label="Previous project">←</button>
            <div className="fan-deck-indicator" aria-live="polite"><span>{String(Math.min(spotlightIndex+1,Math.max(len,1))).padStart(2,'0')}</span><i/><span>{String(Math.max(len,0)).padStart(2,'0')}</span></div>
            <button type="button" className="fan-deck-control" onClick={()=>setSpotlightIndex((spotlightIndex+1)%Math.max(len,1))} disabled={len<2} aria-label="Next project">→</button>
          </div>
        </div>

      </div>
    </section>
  );
}
