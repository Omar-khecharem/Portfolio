import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor]';
const MAGNETIC = 'a, button, [data-magnetic]';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const spring = { damping: 25, stiffness: 350, mass: 0.3 };
  const cx = useSpring(mx, spring);
  const cy = useSpring(my, spring);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setHidden(false);

    let currentTarget = null;
    let magneticTarget = null;

    const resetMagnetic = (el) => {
      if (el) { el.style.transform = ''; el.style.transition = ''; }
    };

    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (magneticTarget) {
        const r = magneticTarget.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.2;
        magneticTarget.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const enter = (e) => {
      const el = e.currentTarget;
      currentTarget = el;
      setHovered(true);
      if (el.matches(MAGNETIC)) {
        magneticTarget = el;
        el.style.transition = 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)';
      }
    };
    const leave = (e) => {
      resetMagnetic(e.currentTarget);
      currentTarget = null;
      magneticTarget = null;
      setHovered(false);
    };

    document.addEventListener('mousemove', move, { passive: true });

    const attach = (el) => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    };
    const detach = (el) => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };

    document.querySelectorAll(INTERACTIVE).forEach(attach);

    const obs = new MutationObserver(() => {
      document.querySelectorAll(INTERACTIVE).forEach((el) => {
        detach(el);
        attach(el);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    document.body.classList.add('has-custom-cursor');

    return () => {
      document.removeEventListener('mousemove', move);
      resetMagnetic(magneticTarget);
      document.querySelectorAll(INTERACTIVE).forEach(detach);
      obs.disconnect();
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: cx, y: cy, width: 6, height: 6, marginLeft: -3, marginTop: -3, background: 'var(--clr-accent)' }}
        animate={{ width: hovered ? 10 : 6, height: hovered ? 10 : 6, marginLeft: hovered ? -5 : -3, marginTop: hovered ? -5 : -3 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: cx, y: cy, width: 28, height: 28, marginLeft: -14, marginTop: -14, border: '1.5px solid rgba(233,69,96,0.4)' }}
        animate={{
          width: hovered ? 48 : 28, height: hovered ? 48 : 28,
          marginLeft: hovered ? -24 : -14, marginTop: hovered ? -24 : -14,
          scale: hovered ? 1.4 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  );
}
