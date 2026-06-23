import { useEffect, useState } from 'react';
import { profileApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function CategoriesPanel() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  useEffect(() => {
    profileApi.get().then(p => setCategories(p.projectCategories || [])).catch(() => {});
  }, []);

  const save = async (cats) => {
    try {
      const data = await profileApi.update({ projectCategories: cats });
      setCategories(data.projectCategories || []);
      toast.success('Categories saved');
    } catch {
      toast.error('Failed to save categories. Check console for details.');
    }
  };

  const add = () => {
    const trimmed = newCat.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmed || categories.includes(trimmed)) return;
    save([...categories, trimmed]);
    setNewCat('');
  };

  const remove = (cat) => {
    const next = categories.filter(c => c !== cat);
    save(next);
  };

  const startEdit = (cat) => {
    setEditing(cat);
    setEditVal(cat);
  };

  const commitEdit = () => {
    const trimmed = editVal.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmed || trimmed === editing) { setEditing(null); return; }
    const next = categories.map(c => c === editing ? trimmed : c);
    save(next);
    setEditing(null);
  };

  const label = (s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Categories</h1>
      </div>
      <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
        <div className="flex gap-2 mb-4">
          <input value={newCat} onChange={e => setNewCat(e.target.value)}
            placeholder="New category name..." className="flex-1 px-3 py-2 border border-[#e5e3df] rounded-lg text-sm focus:outline-none focus:border-[#0a0a23]" />
          <button onClick={add}
            className="px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#0a0a23]/90">Add</button>
        </div>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat} className="flex items-center justify-between px-3 py-2 bg-[#fafaf8] rounded-lg border border-[#e5e3df]">
              {editing === cat ? (
                <input value={editVal} onChange={e => setEditVal(e.target.value)}
                  onBlur={commitEdit} onKeyDown={e => e.key === 'Enter' && commitEdit()}
                  className="flex-1 px-2 py-1 border border-[#e5e3df] rounded text-sm focus:outline-none focus:border-[#0a0a23]" autoFocus />
              ) : (
                <span className="text-sm text-[#0a0a23] font-medium">{label(cat)}</span>
              )}
              <div className="flex gap-2">
                <button onClick={() => startEdit(cat)}
                  className="text-xs text-[#6b7280] hover:text-[#0a0a23] font-medium">Edit</button>
                <button onClick={() => remove(cat)}
                  className="text-xs text-[#e94560] hover:text-[#e94560]/80 font-medium">Delete</button>
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-[#6b7280] text-center py-4">No categories yet. Add one above.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
