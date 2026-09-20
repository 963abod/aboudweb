import React, { useState } from 'react';

const projectsData = [
  {
    id: 1,
    title_ar: "سوقنا",
    title_en: "Souqna",
    category_ar: "متاجر إلكترونية",
    category_en: "E-Commerce",
    category_key: "ecommerce",
    desc_ar: "متجر إلكتروني لتسويق المنتجات والشراء مع نظام تتبع ودفع إلكتروني متكامل.",
    desc_en: "An e-commerce store for marketing and purchasing with integrated tracking and online payment system.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    id: 2,
    title_ar: "مطعم بيتنا الشامي",
    title_en: "Baytna Al-Shami Restaurant",
    category_ar: "متاجر إلكترونية",
    category_en: "E-Commerce",
    category_key: "ecommerce",
    desc_ar: "متجر وقائمة طعام إلكترونية تشمل نظام حجز طاولات وسيو محلي وتوصيل سريع.",
    desc_en: "An online store and menu featuring table reservation system, local SEO, and fast delivery.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    id: 3,
    title_ar: "ساعة حمص القديمة",
    title_en: "Old Clock of Homs",
    category_ar: "صفحات هبوط",
    category_en: "Landing Pages",
    category_key: "landing",
    desc_ar: "صفحة هبوط تفاعلية وتاريخية بتصميم سينمائي تستعرض أهم معالم المدينة.",
    desc_en: "An interactive historical landing page with cinematic design showcasing city landmarks.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    id: 4,
    title_ar: "متجر فيرزاتشي",
    title_en: "Versace Store",
    category_ar: "متاجر إلكترونية",
    category_en: "E-Commerce",
    category_key: "ecommerce",
    desc_ar: "متجر إلكتروني فاخر لعرض منتجات الموضة والأزياء بأسلوب راقٍ وتجربة شراء سلسة.",
    desc_en: "A luxury e-commerce store showcasing fashion items with elegant design and seamless shopping experience.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    link: "#"
  },
  {
    id: 5,
    title_ar: "ورشة الهيثم للكهرباء",
    title_en: "Al-Haitham Electrical Workshop",
    category_ar: "صفحات هبوط",
    category_en: "Landing Pages",
    category_key: "landing",
    desc_ar: "صفحة هبوط حديثة وموثوقة لخدمات الصيانة الكهربائية مع أزرار اتصال واتساب مباشرة.",
    desc_en: "A modern, reliable landing page for electrical maintenance services with direct WhatsApp contact buttons.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    link: "#"
  }
];

const categoryKeys = [
  { key: 'all', ar: 'الكل', en: 'All' },
  { key: 'ecommerce', ar: 'متاجر إلكترونية', en: 'E-Commerce' },
  { key: 'corporate', ar: 'شركات ومؤسسات', en: 'Corporate' },
  { key: 'landing', ar: 'صفحات هبوط', en: 'Landing Pages' }
];

export function Portfolio({ lang = 'ar', customProjects }) {
  const isAr = lang === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');

  const formattedCustomProjects = customProjects && customProjects.length > 0
    ? customProjects.map(p => ({
        id: p.id,
        title_ar: p.title_ar || p.title,
        title_en: p.title_en || p.title,
        category_key: p.category || 'ecommerce',
        category_ar: p.category === 'corporate' ? 'شركات ومؤسسات' : p.category === 'landing' ? 'صفحات هبوط' : 'متاجر إلكترونية',
        category_en: p.category === 'corporate' ? 'Corporate' : p.category === 'landing' ? 'Landing Pages' : 'E-Commerce',
        desc_ar: p.desc_ar || p.desc_en,
        desc_en: p.desc_en || p.desc_ar,
        image: p.image_url || p.cover_image || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
        link: p.live_url || p.url || '#'
      }))
    : projectsData;

  const filteredProjects = activeCategory === 'all'
    ? formattedCustomProjects
    : formattedCustomProjects.filter(p => p.category_key === activeCategory || p.category_ar === activeCategory || p.category_en === activeCategory);

  return (
    <section id="portfolio" className="py-16 px-4 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isAr ? 'معرض الأعمال' : 'Portfolio'}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
          {isAr
            ? 'مشاريع متميزة تعكس دقة التصميم وقوة الأداء البرمجي'
            : 'Featured projects reflecting precision design and powerful software performance'}
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
        {categoryKeys.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg font-semibold'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {isAr ? cat.ar : cat.en}
          </button>
        ))}
      </div>

      {/* Responsive Projects Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProjects.map((project) => {
          const title = isAr ? project.title_ar : project.title_en;
          const desc = isAr ? project.desc_ar : project.desc_en;
          const category = isAr ? project.category_ar : project.category_en;
          const domain = (project.title_en || project.title_ar || 'project')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '');

          return (
            <div
              key={project.id}
              className="group relative flex flex-col bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden hover:border-zinc-300 dark:hover:border-white/25 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
            >
              {/* Minimal Browser Top Bar Mockup */}
              <div className="h-9 bg-zinc-100 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-white/5 flex items-center px-4 gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60 inline-block"></span>
                <div dir="ltr" className="mx-auto bg-zinc-200/80 dark:bg-zinc-900/90 rounded-md px-3 py-0.5 text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                  <span className="text-zinc-400 dark:text-zinc-600">https://</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{domain || 'site'}.com</span>
                </div>
              </div>

              {/* Project Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={project.image}
                  alt={title}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"></div>

                {/* Floating Badge */}
                <span className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200">
                  {category}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                </div>

                {/* Action Button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white text-xs font-semibold border border-zinc-200 dark:border-white/10 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <span>{isAr ? 'معاينة الموقع' : 'Preview Site'}</span>
                  <span className="transition-transform group-hover/btn:-translate-x-1">
                    {isAr ? '←' : '→'}
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Portfolio;
