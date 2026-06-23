import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handle = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? Math.min((st / dh) * 100, 100) : 0);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9997] h-[2px] pointer-events-none">
      <div
        className="h-full transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--clr-accent), var(--clr-primary))',
          boxShadow: '0 0 8px color-mix(in srgb, var(--clr-accent) 50%, transparent)',
        }}
      />
    </div>
  );
}
