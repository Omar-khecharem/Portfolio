import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
          <a href="/" className="group relative logo-container text-xl md:text-2xl font-extrabold tracking-tight">
            <span className="relative inline-flex">
              <span className="logo-char" style={{ animationDelay: '0s' }}>O</span>
              <span className="logo-char" style={{ animationDelay: '0.06s' }}>M</span>
              <span className="logo-char" style={{ animationDelay: '0.12s' }}>A</span>
              <span className="logo-char" style={{ animationDelay: '0.18s' }}>R</span>
              <span className={`logo-dot ${navDark ? 'text-white/80' : 'text-accent'}`}>.</span>
            </span>
            <span className="logo-shimmer" />
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
          className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${navDark ? 'text-white bg-white/15 hover:bg-white/25' : 'text-text bg-surface border border-line hover:bg-line'}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
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
