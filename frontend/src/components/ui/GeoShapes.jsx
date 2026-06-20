import { motion } from 'framer-motion';

const shapes = [
  { w: 80, h: 80, x: '10%', y: '15%', rotate: 45, border: true, delay: 0, duration: 6, moveX: 30, moveY: -20, borderRadius: 4 },
  { w: 120, h: 120, x: '75%', y: '10%', rotate: 15, border: true, delay: 1.5, duration: 8, moveX: -25, moveY: 30, borderRadius: 4 },
  { w: 60, h: 60, x: '85%', y: '60%', rotate: 0, border: false, delay: 0.8, duration: 5, moveX: 20, moveY: 25, borderRadius: '50%' },
  { w: 100, h: 100, x: '5%', y: '65%', rotate: 30, border: true, delay: 2.2, duration: 7, moveX: -20, moveY: -15, borderRadius: 4 },
  { w: 40, h: 40, x: '50%', y: '20%', rotate: 0, border: false, delay: 1, duration: 4.5, moveX: -15, moveY: 20, borderRadius: '50%' },
  { w: 70, h: 70, x: '20%', y: '75%', rotate: 60, border: true, delay: 3, duration: 6.5, moveX: 25, moveY: -25, borderRadius: 4 },
];

export default function GeoShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: s.w,
            height: s.h,
            left: s.x,
            top: s.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.25, 0.2, 0.25],
            scale: [0, 1, 1, 1],
            x: [0, s.moveX, -s.moveX * 0.5, s.moveX * 0.3, 0],
            y: [0, s.moveY, -s.moveY * 0.6, s.moveY * 0.4, 0],
            rotate: [s.rotate, s.rotate + 8, s.rotate - 4, s.rotate + 6, s.rotate],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        >
          <div
            className={`w-full h-full ${s.border ? 'border border-white/20' : 'bg-white/5'}`}
            style={{ borderRadius: s.borderRadius }}
          />
        </motion.div>
      ))}
    </div>
  );
}
