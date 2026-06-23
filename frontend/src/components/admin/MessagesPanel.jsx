import { useEffect, useState, useCallback } from 'react';
import { messagesApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await messagesApi.list();
      setMessages(data);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    try { await messagesApi.markRead(id); load(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try { await messagesApi.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Messages</h1>
        <span className="text-xs text-[#6b7280] bg-[#fafaf8] px-3 py-1.5 rounded-lg border border-[#e5e3df]">{messages.filter(m => !m.read).length} unread</span>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && <p className="text-sm text-[#6b7280] text-center py-10">No messages yet.</p>}

        {messages.map((m) => (
          <div key={m._id} className={`bg-white rounded-xl border ${m.read ? 'border-[#e5e3df]' : 'border-[#0a0a23]/20'} p-4 transition-colors`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-[#0a0a23]">{m.name}</p>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-[#e94560]" />}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#fafaf8] text-[#6b7280] border border-[#e5e3df] capitalize">{m.type}</span>
                </div>
                <p className="text-xs text-[#6b7280]">{m.email}</p>
                {m.subject && <p className="text-xs font-medium text-[#0a0a23] mt-1">{m.subject}</p>}
                <p className="text-sm text-[#0a0a23] mt-2 whitespace-pre-wrap">{m.message}</p>
                <p className="text-[10px] text-[#6b7280] mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!m.read && (
                  <button onClick={() => markRead(m._id)} className="p-1.5 text-[#6b7280] hover:text-[#0a0a23] transition-colors" title="Mark as read">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </button>
                )}
                <button onClick={() => handleDelete(m._id)} className="p-1.5 text-[#6b7280] hover:text-[#e94560] transition-colors" title="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
