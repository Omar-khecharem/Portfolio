import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'omar_cookies_accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4"
        >
          <div className="max-w-6xl mx-auto bg-white border border-line rounded-2xl shadow-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary mb-1">Cookie Consent</p>
              <p className="text-xs text-text-muted leading-relaxed">
                This website uses cookies to ensure you get the best experience. By continuing to use this site, you consent to our use of cookies in accordance with our{' '}
                <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={handleAccept}
                className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-accent transition-colors">
                Accept All
              </button>
              <button onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text border border-line rounded-xl hover:bg-surface transition-colors">
                Necessary Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
