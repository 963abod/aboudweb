import React, { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function CostEstimator({ lang }) {
  const content = {
    ar: {
      title: 'حاسبة التكلفة',
      subtitle: 'اختر المواصفات التي تحتاجها في مشروعك',
      types: {
        'landing': 'صفحة هبوط',
        'business': 'موقع تعريفي',
        'ecommerce': 'متجر إلكتروني مخصص'
      },
      features: {
        'multilang': 'لغات متعددة',
        'cms': 'لوحة تحكم (CMS)',
        'integrations': 'ربط مخصص (API)',
        'payment': 'بوابات الدفع'
      },
      total: 'التكلفة التقديرية',
      whatsapp: 'إرسال المواصفات عبر واتساب',
      telegram: 'تواصل عبر تليغرام'
    },
    en: {
      title: 'Cost Estimator',
      subtitle: 'Select the features you need for your project',
      types: {
        'landing': 'Landing Page',
        'business': 'Business Website',
        'ecommerce': 'Custom E-Commerce'
      },
      features: {
        'multilang': 'Multi-Language',
        'cms': 'Dynamic CMS',
        'integrations': 'Custom Integrations',
        'payment': 'Payment Setup'
      },
      total: 'Estimated Total',
      whatsapp: 'Send Specs via WhatsApp',
      telegram: 'Contact via Telegram'
    }
  };

  const text = content[lang];

  const [selectedType, setSelectedType] = useState('landing');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [price, setPrice] = useState(300);

  const prices = {
    types: {
      'landing': 300,
      'business': 500,
      'ecommerce': 1000
    },
    features: {
      'multilang': 150,
      'cms': 250,
      'integrations': 200,
      'payment': 200
    }
  };

  useEffect(() => {
    let newPrice = prices.types[selectedType];
    selectedFeatures.forEach(feature => {
      newPrice += prices.features[feature];
    });
    setPrice(newPrice);
  }, [selectedType, selectedFeatures]);

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const buildMessage = () => {
    const specs = [
      text.types[selectedType],
      ...selectedFeatures.map(f => text.features[f])
    ].join(' + ');

    return encodeURIComponent(`مرحباً عبود، أود الاستفسار عن مشروع بالمواصفات التالية: ${specs}. السعر التقديري: $${price}`);
  };

  return (
    <section id="calculator" className="py-24 px-4 bg-zinc-50/50 dark:bg-[#09090b]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{text.title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">{text.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 backdrop-blur-sm shadow-xl shadow-zinc-200/50 dark:shadow-none">

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">{lang === 'ar' ? 'نوع الموقع' : 'Website Type'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(text.types).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(key)}
                  className={twMerge(
                    "px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium",
                    selectedType === key
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-lg font-medium mb-4">{lang === 'ar' ? 'الميزات الإضافية' : 'Additional Features'}</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(text.features).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleFeature(key)}
                  className={twMerge(
                    "px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium",
                    selectedFeatures.includes(key)
                      ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1">{text.total}</p>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                ${price}
              </p>
            </div>

            <div className="flex flex-col w-full md:w-auto gap-3">
              <a
                href={`https://wa.me/963951708141?text=${buildMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {text.whatsapp}
              </a>

              <a
                href={`https://t.me/aboudweb?text=${buildMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium transition-colors"
              >
                <Send className="w-5 h-5" />
                {text.telegram}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
