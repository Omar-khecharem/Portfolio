import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { Save, Sparkles } from 'lucide-react';

const PRESETS = [
  {
    name: 'Subtle',
    desc: 'Light, elegant motion',
    icon: '⊖',
    values: { enabled: true, orbs: true, shapes: true, particles: true, mouseParallax: true, orbsSpeed: 0.5, shapesSpeed: 0.5, particlesDensity: 15, orbsOpacity: 0.12, shapesOpacity: 0.06, blurIntensity: 0.6 },
  },
  {
    name: 'Moderate',
    desc: 'Balanced ambiance',
    icon: '◉',
    values: { enabled: true, orbs: true, shapes: true, particles: true, mouseParallax: true, orbsSpeed: 1.0, shapesSpeed: 1.0, particlesDensity: 35, orbsOpacity: 0.25, shapesOpacity: 0.12, blurIntensity: 1.0 },
  },
  {
    name: 'Dynamic',
    desc: 'Bold, lively effects',
    icon: '✦',
    values: { enabled: true, orbs: true, shapes: true, particles: true, mouseParallax: true, orbsSpeed: 2.0, shapesSpeed: 1.8, particlesDensity: 55, orbsOpacity: 0.35, shapesOpacity: 0.2, blurIntensity: 1.5 },
  },
];

export default function AmbiancePanel() {
  const { theme, update, loading } = useTheme();
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (theme?.animations?.ambient) {
      setForm({ ...theme.animations.ambient });
    } else if (theme) {
      setForm({ enabled: true, orbs: true, shapes: true, particles: true, mouseParallax: true, orbsSpeed: 1, shapesSpeed: 1, particlesDensity: 35, orbsOpacity: 0.25, shapesOpacity: 0.12, blurIntensity: 1 });
    }
  }, [theme]);

  if (loading || !form) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;

  const isPreset = theme?.isPreset === true;

  const applyPreset = async (p) => {
    try {
      await update({ animations: { ...theme.animations, ambient: p.values } });
      setForm(p.values);
      toast.success(`"${p.name}" ambiance applied`);
    } catch { toast.error('Failed to apply preset'); }
  };

  const set = (key, val) => setForm({ ...form, [key]: val });

  const handleSave = async () => {
    try {
      await update({ animations: { ...theme.animations, ambient: form } });
      toast.success('Ambiance settings saved');
    } catch { toast.error('Failed to save'); }
  };

  const toggle = (key) => set(key, !form[key]);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Ambiance</h1>
        {!isPreset && (
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
          ><Save size={15} /> Save</button>
        )}
      </div>

      {isPreset && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800 flex items-center gap-2">
          <Sparkles size={16} />
          This is a preset theme. Duplicate it in Theme panel to customize ambiance settings.
        </div>
      )}

      <div className={`space-y-4 ${isPreset ? 'pointer-events-none opacity-60 select-none' : ''}`}>
        {/* Presets */}
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Quick Presets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button key={p.name}
                onClick={() => applyPreset(p)}
                className="relative rounded-xl border-2 p-4 text-left transition-all hover:border-[#0a0a23]/30 border-[#e5e3df] bg-white group"
              >
                <span className="text-2xl mb-2 block">{p.icon}</span>
                <p className="text-sm font-semibold text-[#0a0a23]">{p.name}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Elements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { key: 'enabled', label: 'Master Toggle' },
              { key: 'orbs', label: 'Glowing Orbs' },
              { key: 'shapes', label: 'Geometric Shapes' },
              { key: 'particles', label: 'Floating Particles' },
              { key: 'mouseParallax', label: 'Mouse Parallax' },
            ].map(({ key, label }) => (
              <label key={key}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  form[key] ? 'border-[#0a0a23] bg-[#0a0a23]/5' : 'border-[#e5e3df] bg-white hover:border-[#0a0a23]/30'
                }`}
              >
                <span className="text-xs font-medium text-[#0a0a23]">{label}</span>
                <input type="checkbox" checked={form[key]} onChange={() => toggle(key)}
                  className="w-4 h-4 rounded border-[#e5e3df] text-[#0a0a23] focus:ring-[#0a0a23]/30 cursor-pointer" />
              </label>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Intensity & Speed</h3>
          <div className="space-y-4">
            <SliderField label="Orbs Speed" value={form.orbsSpeed} min={0.3} max={3} step={0.1} onChange={(v) => set('orbsSpeed', v)} />
            <SliderField label="Shapes Speed" value={form.shapesSpeed} min={0.3} max={3} step={0.1} onChange={(v) => set('shapesSpeed', v)} />
            <SliderField label="Particle Density" value={form.particlesDensity} min={0} max={80} step={1} onChange={(v) => set('particlesDensity', v)} />
            <SliderField label="Orbs Opacity" value={form.orbsOpacity} min={0} max={0.5} step={0.01} onChange={(v) => set('orbsOpacity', v)} format={(v) => `${Math.round(v * 100)}%`} />
            <SliderField label="Shapes Opacity" value={form.shapesOpacity} min={0} max={0.3} step={0.01} onChange={(v) => set('shapesOpacity', v)} format={(v) => `${Math.round(v * 100)}%`} />
            <SliderField label="Blur Intensity" value={form.blurIntensity} min={0} max={2} step={0.1} onChange={(v) => set('blurIntensity', v)} format={(v) => `${v.toFixed(1)}x`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, step, onChange, format }) {
  const display = format ? format(value) : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-[#6b7280]">{label}</label>
        <span className="text-xs font-semibold text-[#0a0a23]">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#0a0a23]" />
    </div>
  );
}
