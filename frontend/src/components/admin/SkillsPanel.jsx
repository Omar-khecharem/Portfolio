import { useEffect, useState, useCallback } from 'react';
import { profileApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Save } from 'lucide-react';

function getDefaultColor(skills) {
  const existing = skills.find(s => s.color);
  return existing?.color || '#e94560';
}

export default function SkillsPanel() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalColor, setGlobalColor] = useState('#e94560');

  const loadSkills = useCallback(async () => {
    try {
      const profile = await profileApi.get();
      const s = profile.skills || [];
      setSkills(s);
      setGlobalColor(getDefaultColor(s));
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSkills(); }, [loadSkills]);

  const updateGlobalColor = (color) => {
    setGlobalColor(color);
    setSkills(skills.map(s => ({ ...s, color })));
  };

  const addSkill = () => {
    setSkills([...skills, { name: '', category: 'frontend', level: 70, color: globalColor }]);
  };

  const updateSkill = (i, field, value) => {
    const updated = [...skills];
    updated[i] = { ...updated[i], [field]: value };
    setSkills(updated);
  };

  const removeSkill = (i) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profile = await profileApi.get();
      await profileApi.update({ ...profile, skills });
      toast.success('Skills saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const CATEGORIES = ['frontend', 'backend', 'ai', 'tools'];

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Skills</h1>
        <div className="flex gap-2">
          <button onClick={addSkill}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e3df] text-[#0a0a23] text-sm font-medium rounded-lg hover:bg-[#fafaf8] transition-colors"
          ><Plus size={15} /> Add</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50"
          ><Save size={15} /> {saving ? 'Saving...' : 'Save All'}</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] p-4 mb-4 flex items-center gap-4">
        <label className="text-xs font-medium text-[#6b7280]">Skills Color</label>
        <input type="color" value={globalColor} onChange={(e) => updateGlobalColor(e.target.value)}
          className="w-9 h-9 p-0.5 rounded cursor-pointer border border-[#e5e3df]" />
        <span className="text-xs text-[#6b7280]">{globalColor}</span>
        <span className="text-[11px] text-[#9ca3af]">— Applied to all skills</span>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Name</th>
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-28">Category</th>
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-56">Level</th>
                <th className="text-right p-3 font-medium text-[#6b7280] text-xs w-12">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, i) => (
                <tr key={i} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                  <td className="p-3">
                    <input value={s.name} onChange={(e) => updateSkill(i, 'name', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Skill name" />
                  </td>
                  <td className="p-3">
                    <select value={s.category} onChange={(e) => updateSkill(i, 'category', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 capitalize">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="100" value={s.level}
                        onChange={(e) => updateSkill(i, 'level', parseInt(e.target.value))}
                        className="flex-1" />
                      <span className="text-xs font-medium text-[#6b7280] w-8 text-right">{s.level}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => removeSkill(i)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors" title="Remove">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {skills.length === 0 && <p className="p-6 text-center text-sm text-[#6b7280]">No skills yet. Click Add to create one.</p>}
      </div>
    </div>
  );
}
