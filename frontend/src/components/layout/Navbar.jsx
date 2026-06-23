import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grip, X } from 'lucide-react';
import { ease } from '../../utils/animations';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navDark = isHome && !scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${navDark ? '' : 'glass-deep'} ${navDark ? 'nav-dark' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <a href="/" className="text-lg font-bold tracking-tight">
            OMAR<span className={navDark ? 'text-white/80' : 'text-accent'}>.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
            <a key={l.to} href={l.to} className={`text-sm font-medium transition-colors nav-link ${navDark ? '' : 'text-text-muted hover:text-text'}`}>
              {l.label}
            </a>
          ))}
          <a href="/contact" className="btn btn-primary !py-2 !px-5 text-sm text-white">Hire Me</a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${navDark ? 'text-white bg-white/8 border border-white/12 hover:bg-white/15' : 'text-text bg-black/5 border border-black/8 hover:bg-black/10'}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0, scale: open ? 0.85 : 1 }}
            transition={{ duration: 0.35, ease }}
          >
            {open ? <X size={20} /> : <Grip size={20} />}
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
            className={`md:hidden overflow-hidden border-t backdrop-blur-xl ${navDark ? 'border-white/20' : 'border-line'}`}
            style={{ background: navDark ? 'rgba(0,0,0,0.15)' : 'var(--clr-surface)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {links.map((l) => (
                <a key={l.to} href={l.to} onClick={() => setOpen(false)}
                  className={`py-2 text-sm font-medium transition-colors ${navDark ? 'text-white/70 hover:text-white' : 'text-text-muted hover:text-text'}`}
                >{l.label}</a>
              ))}
              <a href="/contact" onClick={() => setOpen(false)}
                className="btn btn-primary !py-2.5 text-sm text-center mt-2 text-white">Hire Me</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
