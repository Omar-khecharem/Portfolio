import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { profileApi } from '../../services/api';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    profileApi.get()
      .then((data) => setSkills(data.skills || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const groups = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'ai', label: 'AI & Data' },
    { key: 'tools', label: 'Tools & Methods' },
  ];

  return (
    <section className="py-section bg-surface" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label">Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Skills</h2>
          <p className="text-text-muted mt-3">Technologies I work with daily.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {groups.map((g) => {
            const items = skills.filter((s) => s.category === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5">{g.label}</h3>
                <div className="space-y-4">
                  {items.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-xs text-text-muted">{s.level}%</span>
                      </div>
                      <div className="skill-track">
                        <div
                          className="skill-fill"
                          style={{ width: visible ? `${s.level}%` : '0%', backgroundColor: s.color || 'var(--clr-accent)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
