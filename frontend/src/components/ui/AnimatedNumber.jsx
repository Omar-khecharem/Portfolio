import { useState, useEffect } from 'react';
import { useIntersect } from '../../hooks/useIntersect';

export default function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const [ref, inView] = useIntersect();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const end = Math.max(0, parseInt(value) || 0);
    if (end === 0) { setCount(0); return; }
    const duration = 1200;
    const step = Math.max(1, Math.floor(end / 60));
    const interval = duration / Math.max(1, end / step);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(current);
    }, interval);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}
