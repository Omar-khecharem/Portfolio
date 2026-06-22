import { useEffect, useState, useCallback } from 'react';
import { profileApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Save, Briefcase, GraduationCap } from 'lucide-react';

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

const EMPTY_EXP = { role: '', company: '', period: '', description: '', highlights: [] };
const EMPTY_EDU = { degree: '', institution: '', period: '', description: '' };

export default function BackgroundPanel() {
  const [tab, setTab] = useState('experience');
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const profile = await profileApi.get();
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addExp = () => setExperience([...experience, { ...EMPTY_EXP, highlights: [] }]);
  const addEdu = () => setEducation([...education, { ...EMPTY_EDU }]);

  const updateExp = (i, field, value) => {
    const updated = [...experience];
    updated[i] = { ...updated[i], [field]: value };
    setExperience(updated);
  };

  const updateEdu = (i, field, value) => {
    const updated = [...education];
    updated[i] = { ...updated[i], [field]: value };
    setEducation(updated);
  };

  const removeExp = (i) => setExperience(experience.filter((_, idx) => idx !== i));
  const removeEdu = (i) => setEducation(education.filter((_, idx) => idx !== i));

  const addHighlight = (i) => {
    const updated = [...experience];
    updated[i] = { ...updated[i], highlights: [...(updated[i].highlights || []), ''] };
    setExperience(updated);
  };

  const updateHighlight = (expIdx, hlIdx, value) => {
    const updated = [...experience];
    updated[expIdx].highlights[hlIdx] = value;
    setExperience(updated);
  };

  const removeHighlight = (expIdx, hlIdx) => {
    const updated = [...experience];
    updated[expIdx].highlights = updated[expIdx].highlights.filter((_, i) => i !== hlIdx);
    setExperience(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const profile = await profileApi.get();
      await profileApi.update({ ...profile, experience, education });
      toast.success('Background saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Background</h1>
        <div className="flex gap-2">
          <button onClick={tab === 'experience' ? addExp : addEdu}
            className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e3df] text-[#0a0a23] text-sm font-medium rounded-lg hover:bg-[#fafaf8] transition-colors"
          ><Plus size={15} /> Add</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50"
          ><Save size={15} /> {saving ? 'Saving...' : 'Save All'}</button>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab('experience')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            tab === 'experience' ? 'bg-[#0a0a23] text-white' : 'bg-white text-[#6b7280] border border-[#e5e3df] hover:text-[#0a0a23]'
          }`}
        ><Briefcase size={15} /> Experience</button>
        <button onClick={() => setTab('education')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            tab === 'education' ? 'bg-[#0a0a23] text-white' : 'bg-white text-[#6b7280] border border-[#e5e3df] hover:text-[#0a0a23]'
          }`}
        ><GraduationCap size={15} /> Education</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] overflow-hidden">
        {tab === 'experience' && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Role</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Company</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Period</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-[30%]">Description</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Highlights</th>
                    <th className="text-right p-3 font-medium text-[#6b7280] text-xs w-12">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {experience.map((exp, i) => (
                    <tr key={i} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                      <td className="p-3">
                        <input value={exp.role} onChange={(e) => updateExp(i, 'role', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Role title" />
                      </td>
                      <td className="p-3">
                        <input value={exp.company} onChange={(e) => updateExp(i, 'company', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Company name" />
                      </td>
                      <td className="p-3">
                        <input value={exp.period} onChange={(e) => updateExp(i, 'period', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Jan 2023 - Dec 2024" />
                      </td>
                      <td className="p-3">
                        <textarea value={exp.description || ''} onChange={(e) => updateExp(i, 'description', e.target.value)} rows={2}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" placeholder="Short description" />
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {(exp.highlights || []).map((hl, j) => (
                            <div key={j} className="flex gap-1">
                              <input value={hl} onChange={(e) => updateHighlight(i, j, e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-[#e5e3df] rounded bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Highlight point" />
                              <button onClick={() => removeHighlight(i, j)} className="p-1 text-[#6b7280] hover:text-[#e94560] transition-colors shrink-0"><TrashIcon /></button>
                            </div>
                          ))}
                          <button onClick={() => addHighlight(i)}
                            className="text-xs text-[#6b7280] hover:text-[#0a0a23] transition-colors">+ Add point</button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => removeExp(i)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors" title="Remove"><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {experience.length === 0 && <p className="p-6 text-center text-sm text-[#6b7280]">No experience entries yet. Click Add to create one.</p>}
          </>
        )}

        {tab === 'education' && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Degree</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Institution</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Period</th>
                    <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-[35%]">Description</th>
                    <th className="text-right p-3 font-medium text-[#6b7280] text-xs w-12">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu, i) => (
                    <tr key={i} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                      <td className="p-3">
                        <input value={edu.degree} onChange={(e) => updateEdu(i, 'degree', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Degree name" />
                      </td>
                      <td className="p-3">
                        <input value={edu.institution} onChange={(e) => updateEdu(i, 'institution', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Institution name" />
                      </td>
                      <td className="p-3">
                        <input value={edu.period} onChange={(e) => updateEdu(i, 'period', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Sep 2022 - Jun 2026" />
                      </td>
                      <td className="p-3">
                        <textarea value={edu.description || ''} onChange={(e) => updateEdu(i, 'description', e.target.value)} rows={2}
                          className="w-full px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" placeholder="Short description" />
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => removeEdu(i)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors" title="Remove"><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {education.length === 0 && <p className="p-6 text-center text-sm text-[#6b7280]">No education entries yet. Click Add to create one.</p>}
          </>
        )}
      </div>
    </div>
  );
}
