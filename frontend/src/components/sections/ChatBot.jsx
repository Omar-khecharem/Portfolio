import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ArrowRight } from 'lucide-react';
import { profileApi, chatConfigApi } from '../../services/api';
import api from '../../services/api';
import { CHATBOT } from '../../config/constants';
import { NAV_ACTIONS } from '../../config/navigation';

function getActions(content) {
  if (!content) return [];
  const lower = content.toLowerCase();
  const seen = new Set();
  return NAV_ACTIONS.filter(a => a.keywords.some(kw => lower.includes(kw)) && !seen.has(a.path) && seen.add(a.path));
}

function MsgActions({ actions, onNavigate }) {
  if (!actions || actions.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {actions.map((a) => (
        <button
          key={a.path}
          onClick={() => onNavigate(a.path)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
        >
          {a.label} <ArrowRight size={12} />
        </button>
      ))}
    </div>
  );
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: CHATBOT.welcomeMessage, actions: getActions(CHATBOT.welcomeMessage) }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    profileApi.get().then(p => setAvatar(p.image || '')).catch(() => {});
    chatConfigApi.getActive().then(c => {
      if (c?.welcomeMessage) setMessages([{ role: 'assistant', content: c.welcomeMessage, actions: getActions(c.welcomeMessage) }]);
    }).catch(() => {});
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const data = await api.post('/chatbot', {
        message: text,
        history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
      }).then(r => r.data);
      const reply = data.reply || '...';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, actions: getActions(reply) }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: CHATBOT.fallback, actions: getActions(CHATBOT.fallback) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-primary text-white rounded-full shadow-lg hover:bg-accent transition-all flex items-center justify-center hover:scale-105 animate-pulse-ring"
        style={{ width: 52, height: 52 }}
        aria-label="Chat with Omar Assistant"
      >
        <MessageSquare size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-line overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 bg-primary text-white">
              <div className="flex items-center gap-3">
                {avatar ? (
                  <img src={avatar} alt="Omar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-sm font-bold">O</div>
                )}
                <div>
                  <p className="text-sm font-semibold">Omar</p>
                  <p className="text-[10px] text-white/50">AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><X size={16} /></button>
            </div>

            <div className="h-[400px] overflow-y-auto p-4 bg-[#f8f7f4] space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'assistant' && (
                    avatar ? (
                      <img src={avatar} alt="Omar"
                        className="w-7 h-7 rounded-full object-cover mt-1 flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }} />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-1">O</div>
                    )
                  )}
                  <div className={`max-w-[82%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-[#e5e3df] rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{m.content}</p>
                    {m.role === 'assistant' && (
                      <MsgActions actions={m.actions} onNavigate={navigate} />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  {avatar ? (
                    <img src={avatar} alt="Omar"
                      className="w-7 h-7 rounded-full object-cover mt-1 flex-shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }} />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-1">O</div>
                  )}
                  <div className="bg-white border border-[#e5e3df] rounded-2xl rounded-bl-sm p-3 flex gap-1.5 shadow-sm">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-[#e5e3df] bg-white flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about Omar..."
                className="flex-1 px-4 py-2.5 text-sm border border-[#e5e3df] rounded-xl focus:outline-none focus:border-primary/30 bg-[#f8f7f4]"
                disabled={loading}
              />
              <button onClick={send} disabled={!input.trim() || loading}
                className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center">
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
