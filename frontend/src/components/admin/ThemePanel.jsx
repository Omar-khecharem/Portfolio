import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { themesApi } from '../../services/api';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Check, X, Plus } from 'lucide-react';

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'base', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
  { key: 'textMuted', label: 'Text Muted' },
  { key: 'line', label: 'Border' },
];

export default function ThemePanel() {
  const { theme, update, loading, activate } = useTheme();
  const [allThemes, setAllThemes] = useState([]);
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { themesApi.list().then(setAllThemes).catch(() => {}); }, []);

  useEffect(() => {
    if (theme) setForm({
      colors: { ...theme.colors },
      hero: { ...theme.hero },
      spacing: { ...theme.spacing },
    });
  }, [theme]);

  if (loading || !form) return <div className="text-sm text-[#6b7280]">Loading theme...</div>;

  const isPreset = theme?.isPreset === true;

  const handleActivate = async (id) => {
    try {
      await activate(id);
      setAllThemes(prev => prev.map(t => ({ ...t, isActive: t._id === id })));
      toast.success('Theme activated');
    } catch { toast.error('Failed to activate theme'); }
  };

  const handleSave = async () => {
    try {
      await update(form);
      toast.success('Theme saved');
    } catch { toast.error('Failed to save theme'); }
  };

  const handleDuplicate = async () => {
    try {
      const custom = await themesApi.create({ ...theme, name: `${theme.name} (Custom)` });
      setAllThemes(prev => prev.map(t => ({ ...t, isActive: false })).concat({ ...custom }));
      toast.success('Custom theme created and activated');
    } catch { toast.error('Failed to create custom theme'); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const current = form.hero.images || (form.hero.imageUrl ? [form.hero.imageUrl] : []);
      setHero('images', [...current, data.url]);
      if (!form.hero.imageUrl) setHero('imageUrl', data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeHeroImage = (idx) => {
    const current = form.hero.images || (form.hero.imageUrl ? [form.hero.imageUrl] : []);
    const updated = current.filter((_, i) => i !== idx);
    setHero('images', updated);
    if (updated.length === 0) {
      setHero('imageUrl', '');
    } else if (idx === 0) {
      setHero('imageUrl', updated[0]);
    }
  };

  const setColor = (key, val) => setForm({ ...form, colors: { ...form.colors, [key]: val } });
  const setHero = (key, val) => setForm({ ...form, hero: { ...form.hero, [key]: val } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Theme Customizer</h1>
        {isPreset ? (
          <button onClick={handleDuplicate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
          ><Save size={15} /> Duplicate & Customize</button>
        ) : (
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
          ><Save size={15} /> Save Current</button>
        )}
      </div>

      {isPreset && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          This is a preset theme with locked colors. Click &quot;Duplicate &amp; Customize&quot; to create your own editable version.
        </div>
      )}

      {allThemes.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Theme Presets</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {allThemes.map((t) => (
              <button key={t._id}
                onClick={() => !t.isActive && handleActivate(t._id)}
                disabled={t.isActive}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                  t.isActive
                    ? 'border-[#0a0a23] bg-[#0a0a23]/5'
                    : 'border-[#e5e3df] hover:border-[#0a0a23]/30 bg-white'
                }`}
              >
                {t.isActive && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#0a0a23] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </span>
                )}
                <div className="flex gap-1 mb-2.5">
                  <span className="w-5 h-5 rounded" style={{ background: t.colors?.primary }} />
                  <span className="w-5 h-5 rounded" style={{ background: t.colors?.accent }} />
                  <span className="w-5 h-5 rounded" style={{ background: t.colors?.base }} />
                </div>
                <p className="text-sm font-medium text-[#0a0a23]">{t.name}</p>
                <p className="text-[10px] text-[#6b7280] mt-0.5">
                  {t.isActive ? 'Active' : 'Click to activate'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`space-y-4 ${isPreset ? 'pointer-events-none opacity-60 select-none' : ''}`}>
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COLOR_FIELDS.map((c) => (
              <div key={c.key}>
                <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">{c.label}</label>
                <div className="flex gap-1.5 items-center">
                  <input type="color" value={form.colors[c.key]}
                    onChange={(e) => setColor(c.key, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 p-0 flex-shrink-0" />
                  <input type="text" value={form.colors[c.key]}
                    onChange={(e) => setColor(c.key, e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 text-[11px] font-mono border border-[#e5e3df] rounded bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Hero Section</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Background Type</label>
              <select value={form.hero.backgroundType} onChange={(e) => setHero('backgroundType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30">
                <option value="gradient">Gradient</option>
                <option value="color">Solid Color</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            {form.hero.backgroundType === 'gradient' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Gradient Start</label>
                  <div className="flex gap-1.5">
                    <input type="color" value={form.hero.gradientStart} onChange={(e) => setHero('gradientStart', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 flex-shrink-0" />
                    <input type="text" value={form.hero.gradientStart} onChange={(e) => setHero('gradientStart', e.target.value)} className="flex-1 px-2 py-1 text-[11px] font-mono border border-[#e5e3df] rounded bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Gradient End</label>
                  <div className="flex gap-1.5">
                    <input type="color" value={form.hero.gradientEnd} onChange={(e) => setHero('gradientEnd', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 flex-shrink-0" />
                    <input type="text" value={form.hero.gradientEnd} onChange={(e) => setHero('gradientEnd', e.target.value)} className="flex-1 px-2 py-1 text-[11px] font-mono border border-[#e5e3df] rounded bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
                  </div>
                </div>
              </div>
            )}
            {form.hero.backgroundType === 'image' && (
              <div>
                <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Images (Slideshow)</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(form.hero.images && form.hero.images.length > 0 ? form.hero.images : form.hero.imageUrl ? [form.hero.imageUrl] : []).map((url, i) => (
                    <div key={i} className="relative w-20 h-14 rounded-lg overflow-hidden border border-[#e5e3df] bg-[#fafaf8] group">
                      <img src={url} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }} />
                      <button onClick={() => removeHeroImage(i)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-14 rounded-lg border-2 border-dashed border-[#e5e3df] flex items-center justify-center cursor-pointer hover:border-[#0a0a23]/30 transition-colors bg-[#fafaf8]">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
  <svg className="animate-spin w-4 h-4 text-[#6b7280]" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" className="opacity-30" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeDashoffset="10" className="opacity-90" />
  </svg>
) : <Plus size={16} className="text-[#6b7280]" />}
                  </label>
                </div>
                {(form.hero.images?.length || (form.hero.imageUrl ? 1 : 0)) > 1 && (
                  <div className="mb-3">
                    <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Transition Duration: {form.hero.imageTransitionDuration || 5}s</label>
                    <input type="range" min="2" max="15" step="1" value={form.hero.imageTransitionDuration || 5}
                      onChange={(e) => setHero('imageTransitionDuration', parseInt(e.target.value))}
                      className="w-full" />
                  </div>
                )}
              </div>
            )}
            {form.hero.backgroundType === 'video' && (
              <div>
                <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Video URL</label>
                <input type="url" value={form.hero.videoUrl || ''} onChange={(e) => setHero('videoUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="https://example.com/hero.mp4" />
              </div>
            )}
            {(form.hero.backgroundType === 'image' || form.hero.backgroundType === 'video') && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Blur: {form.hero.blur || 0}px</label>
                  <input type="range" min="0" max="10" step="1" value={form.hero.blur || 0}
                    onChange={(e) => setHero('blur', parseInt(e.target.value))}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Brightness: {(form.hero.brightness || 1).toFixed(1)}x</label>
                  <input type="range" min="0.5" max="1.5" step="0.1" value={form.hero.brightness || 1}
                    onChange={(e) => setHero('brightness', parseFloat(e.target.value))}
                    className="w-full" />
                </div>
              </div>
            )}
            {form.hero.backgroundType === 'image' && (
              <div>
                <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Image Position</label>
                <select value={form.hero.imagePosition || 'center'} onChange={(e) => setHero('imagePosition', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30">
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Overlay: {Math.round(form.hero.overlay * 100)}%</label>
              <input type="range" min="0" max="1" step="0.05" value={form.hero.overlay}
                onChange={(e) => setHero('overlay', parseFloat(e.target.value))}
                className="w-full" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Spacing</h3>
          <div>
            <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Section Spacing: {form.spacing.section}px</label>
            <input type="range" min="60" max="200" step="10" value={form.spacing.section}
              onChange={(e) => setForm({...form, spacing: { ...form.spacing, section: parseInt(e.target.value) }})}
              className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
