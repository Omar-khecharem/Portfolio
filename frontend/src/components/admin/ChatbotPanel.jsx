import { useEffect, useState } from 'react';
import { chatConfigApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Check, MessageSquare, Bot } from 'lucide-react';

const PRESETS = [
  {
    name: 'Professional',
    desc: 'Formal recruiter tone',
    icon: '👔',
    values: {
      role: 'You represent a professional Full-Stack Developer portfolio seeking career opportunities.',
      personality: 'formal\nconfident\nrecruiter-friendly\npolished',
      rules: ['Never discuss salary expectations.', 'Direct hiring inquiries to the Contact page.'],
      welcomeMessage: "Welcome! I'm Omar's professional assistant. I can help you learn about his experience, skills, and projects. How can I assist you today?",
      fallbackResponse: "I'm specialized in Omar's professional profile only. Please ask about his skills, experience, or projects.",
      temperature: 0.3, maxTokens: 256, briefMode: true, allowMarkdown: false,
    },
  },
  {
    name: 'Friendly',
    desc: 'Warm approachable tone',
    icon: '😊',
    values: {
      role: 'You are a friendly assistant representing a talented Full-Stack Developer.',
      personality: 'warm\nhelpful\nenthusiastic\napproachable',
      rules: ['Be encouraging and positive.', 'If someone seems interested in hiring, warmly encourage them to reach out.'],
      welcomeMessage: "Hey there! 👋 I'm Omar's AI friend. Ask me anything about his work, skills, or what he's building!",
      fallbackResponse: "I'd love to help with that, but I only know about Omar's professional journey. Try asking about his projects or skills!",
      temperature: 0.7, maxTokens: 384, briefMode: false, allowMarkdown: false,
    },
  },
  {
    name: 'Technical',
    desc: 'Detailed dev-focused tone',
    icon: '⚡',
    values: {
      role: 'You are a technical assistant representing a Full-Stack Developer with deep AI expertise.',
      personality: 'technical\nprecise\ndetail-oriented\ndeveloper-friendly',
      rules: ['Provide specific technical details when asked about projects and technologies.', 'Use technical terminology appropriately.', 'If asked about architecture or stack choices, explain the reasoning.'],
      welcomeMessage: "Hi, I'm Omar's technical assistant. Feel free to ask about the tech stack, architecture decisions, or implementation details of his projects.",
      fallbackResponse: "I'm focused on technical details about Omar's development work. Ask about specific projects, technologies, or architecture.",
      temperature: 0.5, maxTokens: 512, briefMode: false, allowMarkdown: true,
    },
  },
];

export default function ChatbotPanel() {
  const [configs, setConfigs] = useState([]);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      chatConfigApi.getActive(),
      chatConfigApi.list(),
    ]).then(([activeConfig, all]) => {
      setActive(activeConfig);
      setForm(activeConfig);
      setConfigs(all);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading...</div>;
  if (!form) return <div className="text-sm text-[#6b7280] py-10 text-center">No config loaded</div>;

  const isPreset = form.isPreset === true;

  const set = (key, val) => setForm({ ...form, [key]: val });
  const toggle = (key) => set(key, !form[key]);

  const handleSave = async () => {
    try {
      const updated = await chatConfigApi.update(form._id, form);
      setActive(updated);
      setForm(updated);
      setConfigs(prev => prev.map(c => c._id === updated._id ? updated : c));
      toast.success('Chat config saved');
    } catch { toast.error('Failed to save'); }
  };

  const handleActivate = async (id) => {
    try {
      const activated = await chatConfigApi.activate(id);
      setActive(activated);
      setForm(activated);
      setConfigs(prev => prev.map(c => ({ ...c, isActive: c._id === id })));
      toast.success('Config activated');
    } catch { toast.error('Failed to activate'); }
  };

  const applyPreset = async (p) => {
    try {
      const created = await chatConfigApi.create({ ...p.values, name: p.name, isPreset: false });
      setActive(created);
      setForm(created);
      setConfigs(prev => prev.map(c => ({ ...c, isActive: false })).concat(created));
      toast.success(`"${p.name}" preset applied`);
    } catch { toast.error('Failed to apply preset'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23] flex items-center gap-2">
          <Bot size={18} /> Chatbot Configuration
        </h1>
        {!isPreset && (
          <button onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
          ><Save size={15} /> Save</button>
        )}
      </div>

      {isPreset && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-sm text-amber-800 flex items-center gap-2">
          <Bot size={16} />
          This is a preset. Apply a preset below to create a customizable version, or duplicate in the presets section.
        </div>
      )}

      {/* Presets */}
      <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mb-4">
        <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button key={p.name}
              onClick={() => applyPreset(p)}
              className="rounded-xl border-2 p-4 text-left transition-all hover:border-[#0a0a23]/30 border-[#e5e3df] bg-white group"
            >
              <span className="text-2xl mb-1 block">{p.icon}</span>
              <p className="text-sm font-semibold text-[#0a0a23]">{p.name}</p>
              <p className="text-xs text-[#6b7280] mt-0.5">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Saved configs */}
      {configs.filter(c => !c.isPreset).length > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5 mb-4">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Saved Configurations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {configs.filter(c => !c.isPreset).map((c) => (
              <button key={c._id}
                onClick={() => !c.isActive && handleActivate(c._id)}
                disabled={c.isActive}
                className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                  c.isActive ? 'border-[#0a0a23] bg-[#0a0a23]/5' : 'border-[#e5e3df] hover:border-[#0a0a23]/30 bg-white'
                }`}
              >
                {c.isActive && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#0a0a23] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </span>
                )}
                <p className="text-sm font-medium text-[#0a0a23]">{c.name}</p>
                <p className="text-[10px] text-[#6b7280] mt-0.5">{c.isActive ? 'Active' : 'Click to activate'}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div className={`space-y-4 ${isPreset ? 'pointer-events-none opacity-60 select-none' : ''}`}>
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4 flex items-center gap-2">
            <MessageSquare size={15} /> Role & Personality
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Role</label>
              <textarea value={form.role} onChange={(e) => set('role', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Personality (one per line)</label>
              <textarea value={form.personality} onChange={(e) => set('personality', e.target.value)} rows={3}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Rules</h3>
          <div className="space-y-2">
            {(form.rules || []).map((r, i) => (
              <div key={i} className="flex gap-2">
                <input value={r} onChange={(e) => {
                  const updated = [...form.rules];
                  updated[i] = e.target.value;
                  set('rules', updated);
                }} className="flex-1 px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30" placeholder="Rule..." />
                <button onClick={() => set('rules', form.rules.filter((_, j) => j !== i))}
                  className="px-2 text-[#6b7280] hover:text-[#e94560] transition-colors text-sm">✕</button>
              </div>
            ))}
            <button onClick={() => set('rules', [...(form.rules || []), ''])}
              className="text-xs text-[#6b7280] hover:text-[#0a0a23] transition-colors">+ Add rule</button>
          </div>
          {(form.defaultRules || []).length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#e5e3df]">
              <p className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider mb-1">Default Rules (always active, read-only)</p>
              {form.defaultRules.map((r, i) => (
                <p key={i} className="text-xs text-[#6b7280] flex items-start gap-1.5">
                  <span className="text-[#0a0a23] mt-0.5">•</span> {r}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Messages</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Welcome Message</label>
              <textarea value={form.welcomeMessage} onChange={(e) => set('welcomeMessage', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Fallback Response (unrelated questions)</label>
              <textarea value={form.fallbackResponse} onChange={(e) => set('fallbackResponse', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">AI Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Temperature: {form.temperature}</label>
              <input type="range" min="0.1" max="1" step="0.05" value={form.temperature}
                onChange={(e) => set('temperature', parseFloat(e.target.value))}
                className="w-full accent-[#0a0a23]" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Max Tokens: {form.maxTokens}</label>
              <input type="range" min="64" max="1024" step="32" value={form.maxTokens}
                onChange={(e) => set('maxTokens', parseInt(e.target.value))}
                className="w-full accent-[#0a0a23]" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Max History Messages: {form.maxHistoryMessages}</label>
              <input type="range" min="0" max="20" step="1" value={form.maxHistoryMessages}
                onChange={(e) => set('maxHistoryMessages', parseInt(e.target.value))}
                className="w-full accent-[#0a0a23]" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#6b7280] mb-1 uppercase tracking-wider">Max Context Projects: {form.maxContextProjects}</label>
              <input type="range" min="0" max="20" step="1" value={form.maxContextProjects}
                onChange={(e) => set('maxContextProjects', parseInt(e.target.value))}
                className="w-full accent-[#0a0a23]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Context Sections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'showSkills', label: 'Skills' },
              { key: 'showExperience', label: 'Experience' },
              { key: 'showProjects', label: 'Projects' },
              { key: 'showEducation', label: 'Education' },
              { key: 'showCertifications', label: 'Certifications' },
              { key: 'showLanguages', label: 'Languages' },
              { key: 'showServices', label: 'Services' },
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

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Behavior</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              form.briefMode ? 'border-[#0a0a23] bg-[#0a0a23]/5' : 'border-[#e5e3df] bg-white hover:border-[#0a0a23]/30'
            }`}>
              <span className="text-xs font-medium text-[#0a0a23]">Brief Mode (2-3 sentences)</span>
              <input type="checkbox" checked={form.briefMode} onChange={() => toggle('briefMode')}
                className="w-4 h-4 rounded border-[#e5e3df] text-[#0a0a23] focus:ring-[#0a0a23]/30 cursor-pointer" />
            </label>
            <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              form.allowMarkdown ? 'border-[#0a0a23] bg-[#0a0a23]/5' : 'border-[#e5e3df] bg-white hover:border-[#0a0a23]/30'
            }`}>
              <span className="text-xs font-medium text-[#0a0a23]">Allow Markdown</span>
              <input type="checkbox" checked={form.allowMarkdown} onChange={() => toggle('allowMarkdown')}
                className="w-4 h-4 rounded border-[#e5e3df] text-[#0a0a23] focus:ring-[#0a0a23]/30 cursor-pointer" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
