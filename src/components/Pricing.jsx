import React from 'react';
import { Check } from 'lucide-react';

export function Pricing({ lang, settings }) {
  const starterPrice = settings?.starter_tier_price?.value_ar || '300';
  const displayStarterPrice = starterPrice.startsWith('$') ? starterPrice : `$${starterPrice}`;

  const content = {
    ar: {
      title: 'باقات الأسعار',
      subtitle: 'اختر الباقة الأنسب لاحتياجات عملك',
      packages: [
        {
          id: 'starter',
          name: 'باقة الانطلاق',
          price: displayStarterPrice,
          desc: 'مثالية للشركات الناشئة والمشاريع الصغيرة.',
          features: [
            'موقع متجاوب بالكامل 1-3 صفحات',
            'تصميم مخصص وسرعة قياسية',
            'تهيئة لمحركات البحث (SEO)',
            'ربط فوري بالواتساب وتليغرام',
            'دعم فني متواصل لمدة شهر'
          ],
          cta: 'ابدأ الآن',
          highlighted: false
        },
        {
          id: 'custom',
          name: 'باقة الحلول المخصصة',
          price: 'تسعير مخصص',
          desc: 'للمشاريع الكبيرة والمنصات المعقدة.',
          features: [
            'متاجر إلكترونية كاملة',
            'أنظمة حجز وإدارة محتوى',
            'ربط بوابات دفع',
            'قواعد بيانات مخصصة',
            'دعم لغات متعددة'
          ],
          cta: 'طلب تسعير',
          highlighted: true
        }
      ]
    },
    en: {
      title: 'Pricing & Packages',
      subtitle: 'Choose the best plan for your business needs',
      packages: [
        {
          id: 'starter',
          name: 'Starter Package',
          price: displayStarterPrice,
          desc: 'Perfect for startups and small businesses.',
          features: [
            'Fully responsive 1-3 page website',
            'Custom design & high performance',
            'Basic SEO optimization',
            'WhatsApp & Telegram integration',
            '1 month continuous technical support'
          ],
          cta: 'Start Now',
          highlighted: false
        },
        {
          id: 'custom',
          name: 'Custom Solutions',
          price: 'Custom Quote',
          desc: 'For large projects and complex platforms.',
          features: [
            'Full e-commerce solutions',
            'Booking systems & CMS',
            'Payment gateway integrations',
            'Custom database architecture',
            'Multi-language support'
          ],
          cta: 'Request Quote',
          highlighted: true
        }
      ]
    }
  };

  const text = content[lang];

  return (
    <section id="pricing" className="py-24 px-4 bg-zinc-50/50 dark:bg-[#09090b]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{text.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {text.packages.map((pkg) => (
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
                  <span className={`text-sm ml-2 ${pkg.highlighted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
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
