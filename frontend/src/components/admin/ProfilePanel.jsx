import { useEffect, useState } from 'react';
import { profileApi } from '../../services/api';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, ExternalLink } from 'lucide-react';

export default function ProfilePanel() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    profileApi.get().then((p) => { setProfile(p); setForm(p); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileApi.update(form);
      setProfile(updated);
      toast.success('Profile saved');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
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
      setForm({ ...form, image: data.url });
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <div className="text-sm text-[#6b7280]">Loading...</div>;

  const getVal = (obj, path) => path.split('.').reduce((o, k) => (o || {})[k], obj);
  const setVal = (obj, path, val) => {
    const keys = path.split('.');
    if (keys.length === 1) return { ...obj, [keys[0]]: val };
    const key = keys.pop();
    const parent = keys.reduce((o, k) => (o || {})[k], obj);
    const update = { ...parent, [key]: val };
    return setVal(obj, keys.join('.'), update);
  };

  const Field = ({ label, field, type = 'text', rows }) => (
    <div>
      <label className="block text-xs font-medium text-[#6b7280] mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={getVal(form, field) || ''} onChange={(e) => setForm(setVal(form, field, e.target.value))}
          className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
      ) : (
        <input type={type} value={getVal(form, field) || ''} onChange={(e) => setForm(setVal(form, field, e.target.value))}
          className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Edit Profile</h1>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50"
        ><Save size={15} /> {saving ? 'Saving...' : 'Save'}</button>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e3df] p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#6b7280] mb-1">Profile Photo</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input type="text" value={form.image || ''} onChange={(e) => setForm({...form, image: e.target.value})}
                placeholder="Image URL"
                className="w-full mb-2 px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
      <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
        uploading ? 'bg-[#0a0a23]/60 pointer-events-none' : 'bg-[#0a0a23] hover:bg-[#e94560]'
      }`}>
        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
        {uploading ? (
  <span className="inline-flex items-center gap-1.5">
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" className="opacity-30" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeDashoffset="10" className="opacity-90" />
    </svg>
    Uploading...
  </span>
) : 'Upload Image'}
              </label>
            </div>
            {form.image && (
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#e5e3df] flex-shrink-0 bg-[#fafaf8]">
                <img src={form.image} alt="preview" className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name" field="name" />
          <Field label="Email" field="email" type="email" />
        </div>
        <Field label="Title / Headline" field="title" />
        <Field label="Location" field="location" />
        <Field label="Short Bio" field="shortBio" rows={2} />
        <Field label="Full Bio" field="bio" rows={4} />
        <div className="flex items-center gap-2 pt-1">
          <input type="checkbox" id="available" checked={form.available || false}
            onChange={(e) => setForm({...form, available: e.target.checked})}
            className="w-4 h-4 rounded border-[#e5e3df] text-[#0a0a23] focus:ring-[#0a0a23]" />
          <label htmlFor="available" className="text-sm text-[#0a0a23]">Available for work</label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mt-4">
        <h3 className="text-sm font-semibold text-[#0a0a23] mb-3">CV / Resume</h3>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <input type="url" value={form.resumeUrl || ''} onChange={(e) => setForm({...form, resumeUrl: e.target.value})}
              placeholder="CV URL (PDF)"
              className="w-full mb-2 px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0a0a23] text-white rounded-lg cursor-pointer hover:bg-[#e94560] transition-colors disabled:opacity-50">
              <input type="file" accept=".pdf,application/pdf" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || uploadingPdf) return;
                setUploadingPdf(true);
                const fd = new FormData();
                fd.append('file', file);
                try {
                  const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                  setForm({...form, resumeUrl: data.url });
                  toast.success('CV uploaded');
                } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
                finally { setUploadingPdf(false); }
              }} className="hidden" />
              {uploadingPdf ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" className="opacity-30" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeDashoffset="10" className="opacity-90" />
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload PDF'}
            </label>
          </div>
          {form.resumeUrl && (
            <a href={form.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#fafaf8] border border-[#e5e3df] rounded-lg text-[#0a0a23] hover:bg-[#e5e3df] transition-colors">
              <ExternalLink size={13} /> View
            </a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mt-4">
        <h3 className="text-sm font-semibold text-[#0a0a23] mb-3">Languages</h3>
        <div className="space-y-2">
          {(form.languages || []).map((l, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={l.name} onChange={(e) => {
                const updated = [...(form.languages || [])];
                updated[i] = { ...updated[i], name: e.target.value };
                setForm({...form, languages: updated});
              }} className="flex-1 px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Language" />
              <input value={l.level} onChange={(e) => {
                const updated = [...(form.languages || [])];
                updated[i] = { ...updated[i], level: e.target.value };
                setForm({...form, languages: updated});
              }} className="w-28 px-2 py-1.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Level" />
              <button onClick={() => setForm({...form, languages: (form.languages || []).filter((_, idx) => idx !== i)})}
                className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          <button onClick={() => setForm({...form, languages: [...(form.languages || []), { name: '', level: '' }]})}
            className="text-xs font-medium text-[#6b7280] hover:text-[#0a0a23] transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Add Language
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mt-4">
        <h3 className="text-sm font-semibold text-[#0a0a23] mb-3">Social Links</h3>
        <div className="space-y-3">
          <Field label="GitHub URL" field="social.github" />
          <Field label="LinkedIn URL" field="social.linkedin" />
          <Field label="Twitter URL" field="social.twitter" />
          <Field label="Facebook URL" field="social.facebook" />
          <Field label="Instagram URL" field="social.instagram" />
        </div>
      </div>
    </div>
  );
}
