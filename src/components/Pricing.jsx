import React from 'react';
import { Check } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../defaultSettings';

export function Pricing({ lang, settings }) {
  const activeSettings = settings || DEFAULT_SETTINGS;

  const pkg1 = activeSettings.pricing?.package1 || DEFAULT_SETTINGS.pricing.package1;
  const pkg2 = activeSettings.pricing?.package2 || DEFAULT_SETTINGS.pricing.package2;

  const starterPriceRaw = pkg1.price || '300';
  const displayStarterPrice = String(starterPriceRaw).startsWith('$') ? starterPriceRaw : `$${starterPriceRaw}`;

  const customPriceDisplay = lang === 'ar'
    ? (pkg2.price_ar || DEFAULT_SETTINGS.pricing.package2.price_ar)
    : (pkg2.price_en || DEFAULT_SETTINGS.pricing.package2.price_en);

  const packages = [
    {
      id: 'starter',
      name: lang === 'ar' ? pkg1.name_ar : pkg1.name_en,
      price: displayStarterPrice,
      desc: lang === 'ar' ? pkg1.desc_ar : pkg1.desc_en,
      features: (lang === 'ar' ? pkg1.features_ar : pkg1.features_en) || [],
      cta: lang === 'ar' ? 'ابدأ الآن' : 'Start Now',
      highlighted: false
    },
    {
      id: 'custom',
      name: lang === 'ar' ? pkg2.name_ar : pkg2.name_en,
      price: customPriceDisplay,
      desc: lang === 'ar' ? pkg2.desc_ar : pkg2.desc_en,
      features: (lang === 'ar' ? pkg2.features_ar : pkg2.features_en) || [],
      cta: lang === 'ar' ? 'طلب تسعير' : 'Request Quote',
      highlighted: true
    }
  ];

  const title = lang === 'ar' ? 'باقات الأسعار' : 'Pricing & Packages';
  const subtitle = lang === 'ar'
    ? 'اختر الباقة الأنسب لاحتياجات عملك'
    : 'Choose the best plan for your business needs';

  return (
    <section id="pricing" className="py-24 px-4 bg-zinc-50/50 dark:bg-[#09090b]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                pkg.highlighted
                  ? 'bg-zinc-900 text-zinc-50 border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-200 scale-100 md:scale-105 shadow-xl'
                  : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {lang === 'ar' ? 'الأكثر طلباً' : 'Most Popular'}
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${pkg.highlighted ? '' : 'text-zinc-900 dark:text-zinc-50'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm ${pkg.highlighted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {pkg.desc}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl font-bold ${pkg.highlighted ? '' : 'text-zinc-900 dark:text-zinc-50'}`}>
                  {pkg.price}
                </span>
                {pkg.id === 'starter' && (
                  <span className={`text-sm ml-2 mr-2 ${pkg.highlighted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {lang === 'ar' ? 'يبدأ من' : 'Starting at'}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1 rounded-full p-0.5 ${pkg.highlighted ? 'bg-zinc-800 text-indigo-400 dark:bg-zinc-200 dark:text-indigo-600' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-sm ${pkg.highlighted ? 'text-zinc-300 dark:text-zinc-700' : 'text-zinc-600 dark:text-zinc-400'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#calculator"
                className={`w-full py-3.5 rounded-xl font-medium text-center transition-colors ${
                  pkg.highlighted
                    ? 'bg-white text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800'
                    : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                }`}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
