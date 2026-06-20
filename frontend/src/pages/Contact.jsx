import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, Facebook, Instagram, MessageCircle } from 'lucide-react';
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
    { icon: Github,    href: social?.github   },
    { icon: Linkedin,  href: social?.linkedin  },
    { icon: Facebook,  href: social?.facebook  },
    { icon: Instagram, href: social?.instagram },
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-accent/10 flex items-center justify-center">
              <MessageCircle size={26} className="text-accent" />
            </motion.div>
            <p className="section-label">Get in Touch</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Let&apos;s Work Together</h1>
            <p className="text-text-muted mt-3 max-w-lg mx-auto">
              Available for freelance projects, internships, and collaborations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-10 max-w-4xl mx-auto">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-line rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-3">Contact Info</h3>
                <div className="space-y-3 text-sm text-text-muted">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-accent" /> omar.khecharem@isimg.tn</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-accent" /> Ariana, Tunisia</p>
                </div>
              </div>
              <div className="bg-white border border-line rounded-xl p-5">
                <h3 className="text-sm font-semibold mb-3">Social</h3>
                <div className="flex gap-3">
                  {SOCIALLINKS.map(({ icon: Icon, href }) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg border border-line flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all"><Icon size={16} /></a>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-line rounded-xl p-5">
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Available for freelance &amp; internships
                </div>
                <p className="text-xs text-text-muted mt-1">Typically responds within 24h</p>
              </div>
            </div>

            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Name *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-sm border border-line rounded-lg bg-surface focus:outline-none focus:border-primary/30" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-sm border border-line rounded-lg bg-surface focus:outline-none focus:border-primary/30" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Subject</label>
                  <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full px-3.5 py-2.5 text-sm border border-line rounded-lg bg-surface focus:outline-none focus:border-primary/30" placeholder="What's this about?" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Message *</label>
                  <textarea rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full px-3.5 py-2.5 text-sm border border-line rounded-lg bg-surface focus:outline-none focus:border-primary/30 resize-none" placeholder="Tell me about your project..." />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >{loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={15} /> Send Message</>}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
