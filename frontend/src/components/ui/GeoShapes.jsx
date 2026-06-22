import { useMemo } from 'react';
import { motion } from 'framer-motion';

function getClipPath(type) {
  switch (type) {
    case 'triangle':   return 'polygon(50% 0%, 0% 100%, 100% 100%)';
    case 'diamond':    return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    case 'hexagon':    return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
    case 'octagon':    return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
    case 'star':       return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
    case 'cross':      return 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)';
    case 'plus':       return 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)';
    case 'pentagon':   return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
    default:           return 'none';
  }
}

const TYPES = ['square', 'rectangle', 'long-rect', 'triangle', 'diamond', 'hexagon', 'octagon', 'star', 'cross', 'plus', 'pentagon', 'circle'];

function generateShapes() {
  const count = 28;
  return Array.from({ length: count }, (_, i) => {
    const type = TYPES[i % TYPES.length];
    const isRect = type === 'rectangle' || type === 'long-rect';
    const size = isRect ? 20 + Math.random() * 30 : 16 + Math.random() * 42;
    const rectW = isRect ? size * (type === 'long-rect' ? 2.8 : 1.8) : size;
    const rectH = size;
    const isLarge = (isRect ? rectW : size) > 48;

    const moveMag = isLarge ? 60 : 40;

    return {
      id: i, type,
      w: isRect ? rectW : size,
      h: isRect ? rectH : size,
      x: `${4 + Math.random() * 92}%`,
      y: `${4 + Math.random() * 88}%`,
      rotate: Math.random() * 90,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 5,
      moveX: (Math.random() - 0.5) * moveMag,
      moveY: (Math.random() - 0.5) * moveMag,
      opacity: isLarge ? 0.06 : 0.14,
      border: type === 'square' || type === 'rectangle' || type === 'long-rect',
      isLarge,
      borderRadius: type === 'square' || type === 'rectangle' || type === 'long-rect' ? 2 : undefined,
    };
  });
}

function getGradient(type) {
  const g = [
    'linear-gradient(135deg, var(--clr-accent), var(--clr-primary))',
    'linear-gradient(45deg, var(--clr-primary), var(--clr-secondary))',
    'linear-gradient(225deg, var(--clr-secondary), var(--clr-accent))',
    'linear-gradient(180deg, var(--clr-accent), transparent)',
    'linear-gradient(90deg, var(--clr-primary), var(--clr-accent))',
    'linear-gradient(135deg, var(--clr-accent), transparent)',
    'linear-gradient(45deg, var(--clr-primary), transparent)',
  ];
  return g[type.length % g.length];
}

export default function GeoShapes() {
  const shapes = useMemo(() => generateShapes(), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            width: s.w,
            height: s.h,
            left: s.x,
            top: s.y,
            clipPath: !['circle', 'square', 'rectangle', 'long-rect'].includes(s.type) ? getClipPath(s.type) : undefined,
            borderRadius: s.type === 'circle' ? '50%' : s.borderRadius,
            background: s.border ? 'transparent' : getGradient(s.type),
            border: s.border ? `1.5px solid ${s.isLarge ? 'var(--clr-accent)' : 'var(--clr-line)'}` : undefined,
            opacity: 0,
            willChange: 'transform',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, s.opacity, s.opacity * 0.6, s.opacity * 1.3, s.opacity],
            scale: [0, 1, 1.05, 0.97, 1],
            x: [0, s.moveX, -s.moveX * 0.5, s.moveX * 0.3, 0],
            y: [0, s.moveY, -s.moveY * 0.6, s.moveY * 0.4, 0],
            rotate: [s.rotate, s.rotate + 180, s.rotate + 360],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}
