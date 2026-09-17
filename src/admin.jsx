import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase';
import './index.css';

function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab in dashboard: 'settings' or 'projects'
  const [activeTab, setActiveTab] = useState('projects');

  // Site Settings state
  // Hero Section
  const [availabilityActive, setAvailabilityActive] = useState(true);
  const [availabilityAr, setAvailabilityAr] = useState('متاح لمشاريع جديدة هذا الشهر');
  const [availabilityEn, setAvailabilityEn] = useState('Available for new projects this month');
  const [heroTitleAr, setHeroTitleAr] = useState('نصنع مواقع رقمية فائقة الدقة والسرعة');
  const [heroTitleEn, setHeroTitleEn] = useState('Engineering high-performance digital experiences');
  const [heroSubtitleAr, setHeroSubtitleAr] = useState('تصميم عصري وحلول ويب متطورة تمنح علامتك التجارية الثقة والنمو الذي تستحقه.');
  const [heroSubtitleEn, setHeroSubtitleEn] = useState('Modern web architecture and bespoke digital design crafted to turn visitors into clients.');

  // Contact & Conversion
  const [whatsapp, setWhatsapp] = useState('963951708141');
  const [telegram, setTelegram] = useState('aboudweb');
  const [instagram, setInstagram] = useState('https://instagram.com/aboudweb');

  // Pricing & Calculator
  const [calculatorBasePrice, setCalculatorBasePrice] = useState('300');
  const [starterTierPrice, setStarterTierPrice] = useState('300');

  const [settingsMsg, setSettingsMsg] = useState('');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title_ar: '',
    title_en: '',
    category: 'ecommerce',
    live_url: '',
    image_url: '',
    desc_ar: '',
    desc_en: '',
    color: 'from-amber-500/20 to-zinc-900/50'
  });
  const [projectMsg, setProjectMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchSettings();
      fetchProjects();
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (data && !error && Array.isArray(data)) {
        const settingsMap = {};
        data.forEach(item => {
          settingsMap[item.key] = item;
        });

        if (settingsMap.availability) {
          if (settingsMap.availability.value_ar) setAvailabilityAr(settingsMap.availability.value_ar);
          if (settingsMap.availability.value_en) setAvailabilityEn(settingsMap.availability.value_en);
        }
        if (settingsMap.availability_status) {
          setAvailabilityActive(settingsMap.availability_status.value_ar === 'active');
        }
        if (settingsMap.hero_title) {
          if (settingsMap.hero_title.value_ar) setHeroTitleAr(settingsMap.hero_title.value_ar);
          if (settingsMap.hero_title.value_en) setHeroTitleEn(settingsMap.hero_title.value_en);
        }
        if (settingsMap.hero_subtitle) {
          if (settingsMap.hero_subtitle.value_ar) setHeroSubtitleAr(settingsMap.hero_subtitle.value_ar);
          if (settingsMap.hero_subtitle.value_en) setHeroSubtitleEn(settingsMap.hero_subtitle.value_en);
        }
        if (settingsMap.contact_whatsapp) {
          if (settingsMap.contact_whatsapp.value_ar) setWhatsapp(settingsMap.contact_whatsapp.value_ar);
        }
        if (settingsMap.contact_telegram) {
          if (settingsMap.contact_telegram.value_ar) setTelegram(settingsMap.contact_telegram.value_ar);
        }
        if (settingsMap.contact_instagram) {
          if (settingsMap.contact_instagram.value_ar) setInstagram(settingsMap.contact_instagram.value_ar);
        }
        if (settingsMap.calculator_base_price) {
          if (settingsMap.calculator_base_price.value_ar) setCalculatorBasePrice(settingsMap.calculator_base_price.value_ar);
        }
        if (settingsMap.starter_tier_price) {
          if (settingsMap.starter_tier_price.value_ar) setStarterTierPrice(settingsMap.starter_tier_price.value_ar);
        }
      }
    } catch (err) {
      console.log('Settings fetch notice:', err);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsMsg('جاري الحفظ...');
    try {
      const now = new Date().toISOString();
      const settingsPayload = [
        { key: 'availability', value_ar: availabilityAr, value_en: availabilityEn, updated_at: now },
        { key: 'availability_status', value_ar: availabilityActive ? 'active' : 'closed', value_en: availabilityActive ? 'active' : 'closed', updated_at: now },
        { key: 'hero_title', value_ar: heroTitleAr, value_en: heroTitleEn, updated_at: now },
        { key: 'hero_subtitle', value_ar: heroSubtitleAr, value_en: heroSubtitleEn, updated_at: now },
        { key: 'contact_whatsapp', value_ar: whatsapp, value_en: whatsapp, updated_at: now },
        { key: 'contact_telegram', value_ar: telegram, value_en: telegram, updated_at: now },
        { key: 'contact_instagram', value_ar: instagram, value_en: instagram, updated_at: now },
        { key: 'calculator_base_price', value_ar: calculatorBasePrice, value_en: calculatorBasePrice, updated_at: now },
        { key: 'starter_tier_price', value_ar: starterTierPrice, value_en: starterTierPrice, updated_at: now },
      ];

      const { error } = await supabase
        .from('settings')
        .upsert(settingsPayload, { onConflict: 'key' });

      if (error) {
        setSettingsMsg(`خطأ: ${error.message}`);
      } else {
        setSettingsMsg('تم حفظ جميع الإعدادات بنجاح');
        setTimeout(() => setSettingsMsg(''), 3000);
      }
    } catch (err) {
      setSettingsMsg(`خطأ: ${err.message}`);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (data && !error) {
        setProjects(data);
      }
    } catch (err) {
      console.log('Projects fetch notice:', err);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setProjectMsg('جاري الحفظ...');

    const payload = {
      title: projectForm.title_ar || projectForm.title_en || '',
      title_ar: projectForm.title_ar,
      title_en: projectForm.title_en,
      desc_ar: projectForm.desc_ar,
      desc_en: projectForm.desc_en,
      category: projectForm.category,
      live_url: projectForm.live_url,
      image_url: projectForm.image_url,
      color: projectForm.color || 'from-amber-500/20 to-zinc-900/50'
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);

        if (error) throw error;
        setProjectMsg('تم تحديث المشروع بنجاح');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([payload]);

        if (error) throw error;
        setProjectMsg('تم إضافة المشروع بنجاح');
      }

      setEditingProject(null);
      setProjectForm({
        title_ar: '',
        title_en: '',
        category: 'ecommerce',
        live_url: '',
        image_url: '',
        desc_ar: '',
        desc_en: '',
        color: 'from-amber-500/20 to-zinc-900/50'
      });
      fetchProjects();
      setTimeout(() => setProjectMsg(''), 3000);
    } catch (err) {
      setProjectMsg(`خطأ: ${err.message}`);
    }
  };

  const editProject = (p) => {
    setEditingProject(p);
    setProjectForm({
      title_ar: p.title_ar || p.title || '',
      title_en: p.title_en || p.title || '',
      category: p.category || 'ecommerce',
      live_url: p.live_url || p.url || '',
      image_url: p.image_url || p.cover_image || '',
      desc_ar: p.desc_ar || '',
      desc_en: p.desc_en || '',
      color: p.color || 'from-amber-500/20 to-zinc-900/50'
    });
  };

  const deleteProject = async (id) => {
    if (!confirm('هل أنت تأكد من حذف هذا المشروع؟')) return;
    setProjectMsg('جاري الحذف...');
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjectMsg('تم حذف المشروع بنجاح');
      fetchProjects();
      setTimeout(() => setProjectMsg(''), 3000);
    } catch (err) {
      setProjectMsg(`خطأ: ${err.message}`);
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'ecommerce': return 'متاجر إلكترونية';
      case 'corporate': return 'شركات ومؤسسات';
      case 'landing': return 'صفحات هبوط';
      default: return cat;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400">
        جاري التحميل...
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">تسجيل الدخول - لوحة التحكم</h1>
            <p className="text-sm text-zinc-400">إدارة إعدادات الموقع ومعرض الأعمال</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-500 transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white placeholder-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-zinc-100/10"
            >
              دخول
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800/80 pt-6">
            <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              العودة للموقع الرئيسي
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-arabic">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span className="font-bold text-lg text-white tracking-wide">لوحة تحكم ABOUD WEB</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              معاينة الموقع
            </a>
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            إدارة معرض الأعمال
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            إعدادات الموقع
          </button>
        </div>

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={saveSettings} className="space-y-8">
            {settingsMsg && (
              <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-200">
                {settingsMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Hero Section */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h2 className="text-lg font-bold text-white">قسم البداية (Hero Section)</h2>
                  {/* Availability Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-zinc-400">
                      {availabilityActive ? 'متاح (Active)' : 'مغلق (Closed)'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={availabilityActive}
                      onClick={() => setAvailabilityActive(!availabilityActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        availabilityActive ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          availabilityActive ? '-translate-x-6' : '-translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    نص التوفر (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={availabilityAr}
                    onChange={(e) => setAvailabilityAr(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    نص التوفر (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={availabilityEn}
                    onChange={(e) => setAvailabilityEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    العنوان الرئيسي (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={heroTitleAr}
                    onChange={(e) => setHeroTitleAr(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    العنوان الرئيسي (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={heroTitleEn}
                    onChange={(e) => setHeroTitleEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    العنوان الفرعي (بالعربية)
                  </label>
                  <textarea
                    rows="3"
                    value={heroSubtitleAr}
                    onChange={(e) => setHeroSubtitleAr(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    العنوان الفرعي (بالإنجليزية)
                  </label>
                  <textarea
                    rows="3"
                    value={heroSubtitleEn}
                    onChange={(e) => setHeroSubtitleEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                  />
                </div>
              </div>

              {/* Column 2: Contact & Conversion + Pricing & Calculator */}
              <div className="space-y-8">
                {/* Card 2: Contact & Conversion */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
                    التواصل والتحويل (Contact & Conversion)
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      رقم الواتساب (WhatsApp Phone Number)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="963951708141"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      اسم المستخدم في تليغرام (Telegram Username)
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="aboudweb"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      رابط إنستغرام (Instagram URL)
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/aboudweb"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    />
                  </div>
                </div>

                {/* Card 3: Pricing & Calculator */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
                    الأسعار والحاسبة (Pricing & Calculator)
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      السعر الابتدائي للحاسبة - USD (Base Starting Price)
                    </label>
                    <input
                      type="number"
                      value={calculatorBasePrice}
                      onChange={(e) => setCalculatorBasePrice(e.target.value)}
                      placeholder="300"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      سعر باقة الانطلاق (Starter Tier Price)
                    </label>
                    <input
                      type="text"
                      value={starterTierPrice}
                      onChange={(e) => setStarterTierPrice(e.target.value)}
                      placeholder="300"
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-zinc-100/10"
              >
                حفظ جميع الإعدادات
              </button>
            </div>
          </form>
        )}

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 h-fit backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-6">
                {editingProject ? 'تعديل مشروع' : 'إضافة مشروع جديد'}
              </h2>

              {projectMsg && (
                <div className="mb-4 p-3 rounded-lg bg-zinc-800 text-sm text-zinc-200">
                  {projectMsg}
                </div>
              )}

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    اسم المشروع (بالعربية)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title_ar}
                    onChange={(e) => setProjectForm({ ...projectForm, title_ar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                    placeholder="مثال: متجر أورا للعمور"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    اسم المشروع (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title_en}
                    onChange={(e) => setProjectForm({ ...projectForm, title_en: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    placeholder="e.g. Aura Parfums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">التصنيف (Category)</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  >
                    <option value="ecommerce">متاجر إلكترونية</option>
                    <option value="corporate">شركات ومؤسسات</option>
                    <option value="landing">صفحات هبوط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">رابط المعاينة (Live URL)</label>
                  <input
                    type="url"
                    value={projectForm.live_url}
                    onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">رابط الصورة (Cover Image URL)</label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف المختصر (بالعربية)</label>
                  <textarea
                    required
                    rows="3"
                    value={projectForm.desc_ar}
                    onChange={(e) => setProjectForm({ ...projectForm, desc_ar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                    placeholder="وصف مختصر للمشروع باللغة العربية"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف المختصر (بالإنجليزية)</label>
                  <textarea
                    required
                    rows="3"
                    value={projectForm.desc_en}
                    onChange={(e) => setProjectForm({ ...projectForm, desc_en: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left"
                    placeholder="Short description in English"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all"
                  >
                    {editingProject ? 'تحديث' : 'إضافة'}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          title_ar: '',
                          title_en: '',
                          category: 'ecommerce',
                          live_url: '',
                          image_url: '',
                          desc_ar: '',
                          desc_en: '',
                          color: 'from-amber-500/20 to-zinc-900/50'
                        });
                      }}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-all"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">قائمة المشاريع ({projects.length})</h2>

              {projects.length === 0 ? (
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
                  لا توجد مشاريع مضافة حالياً.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p) => {
                    const cover = p.image_url || p.cover_image;
                    const titleAr = p.title_ar || p.title || '';
                    const titleEn = p.title_en || p.title || '';
                    const liveUrl = p.live_url || p.url || '';

                    return (
                      <div
                        key={p.id}
                        className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
                      >
                        {/* Thumbnail Preview Header */}
                        <div className="relative h-36 w-full bg-zinc-950 overflow-hidden border-b border-zinc-800 flex items-center justify-center">
                          {cover ? (
                            <img
                              src={cover}
                              alt={titleAr}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${p.color || 'from-amber-500/20 to-zinc-900/50'} flex items-center justify-center text-zinc-600 text-xs`}>
                              معاينة غلاف المشروع
                            </div>
                          )}
                          <span className="absolute top-3 right-3 text-xs font-semibold tracking-wider text-zinc-300 px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50">
                            {getCategoryLabel(p.category)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-base font-bold text-white">{titleAr}</h3>
                              {titleEn && titleEn !== titleAr && (
                                <span className="text-xs text-zinc-400 dir-ltr font-english">{titleEn}</span>
                              )}
                            </div>

                            <p className="text-xs text-zinc-400 mb-2 leading-relaxed line-clamp-2">{p.desc_ar}</p>
                            {p.desc_en && (
                              <p className="text-xs text-zinc-500 dir-ltr text-left leading-relaxed line-clamp-2">{p.desc_en}</p>
                            )}

                            {liveUrl && (
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline dir-ltr text-left"
                              >
                                {liveUrl}
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2 border-t border-zinc-800/80 pt-4 mt-4">
                            <button
                              onClick={() => editProject(p)}
                              className="flex-1 text-xs py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-lg transition-colors"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => deleteProject(p.id)}
                              className="px-3 text-xs py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium rounded-lg border border-rose-500/20 transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminDashboard />
  </StrictMode>
);
