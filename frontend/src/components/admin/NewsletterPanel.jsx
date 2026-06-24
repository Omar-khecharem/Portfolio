import { useEffect, useState, useCallback } from 'react';
import api, { profileApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function NewsletterPanel() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.get('/newsletter').then(r => r.data);
      setSubs(data);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Newsletter Subscribers</h1>
        <span className="text-xs text-[#6b7280] bg-[#fafaf8] px-3 py-1.5 rounded-lg border border-[#e5e3df]">{subs.length} total</span>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] overflow-hidden">
        {subs.length === 0 ? (
          <p className="text-sm text-[#6b7280] text-center py-10">No subscribers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e3df] bg-[#fafaf8]">
                <th className="text-left px-4 py-3 font-medium text-[#0a0a23]">Email</th>
                <th className="text-left px-4 py-3 font-medium text-[#0a0a23]">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s._id} className="border-b border-[#e5e3df] last:border-0 hover:bg-[#fafaf8] transition-colors">
                  <td className="px-4 py-3 text-[#0a0a23]">{s.email}</td>
                  <td className="px-4 py-3 text-[#6b7280] text-xs">{new Date(s.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
