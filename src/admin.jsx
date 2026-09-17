import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase';
import { DEFAULT_SETTINGS, mergeSettings } from './defaultSettings';
import './index.css';

function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active tab in dashboard: 'hero' | 'calculator' | 'projects' | 'contacts'
  const [activeTab, setActiveTab] = useState('hero');

  // Full Site Settings state
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Helper string states for multi-line feature lists in Tab 2
  const [pkg1FeaturesAr, setPkg1FeaturesAr] = useState('');
  const [pkg1FeaturesEn, setPkg1FeaturesEn] = useState('');
  const [pkg2FeaturesAr, setPkg2FeaturesAr] = useState('');
  const [pkg2FeaturesEn, setPkg2FeaturesEn] = useState('');

  // Projects state (Tab 3)
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

  // Sync multi-line text state when settings change
  useEffect(() => {
    if (settings?.pricing?.package1) {
      setPkg1FeaturesAr((settings.pricing.package1.features_ar || []).join('\n'));
      setPkg1FeaturesEn((settings.pricing.package1.features_en || []).join('\n'));
    }
    if (settings?.pricing?.package2) {
      setPkg2FeaturesAr((settings.pricing.package2.features_ar || []).join('\n'));
      setPkg2FeaturesEn((settings.pricing.package2.features_en || []).join('\n'));
    }
  }, [settings]);

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
        .select('data')
        .eq('id', 1);

      if (data && data.length > 0 && data[0].data && !error) {
        setSettings(mergeSettings(data[0].data));
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.log('Settings fetch notice:', err);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSettingsMsg('جاري الحفظ...');

    // Prepare features arrays from textareas
    const updatedSettings = {
      ...settings,
      pricing: {
        ...settings.pricing,
        package1: {
          ...settings.pricing.package1,
          features_ar: pkg1FeaturesAr.split('\n').filter(f => f.trim().length > 0),
          features_en: pkg1FeaturesEn.split('\n').filter(f => f.trim().length > 0)
        },
        package2: {
          ...settings.pricing.package2,
          features_ar: pkg2FeaturesAr.split('\n').filter(f => f.trim().length > 0),
          features_en: pkg2FeaturesEn.split('\n').filter(f => f.trim().length > 0)
        }
      }
    };

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, data: updatedSettings }, { onConflict: 'id' });

      if (error) {
        setSettingsMsg(`خطأ أثناء الحفظ: ${error.message}`);
      } else {
        setSettings(updatedSettings);
        setSettingsMsg('تم حفظ الإعدادات بنجاح');
        setTimeout(() => setSettingsMsg(''), 3000);
      }
    } catch (err) {
      setSettingsMsg(`خطأ أثناء الحفظ: ${err.message}`);
    } finally {
      setIsSaving(false);
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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 font-arabic">
        جاري التحميل...
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 font-arabic">
        <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">تسجيل الدخول - لوحة التحكم</h1>
            <p className="text-sm text-zinc-400">إدارة كافة إعدادات ومحتوى الموقع</p>
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

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 mb-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'hero'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tab 1: الهيرو والنصوص الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'calculator'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tab 2: حاسبة التكلفة والباقات
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tab 3: معرض المشاريع
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'contacts'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tab 4: التواصل والفوتر
          </button>
        </div>

        {/* Global Save Feedback Message */}
        {settingsMsg && (
          <div className="mb-6 p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 flex items-center justify-between">
            <span>{settingsMsg}</span>
          </div>
        )}

        {/* Tab 1: Hero & Global Settings */}
        {activeTab === 'hero' && (
          <form onSubmit={saveSettings} className="space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-lg font-bold text-white">إعدادات قسم البداية والنصوص الرئيسية (Hero & Global)</h2>
                {/* Availability Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs text-zinc-400">
                    {settings.hero.availability_active ? 'متاح (Active)' : 'مغلق (Closed)'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.hero.availability_active}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, availability_active: !settings.hero.availability_active }
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.hero.availability_active ? 'bg-emerald-500' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.hero.availability_active ? '-translate-x-6' : '-translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">نص التوفر (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.hero.availability_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, availability_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">نص التوفر (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.hero.availability_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, availability_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">العنوان الرئيسي H1 (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.hero.title_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, title_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">العنوان الرئيسي H1 (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.hero.title_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, title_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف الفرعي Subtitle (بالعربية)</label>
                  <textarea
                    rows="2"
                    value={settings.hero.subtitle_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitle_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف الفرعي Subtitle (بالإنجليزية)</label>
                  <textarea
                    rows="2"
                    value={settings.hero.subtitle_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, subtitle_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">زر الدعوة للعمل الرئيسي CTA Primary (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.hero.cta_primary_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_primary_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">زر الدعوة للعمل الرئيسي CTA Primary (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.hero.cta_primary_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_primary_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">زر الدعوة للعمل الثانوي CTA Secondary (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.hero.cta_secondary_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_secondary_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">زر الدعوة للعمل الثانوي CTA Secondary (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.hero.cta_secondary_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero: { ...settings.hero, cta_secondary_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-zinc-100/10 disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Pricing & Calculator Engine */}
        {activeTab === 'calculator' && (
          <form onSubmit={saveSettings} className="space-y-8">
            {/* Calculator Settings */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
                1. إعدادات حاسبة التكلفة (Cost Calculator Engine)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    السعر الأساسي للحاسبة Base Price ($)
                  </label>
                  <input
                    type="number"
                    value={settings.calculator.base_price || 300}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculator: { ...settings.calculator, base_price: Number(e.target.value) }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    إضافة لغات متعددة Multi-Language Addon ($)
                  </label>
                  <input
                    type="number"
                    value={settings.calculator.addons?.multilang ?? 150}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculator: {
                          ...settings.calculator,
                          addons: { ...settings.calculator.addons, multilang: Number(e.target.value) }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    إضافة لوحة تحكم Dynamic CMS Addon ($)
                  </label>
                  <input
                    type="number"
                    value={settings.calculator.addons?.cms ?? 250}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculator: {
                          ...settings.calculator,
                          addons: { ...settings.calculator.addons, cms: Number(e.target.value) }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    إضافة ربط مخصص API Integrations Addon ($)
                  </label>
                  <input
                    type="number"
                    value={settings.calculator.addons?.integrations ?? 200}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculator: {
                          ...settings.calculator,
                          addons: { ...settings.calculator.addons, integrations: Number(e.target.value) }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    إضافة بوابات الدفع Payment Gateway Addon ($)
                  </label>
                  <input
                    type="number"
                    value={settings.calculator.addons?.payment ?? 200}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        calculator: {
                          ...settings.calculator,
                          addons: { ...settings.calculator.addons, payment: Number(e.target.value) }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                  />
                </div>
              </div>
            </div>

            {/* Packages Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Package 1 */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
                <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
                  الباقة الأولى: باقة الانطلاق (Starter Package)
                </h2>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">اسم الباقة (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package1?.name_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package1: { ...settings.pricing.package1, name_ar: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">اسم الباقة (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package1?.name_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package1: { ...settings.pricing.package1, name_en: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">السعر ($ or text)</label>
                  <input
                    type="text"
                    value={settings.pricing.package1?.price || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package1: { ...settings.pricing.package1, price: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package1?.desc_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package1: { ...settings.pricing.package1, desc_ar: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package1?.desc_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package1: { ...settings.pricing.package1, desc_en: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    المميزات (بالعربية - كل ميزة في سطر)
                  </label>
                  <textarea
                    rows="5"
                    value={pkg1FeaturesAr}
                    onChange={(e) => setPkg1FeaturesAr(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    المميزات (بالإنجليزية - كل ميزة في سطر)
                  </label>
                  <textarea
                    rows="5"
                    value={pkg1FeaturesEn}
                    onChange={(e) => setPkg1FeaturesEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>
              </div>

              {/* Package 2 */}
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
                <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
                  الباقة الثانية: باقة الحلول المخصصة (Custom Quote Package)
                </h2>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">اسم الباقة (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package2?.name_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package2: { ...settings.pricing.package2, name_ar: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">اسم الباقة (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package2?.name_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package2: { ...settings.pricing.package2, name_en: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">علامة السعر (بالعربية)</label>
                    <input
                      type="text"
                      value={settings.pricing.package2?.price_ar || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: {
                            ...settings.pricing,
                            package2: { ...settings.pricing.package2, price_ar: e.target.value }
                          }
                        })
                      }
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">علامة السعر (بالإنجليزية)</label>
                    <input
                      type="text"
                      value={settings.pricing.package2?.price_en || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pricing: {
                            ...settings.pricing,
                            package2: { ...settings.pricing.package2, price_en: e.target.value }
                          }
                        })
                      }
                      className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف (بالعربية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package2?.desc_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package2: { ...settings.pricing.package2, desc_ar: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">الوصف (بالإنجليزية)</label>
                  <input
                    type="text"
                    value={settings.pricing.package2?.desc_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        pricing: {
                          ...settings.pricing,
                          package2: { ...settings.pricing.package2, desc_en: e.target.value }
                        }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    الخدمات المضمنة (بالعربية - كل خدمة في سطر)
                  </label>
                  <textarea
                    rows="5"
                    value={pkg2FeaturesAr}
                    onChange={(e) => setPkg2FeaturesAr(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    الخدمات المضمنة (بالإنجليزية - كل خدمة في سطر)
                  </label>
                  <textarea
                    rows="5"
                    value={pkg2FeaturesEn}
                    onChange={(e) => setPkg2FeaturesEn(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-zinc-100/10 disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Portfolio Manager (Full CRUD) */}
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
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
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
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">رابط الصورة (Cover Image URL)</label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
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
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-sm dir-ltr text-left font-english"
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
                              <p className="text-xs text-zinc-500 dir-ltr text-left leading-relaxed line-clamp-2 font-english">{p.desc_en}</p>
                            )}

                            {liveUrl && (
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline dir-ltr text-left font-english"
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

        {/* Tab 4: Contacts & Socials */}
        {activeTab === 'contacts' && (
          <form onSubmit={saveSettings} className="space-y-8">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
                إعدادات التواصل وحسابات التواصل الاجتماعي (Contacts & Socials)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    رقم الواتساب (WhatsApp Phone Number)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.whatsapp || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, whatsapp: e.target.value }
                      })
                    }
                    placeholder="963951708141"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    اسم المستخدم في تليغرام (Telegram Username)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.telegram || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, telegram: e.target.value }
                      })
                    }
                    placeholder="aboudweb"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    رسالة الطلب المسبقة للواتساب (Lead Message Template AR)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.whatsapp_message_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, whatsapp_message_ar: e.target.value }
                      })
                    }
                    placeholder="مرحباً عبود، أود الاستفسار عن مشروع بالمواصفات التالية: {specs}. السعر التقديري: ${price}"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    يمكنك استخدام المتغيرين {"{specs}"} و {"{price}"} ليتم استبدالهما تلقائياً بحسابات الحاسبة.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    رابط ملف إنستغرام (Instagram Profile URL)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.instagram || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, instagram: e.target.value }
                      })
                    }
                    placeholder="https://instagram.com/aboudweb"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    رابط ملف منصة X / Twitter Profile URL
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.x || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, x: e.target.value }
                      })
                    }
                    placeholder="https://x.com/aboudweb"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    حقوق الفوتر (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.copyright_ar || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, copyright_ar: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    حقوق الفوتر (بالإنجليزية)
                  </label>
                  <input
                    type="text"
                    value={settings.contacts.copyright_en || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contacts: { ...settings.contacts, copyright_en: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm dir-ltr text-left font-english"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all shadow-lg hover:shadow-zinc-100/10 disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
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
