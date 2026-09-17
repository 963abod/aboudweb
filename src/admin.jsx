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
  const [availabilityAr, setAvailabilityAr] = useState('متاح لمشاريع جديدة هذا الشهر');
  const [availabilityEn, setAvailabilityEn] = useState('Available for new projects this month');
  const [settingsMsg, setSettingsMsg] = useState('');

  // Projects state
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    desc_ar: '',
    desc_en: '',
    category: 'ecommerce',
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
        .select('*')
        .eq('key', 'availability')
        .single();

      if (data && !error) {
        if (data.value_ar) setAvailabilityAr(data.value_ar);
        if (data.value_en) setAvailabilityEn(data.value_en);
      }
    } catch (err) {
      console.log('Settings fetch notice:', err);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSettingsMsg('جاري الحفظ...');
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'availability',
          value_ar: availabilityAr,
          value_en: availabilityEn,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) {
        setSettingsMsg(`خطأ: ${error.message}`);
      } else {
        setSettingsMsg('تم حفظ الإعدادات بنجاح');
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

    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectForm)
          .eq('id', editingProject.id);

        if (error) throw error;
        setProjectMsg('تم تحديث المشروع بنجاح');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectForm]);

        if (error) throw error;
        setProjectMsg('تم إضافة المشروع بنجاح');
      }

      setEditingProject(null);
      setProjectForm({
        title: '',
        desc_ar: '',
        desc_en: '',
        category: 'ecommerce',
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
      title: p.title || '',
      desc_ar: p.desc_ar || '',
      desc_en: p.desc_en || '',
      category: p.category || 'ecommerce',
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
          <div className="max-w-2xl bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white mb-6">حالة التوفر والاتاحة</h2>

            {settingsMsg && (
              <div className="mb-4 p-3 rounded-lg bg-zinc-800 text-sm text-zinc-200">
                {settingsMsg}
              </div>
            )}

            <form onSubmit={saveSettings} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  نص التوفر (بالعربية)
                </label>
                <input
                  type="text"
                  value={availabilityAr}
                  onChange={(e) => setAvailabilityAr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  نص التوفر (بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={availabilityEn}
                  onChange={(e) => setAvailabilityEn(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white dir-ltr text-left"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold rounded-xl transition-all"
              >
                حفظ الإعدادات
              </button>
            </form>
          </div>
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

              <form onSubmit={handleProjectSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">اسم المشروع</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white"
                    placeholder="مثال: Aura Parfums"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">التصنيف</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white"
                  >
                    <option value="ecommerce">متاجر إلكترونية (E-Commerce)</option>
                    <option value="corporate">شركات ومؤسسات (Corporate)</option>
                    <option value="landing">صفحات هبوط (Landing Pages)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">الوصف بالعربية</label>
                  <textarea
                    required
                    rows="3"
                    value={projectForm.desc_ar}
                    onChange={(e) => setProjectForm({ ...projectForm, desc_ar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white"
                    placeholder="وصف مختصر للمشروع باللغة العربية"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">الوصف بالإنجليزية</label>
                  <textarea
                    required
                    rows="3"
                    value={projectForm.desc_en}
                    onChange={(e) => setProjectForm({ ...projectForm, desc_en: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white dir-ltr text-left"
                    placeholder="Short description in English"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">نمط الخلفية (Gradient Class)</label>
                  <select
                    value={projectForm.color}
                    onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-white text-xs"
                  >
                    <option value="from-amber-500/20 to-zinc-900/50">Amber Gradient</option>
                    <option value="from-blue-500/20 to-zinc-900/50">Blue Gradient</option>
                    <option value="from-rose-500/20 to-zinc-900/50">Rose Gradient</option>
                    <option value="from-emerald-500/20 to-zinc-900/50">Emerald Gradient</option>
                    <option value="from-purple-500/20 to-zinc-900/50">Purple Gradient</option>
                  </select>
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
                          title: '',
                          desc_ar: '',
                          desc_en: '',
                          category: 'ecommerce',
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
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2.5 py-1 rounded-full bg-zinc-800">
                            {p.category}
                          </span>
                          <span className="text-xs text-zinc-500">ID: {p.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                        <p className="text-xs text-zinc-400 mb-2 leading-relaxed">{p.desc_ar}</p>
                        <p className="text-xs text-zinc-500 dir-ltr text-left leading-relaxed">{p.desc_en}</p>
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
                  ))}
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
