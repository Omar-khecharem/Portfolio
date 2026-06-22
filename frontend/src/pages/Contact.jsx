import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Facebook, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', type: 'contact' });
  const [loading, setLoading] = useState(false);
  const [social, setSocial] = useState(null);

  useEffect(() => {
    import('../services/api').then(({ default: api }) => {
      api.get('/profile').then(r => setSocial(r.data?.social || r.social)).catch(() => {});
    });
  }, []);

  const SOCIALLINKS = [
    { icon: Github,    href: social?.github,   label: 'GitHub' },
    { icon: Linkedin,  href: social?.linkedin,  label: 'LinkedIn' },
    { icon: Facebook,  href: social?.facebook,  label: 'Facebook' },
    { icon: Instagram, href: social?.instagram, label: 'Instagram' },
  ].filter(s => s.href);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      const { default: api } = await import('../services/api');
      await api.post('/messages', form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '', type: 'contact' });
    } catch {
      toast.error('Failed to send. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24">
      <section className="py-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[3px] text-accent mb-3">Get in Touch</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Let&apos;s Work Together</h1>
            <p className="text-text-muted mt-3 max-w-lg mx-auto text-sm">
              Available for freelance projects, internships, and collaborations.
            </p>
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 space-y-4 mb-10 lg:mb-0"
            >
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <p className="text-lg font-bold mb-5 relative">Contact Info</p>
                <div className="space-y-4 relative">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <Mail size={15} />
                    </span>
                    <span className="truncate">omar.khecharem@isimg.tn</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <MapPin size={15} />
                    </span>
                    <span>Ariana, Tunisia</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 relative">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Available for freelance & internships
                  </div>
                  <p className="text-xs text-white/40 mt-1">Typically responds within 24h</p>
                </div>
              </div>

              {/* Social */}
              {SOCIALLINKS.length > 0 && (
                <div className="bg-surface border border-line rounded-xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-[3px] text-text-muted mb-4">Social</p>
                  <div className="flex flex-wrap gap-2">
                    {SOCIALLINKS.map(({ icon: Icon, href, label }) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line text-text-muted hover:text-primary hover:border-primary/30 transition-all text-sm"
                        title={label}
                      >
                        <Icon size={15} />
                        <span className="text-xs font-medium">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-7"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                      placeholder="Your name" />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Subject</label>
                  <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                    placeholder="What's this about?" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Message *</label>
                  <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
                    placeholder="Tell me about your project..." />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
