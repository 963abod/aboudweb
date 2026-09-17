import React from 'react';

export function Hero({ lang, settings }) {
  const availabilityStatus = settings?.availability_status?.value_ar !== 'closed';
  const availabilityAr = settings?.availability?.value_ar || 'متاح لمشاريع جديدة هذا الشهر';
  const availabilityEn = settings?.availability?.value_en || 'Available for new projects this month';

  const titleAr = settings?.hero_title?.value_ar || 'نصنع مواقع رقمية فائقة الدقة والسرعة';
  const titleEn = settings?.hero_title?.value_en || 'Engineering high-performance digital experiences';

  const subtitleAr = settings?.hero_subtitle?.value_ar || 'تصميم عصري وحلول ويب متطورة تمنح علامتك التجارية الثقة والنمو الذي تستحقه.';
  const subtitleEn = settings?.hero_subtitle?.value_en || 'Modern web architecture and bespoke digital design crafted to turn visitors into clients.';

  const content = {
    ar: {
      badge: availabilityAr,
      title: titleAr,
      subtitle: subtitleAr,
      ctaPrimary: 'احسب تكلفة مشروعك',
      ctaSecondary: 'استكشف معرض الأعمال'
    },
    en: {
      badge: availabilityEn,
      title: titleEn,
      subtitle: subtitleEn,
      ctaPrimary: 'Calculate Project Cost',
      ctaSecondary: 'Explore Portfolio'
    }
  };

  const text = content[lang];

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 px-4 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-50 dark:via-zinc-950 to-zinc-50 dark:to-zinc-950"></div>

      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm mb-8">
        <span className="relative flex h-2 w-2">
          {availabilityStatus ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
          )}
        </span>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {text.badge}
        </span>
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight md:leading-tight">
          {text.title}
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          {text.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a href="#calculator" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
            {text.ctaPrimary}
          </a>
          <a href="#portfolio" className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors duration-300 font-medium">
            {text.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
