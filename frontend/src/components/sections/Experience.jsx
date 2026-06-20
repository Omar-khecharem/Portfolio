import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profileApi } from '../../services/api';

export default function Experience() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('experience');

  useEffect(() => { profileApi.get().then(setProfile).catch(() => {}); }, []);

  if (!profile) return null;

  const experience = profile.experience || [];
  const education = profile.education || [];

  return (
    <section className="py-section bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label">Background</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Experience &amp; Education</h2>
        </motion.div>

        <div className="flex justify-center gap-2 mb-12">
          {[{ key: 'experience', label: 'Experience' }, { key: 'education', label: 'Education' }].map((t) => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-medium rounded transition-all ${
                tab === t.key ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text border border-line'
              }`}
            >{t.label}</button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {(tab === 'experience' ? experience : education).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-8 pb-10 border-l border-line last:pb-0"
            >
              <div className={`timeline-dot ${tab === 'education' ? 'bg-primary' : 'bg-accent'}`} />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-text-muted">{item.period}</span>
              <h3 className="text-base font-semibold text-text mt-1">{tab === 'experience' ? item.role : item.degree}</h3>
              <p className="text-sm text-text-muted mb-2">{tab === 'experience' ? item.company : item.institution}</p>
              <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              {item.highlights?.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {item.highlights.map((h, j) => (
                    <li key={j} className="text-sm text-text-muted flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
