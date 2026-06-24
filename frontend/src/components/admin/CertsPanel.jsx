import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { certificationsApi } from '../../services/api';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, X, Save } from 'lucide-react';

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  );
}

function CertModal({ cert, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: cert?.name || '',
    issuer: cert?.issuer || '',
    date: cert?.date || '',
    image: cert?.image || '',
    credentialUrl: cert?.credentialUrl || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (cert?._id) {
        await api.put(`/certifications/${cert._id}`, form);
        toast.success('Updated');
      } else {
        await api.post('/certifications', form);
        toast.success('Created');
      }
      onSaved();
      onClose();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#0a0a23]">{cert ? 'Edit' : 'New'} Certification</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-[#0a0a23]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Issuer</label>
            <input value={form.issuer} onChange={(e) => setForm({...form, issuer: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input type="text" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})}
                  placeholder="/uploads/cert.jpg"
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
                <div className="w-32 aspect-video rounded-lg overflow-hidden border border-[#e5e3df] flex-shrink-0 bg-[#fafaf8]">
                  <img src={form.image} alt="preview" className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Date</label>
              <input value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="2024" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Credential URL</label>
              <input value={form.credentialUrl} onChange={(e) => setForm({...form, credentialUrl: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50"
            ><Save size={15} /> {saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#0a0a23] transition-colors">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function CertsPanel() {
  const [certs, setCerts] = useState([]);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    certificationsApi.list().then(setCerts).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this certification?')) return;
    try { await api.delete(`/certifications/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Certifications</h1>
        <button onClick={() => setModal({})}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
        ><Plus size={15} /> Add</button>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e3df] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-12">Image</th>
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Name</th>
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs hidden sm:table-cell">Issuer</th>
                <th className="text-left p-3 font-medium text-[#6b7280] text-xs hidden md:table-cell">Date</th>
                <th className="text-right p-3 font-medium text-[#6b7280] text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c._id} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                  <td className="p-3">
                    {c.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#e5e3df] bg-[#fafaf8] p-0.5">
                        <img src={c.image} alt="" className="w-full h-full object-contain"
                          onError={(e) => { e.target.style.display = 'none' }} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#fafaf8] border border-[#e5e3df] flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8d6d0" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-[#0a0a23]">{c.name}</td>
                  <td className="p-3 text-[#6b7280] hidden sm:table-cell">{c.issuer}</td>
                  <td className="p-3 text-[#6b7280] hidden md:table-cell">{c.date || '-'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setModal(c)} className="p-1.5 text-[#6b7280] hover:text-[#0a0a23] transition-colors" title="Edit"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors ml-0.5" title="Delete"><TrashIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {certs.length === 0 && <p className="p-6 text-center text-sm text-[#6b7280]">No certifications yet.</p>}
      </div>
      {modal !== null && <CertModal cert={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
    </div>
  );
}
