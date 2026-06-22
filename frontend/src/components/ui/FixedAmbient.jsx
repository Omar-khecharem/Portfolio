import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const ORB_BASE = [
  { size: 520, x: '8%', y: '15%', blur: 100, delay: 0, color: 'var(--clr-primary)' },
  { size: 440, x: '72%', y: '55%', blur: 90, delay: 3, color: 'var(--clr-accent)' },
  { size: 380, x: '50%', y: '78%', blur: 85, delay: 5, color: 'var(--clr-secondary)' },
  { size: 480, x: '82%', y: '8%', blur: 95, delay: 1.5, color: 'var(--clr-accent)' },
  { size: 300, x: '30%', y: '45%', blur: 75, delay: 7, color: 'var(--clr-primary)' },
];

const SHAPE_BASE = [
  { w: 28, h: 28, x: '8%', y: '22%', rotate: 0, delay: 0, type: 'square' },
  { w: 52, h: 28, x: '72%', y: '15%', rotate: 15, delay: 2, type: 'rect' },
  { w: 22, h: 22, x: '88%', y: '70%', rotate: 45, delay: 1.5, type: 'diamond' },
  { w: 64, h: 24, x: '3%', y: '68%', rotate: -8, delay: 3, type: 'rect' },
  { w: 32, h: 32, x: '45%', y: '8%', rotate: 30, delay: 4, type: 'hexagon' },
  { w: 20, h: 20, x: '60%', y: '88%', rotate: 0, delay: 2.5, type: 'circle' },
  { w: 80, h: 20, x: '35%', y: '55%', rotate: 25, delay: 5, type: 'rect' },
  { w: 26, h: 26, x: '92%', y: '38%', rotate: 10, delay: 1, type: 'diamond' },
  { w: 40, h: 20, x: '18%', y: '48%', rotate: -12, delay: 4.5, type: 'rect' },
  { w: 30, h: 30, x: '55%', y: '32%', rotate: 90, delay: 3.5, type: 'hexagon' },
  { w: 16, h: 16, x: '25%', y: '82%', rotate: 0, delay: 6, type: 'circle' },
  { w: 48, h: 16, x: '75%', y: '78%', rotate: 35, delay: 0.5, type: 'rect' },
  { w: 24, h: 24, x: '50%', y: '65%', rotate: 60, delay: 2.8, type: 'triangle' },
  { w: 36, h: 18, x: '10%', y: '40%', rotate: -20, delay: 5.5, type: 'rect' },
  { w: 18, h: 18, x: '68%', y: '45%', rotate: 15, delay: 1.2, type: 'pentagon' },
];

function getClipPath(type) {
  switch (type) {
    case 'triangle': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
    case 'diamond':  return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'hexagon':  return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'pentagon': return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
    case 'circle':   return 'circle(50%)';
    default:         return 'none';
  }
}

const DEFAULTS = {
  enabled: true, orbs: true, shapes: true, particles: true, mouseParallax: true,
  orbsSpeed: 1, shapesSpeed: 1, particlesDensity: 35,
  orbsOpacity: 0.25, shapesOpacity: 0.12, blurIntensity: 1,
};

export default function FixedAmbient() {
  const { theme } = useTheme();
  const a = theme?.animations?.ambient || DEFAULTS;

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!a.mouseParallax) return;
    const onMouse = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouse({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, [a.mouseParallax]);

  const particles = useMemo(() =>
    Array.from({ length: a.particlesDensity }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 18 + 14,
      delay: Math.random() * -30,
      opacity: Math.random() * 0.3 + 0.15,
    })),
  [a.particlesDensity]);

  if (!a.enabled) return null;

  const blurMul = a.blurIntensity;
  const orbOp = a.orbsOpacity;
  const shapeOp = a.shapesOpacity;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      {a.orbs && ORB_BASE.map((o, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: o.size, height: o.size,
            left: o.x, top: o.y,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: `blur(${o.blur * blurMul}px)`,
            opacity: orbOp,
            willChange: 'transform',
          }}
          animate={{
            x: [mouse.x * 30, mouse.x * 30 + 40, mouse.x * 30 - 30, mouse.x * 30 + 50, mouse.x * 30],
            y: [mouse.y * 30, mouse.y * 30 - 50, mouse.y * 30 + 35, mouse.y * 30 + 25, mouse.y * 30],
            scale: [1, 1.08, 0.92, 1.04, 1],
          }}
          transition={{
            duration: 22 / a.orbsSpeed,
            delay: o.delay, repeat: Infinity, ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        />
      ))}

      {a.shapes && SHAPE_BASE.map((s, i) => {
        const isRect = s.type === 'rect';
        return (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              width: s.w, height: s.h,
              left: s.x, top: s.y,
              clipPath: !isRect && s.type !== 'square' && s.type !== 'circle' ? getClipPath(s.type) : undefined,
              borderRadius: s.type === 'circle' ? '50%' : isRect || s.type === 'square' ? 2 : undefined,
              background: isRect || s.type === 'square'
                ? `linear-gradient(${45 + i * 30}deg, var(--clr-accent), var(--clr-primary))`
                : s.type === 'circle'
                ? `radial-gradient(circle at 30% 30%, var(--clr-accent), transparent)`
                : s.type === 'triangle'
                ? `linear-gradient(135deg, var(--clr-primary), var(--clr-secondary))`
                : s.type === 'hexagon'
                ? `linear-gradient(45deg, var(--clr-accent), var(--clr-primary))`
                : `linear-gradient(225deg, var(--clr-primary), var(--clr-accent))`,
              opacity: shapeOp,
              willChange: 'transform',
            }}
            animate={{
              y: [0, -25, 12, -18, 0],
              rotate: [s.rotate, s.rotate + 180, s.rotate + 360],
              opacity: [shapeOp * 0.5, shapeOp * 1.6, shapeOp * 0.7, shapeOp * 1.3, shapeOp * 0.5],
            }}
            transition={{
              duration: 13 / a.shapesSpeed,
              delay: s.delay, repeat: Infinity, ease: 'easeInOut',
              times: [0, 0.4, 0.7, 0.9, 1],
            }}
          />
        );
      })}

      {a.particles && particles.map((p) => (
        <div
          key={`p-${p.id}`}
          className="particle-dot"
          style={{
            width: p.size, height: p.size,
            left: `${p.left}%`, bottom: '-10px',
            background: 'var(--clr-text)',
            '--p-opacity': p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
