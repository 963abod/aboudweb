import React, { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ExternalLink } from 'lucide-react';

export function Portfolio({ lang, customProjects }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
      cases: [
        {
          id: 1,
          title: 'Aura Parfums',
          desc: 'تجربة تسوق فاخرة لعلامة عطور خليجية مع متجر إلكتروني متكامل.',
          category: 'ecommerce',
          liveUrl: 'https://example.com/aura',
          imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
          color: 'from-amber-500/20 to-zinc-900/50'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'واجهة مستخدم متطورة لمنصة تحليلات بيانات عالية الأداء SaaS.',
          category: 'corporate',
          liveUrl: 'https://example.com/nova',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
          color: 'from-blue-500/20 to-zinc-900/50'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'معرض أعمال بتصميم معماري مبسط واستوديو إبداعي.',
          category: 'landing',
          liveUrl: 'https://example.com/vanguard',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
          color: 'from-rose-500/20 to-zinc-900/50'
        },
        {
          id: 4,
          title: 'Apex Performance',
          desc: 'منصة رياضية وتطبيق ويب لإدارة التمارين وتتبع اللياقة البدنية.',
          category: 'landing',
          liveUrl: 'https://example.com/apex',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
          color: 'from-emerald-500/20 to-zinc-900/50'
        },
        {
          id: 5,
          title: 'Luminary Fintech',
          desc: 'حلول مالية رقمية متقدمة وإدارة محافظ استثمارية آمنة.',
          category: 'corporate',
          liveUrl: 'https://example.com/luminary',
          imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
          color: 'from-purple-500/20 to-zinc-900/50'
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
      previewBtn: 'Visit Live Site ↗',
      cases: [
        {
          id: 1,
          title: 'Aura Parfums',
          desc: 'Luxury Gulf fragrance brand e-commerce experience.',
          category: 'ecommerce',
          liveUrl: 'https://example.com/aura',
          imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
          color: 'from-amber-500/20 to-zinc-900/50'
        },
        {
          id: 2,
          title: 'Nova Metrics',
          desc: 'High-scale analytics platform & SaaS UI.',
          category: 'corporate',
          liveUrl: 'https://example.com/nova',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
          color: 'from-blue-500/20 to-zinc-900/50'
        },
        {
          id: 3,
          title: 'Vanguard Studio',
          desc: 'Minimalist architectural design portfolio.',
          category: 'landing',
          liveUrl: 'https://example.com/vanguard',
          imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
          color: 'from-rose-500/20 to-zinc-900/50'
        },
        {
          id: 4,
          title: 'Apex Performance',
          desc: 'Modern athletic platform and web app for fitness tracking.',
          category: 'landing',
          liveUrl: 'https://example.com/apex',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
          color: 'from-emerald-500/20 to-zinc-900/50'
        },
        {
          id: 5,
          title: 'Luminary Fintech',
          desc: 'Advanced digital financial platform and secure portfolio UI.',
          category: 'corporate',
          liveUrl: 'https://example.com/luminary',
          imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
          color: 'from-purple-500/20 to-zinc-900/50'
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

  const len = filteredCases.length;

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setCurrentIndex(0);
    setSpotlightIndex(0);
  };

  const navigateTo = (newIndex) => {
    if (isAnimating || len === 0) return;
    setIsAnimating(true);
    setCurrentIndex((newIndex + len) % len);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const handleNext = () => navigateTo(currentIndex + 1);
  const handlePrev = () => navigateTo(currentIndex - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (lang === 'ar') {
          handleNext();
        } else {
          handlePrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (lang === 'ar') {
          handlePrev();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating, len, lang]);

  // Touch Swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left
        handleNext();
      } else {
        // Swiped Right
        handlePrev();
      }
    }
  };

  const getCardPositionClass = (index) => {
    if (len === 0) return 'hidden';
    const offset = (index - currentIndex + len) % len;

    if (offset === 0) return 'center';
    if (offset === 1) return 'right-1';
    if (offset === 2) return 'right-2';
    if (offset === len - 1) return 'left-1';
    if (offset === len - 2) return 'left-2';
    return 'hidden';
  };

  const activeProject = filteredCases[spotlightIndex] || filteredCases[currentIndex] || filteredCases[0];

  return (
    <section id="portfolio" className="py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">{text.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{text.subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Object.entries(text.filters).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
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

        {/* Spotlight Carousel */}
        <div className="relative w-full max-w-6xl mx-auto mb-12">
          <div className="spotlight-container" dir="ltr">
            <div className="spotlight-rail">
              {filteredCases.map((item, i) => {
                const isActive = i === spotlightIndex;
                return (
                  <article
                    key={item.id || i}
                    className={twMerge('spotlight-card', isActive && 'is-active')}
                    onMouseEnter={() => setSpotlightIndex(i)}
                    onFocus={() => setSpotlightIndex(i)}
                    onClick={() => {
                      setSpotlightIndex(i);
                      setCurrentIndex(i);
                    }}
                    tabIndex={0}
                    aria-label={item.title}
                  >
                    <div className="spotlight-media">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          draggable="false"
                        />
                      ) : (
                        <div className={twMerge('spotlight-fallback', `bg-gradient-to-br ${item.color}`)}>
                          <span>{item.title}</span>
                        </div>
                      )}
                      <div className="spotlight-shade" />
                      <div className="spotlight-caption">
                        <span>{text.filters[item.category] || item.category}</span>
                        <strong>{item.title}</strong>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Project Info Area */}
        {activeProject && (
          <div className="max-w-xl mx-auto text-center px-4 pt-4 transition-all duration-500">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-semibold text-zinc-300 mb-3 tracking-wide">
              {text.filters[activeProject.category] || activeProject.category}
            </span>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
              {activeProject.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
              {activeProject.desc}
            </p>

            {activeProject.liveUrl && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md group"
              >
                <span>{text.previewBtn}</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
