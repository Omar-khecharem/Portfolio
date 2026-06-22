import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { projectsApi } from '../../services/api';
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

function ProjectModal({ project, onClose, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    longDescription: project?.longDescription || '',
    image: project?.image || '',
    technologies: (project?.technologies || []).join(', '),
    category: project?.category || '',
    status: project?.status || 'completed',
    featured: project?.featured || false,
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    highlights: (project?.highlights || []).join('\n'),
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/profile').then(r => {
      const cats = r.data.projectCategories || [];
      setCategories(cats);
      if (!project && cats.length > 0) setForm(prev => ({ ...prev, category: cats[0] }));
    }).catch(() => {});
  }, [project]);

  const label = (s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

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
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').filter(Boolean),
      };
      if (project?._id) {
        await projectsApi.update(project._id, payload);
        toast.success('Project updated');
      } else {
        await projectsApi.create(payload);
        toast.success('Project created');
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save';
      toast.error(msg, { duration: 5000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#0a0a23]">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-[#6b7280] hover:text-[#0a0a23]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" required />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Long Description</label>
            <textarea rows={3} value={form.longDescription} onChange={(e) => setForm({...form, longDescription: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Image</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input type="text" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})}
                  placeholder="/uploads/example.jpg"
                  className="w-full mb-2 px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0a0a23] text-white rounded-lg cursor-pointer hover:bg-[#e94560] transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
              {form.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#e5e3df] flex-shrink-0 bg-[#fafaf8]">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Technologies (comma)</label>
              <input value={form.technologies} onChange={(e) => setForm({...form, technologies: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30">
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30">
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({...form, featured: e.target.checked})}
                  className="w-4 h-4 rounded border-[#e5e3df] text-[#0a0a23] focus:ring-[#0a0a23]" />
                <span className="text-sm text-[#0a0a23]">Featured</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">GitHub URL</label>
              <input value={form.githubUrl} onChange={(e) => setForm({...form, githubUrl: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1">Live URL</label>
              <input value={form.liveUrl} onChange={(e) => setForm({...form, liveUrl: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1">Highlights (one per line)</label>
            <textarea rows={3} value={form.highlights} onChange={(e) => setForm({...form, highlights: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
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

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => { projectsApi.list().then(setProjects); }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await projectsApi.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Projects</h1>
        <button onClick={() => setModal({})}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
        ><Plus size={15} /> New Project</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                  <th className="text-left p-3 font-medium text-[#6b7280] text-xs w-12">Image</th>
                  <th className="text-left p-3 font-medium text-[#6b7280] text-xs">Title</th>
                  <th className="text-left p-3 font-medium text-[#6b7280] text-xs hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-medium text-[#6b7280] text-xs hidden sm:table-cell">Status</th>
                  <th className="text-left p-3 font-medium text-[#6b7280] text-xs hidden lg:table-cell">Links</th>
                  <th className="text-right p-3 font-medium text-[#6b7280] text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                    <td className="p-3">
                      {p.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#e5e3df] bg-[#fafaf8]">
                          <img src={p.image} alt="" className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#fafaf8] border border-[#e5e3df] flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d8d6d0" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-[#0a0a23]">{p.title}</p>
                      <p className="text-[10px] text-[#6b7280] mt-0.5">{(p.technologies || []).join(', ')}</p>
                    </td>
                    <td className="p-3 text-[#6b7280] capitalize hidden md:table-cell">{p.category}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        p.status === 'completed' ? 'bg-green-100 text-green-700' :
                        p.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>{p.status}</span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        <span className={`w-5 h-5 rounded flex items-center justify-center ${p.githubUrl ? 'bg-[#0a0a23]' : 'bg-[#e5e3df]'}`}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill={p.githubUrl ? 'white' : '#9ca3af'}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                        </span>
                        <span className={`w-5 h-5 rounded flex items-center justify-center ${p.liveUrl ? 'bg-[#0a0a23]' : 'bg-[#e5e3df]'}`}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={p.liveUrl ? 'white' : '#9ca3af'} strokeWidth="3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => setModal(p)} className="p-1.5 text-[#6b7280] hover:text-[#0a0a23] transition-colors" title="Edit"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors ml-0.5" title="Delete"><TrashIcon /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
        {projects.length === 0 && <p className="p-6 text-center text-sm text-[#6b7280]">No projects yet.</p>}
      </div>

      {modal !== null && <ProjectModal project={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
    </div>
  );
}
