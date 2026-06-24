import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STORAGE_KEY = 'omar_newsletter_subscribed';

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email: email.trim() });
      localStorage.setItem(STORAGE_KEY, 'true');
      setDone(true);
      toast.success('Welcome aboard! Check your inbox.');
      setTimeout(() => setVisible(false), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280, delay: 0.05 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-line overflow-hidden"
          >
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-surface flex items-center justify-center text-text-muted hover:text-text transition-all"
            >
              <X size={16} />
            </button>

            <div className="p-8 pt-10 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
                {done ? (
                  <CheckCircle size={28} className="text-green-500" />
                ) : (
                  <Mail size={28} className="text-primary" />
                )}
              </div>

              <h3 className="text-xl font-bold text-text mb-2">
                {done ? 'You\'re subscribed!' : 'Stay Updated'}
              </h3>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                {done
                  ? 'Thanks for subscribing. You\'ll hear about new projects, articles, and freelance opportunities.'
                  : 'Get notified about new projects, articles, and freelance opportunities. No spam, unsubscribe anytime.'
                }
              </p>

              {!done && (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 pr-11 text-sm border border-line rounded-xl bg-surface/50 focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                      disabled={loading}
                    />
                    <Mail size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                  <button
                    type="submit"
                    disabled={!email.trim() || loading}
                    className="w-full py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Subscribe <Send size={14} /></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs text-text-muted hover:text-text transition-colors pt-1"
                  >
                    No thanks, I'll pass
                  </button>
                </form>
              )}
            </div>

            <div className="px-8 py-4 bg-surface/50 border-t border-line">
              <p className="text-[11px] text-text-muted text-center">
                By subscribing, you agree to receive emails from Omar Khecharem. View the{' '}
                <a href="/privacy" onClick={handleDismiss} className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
