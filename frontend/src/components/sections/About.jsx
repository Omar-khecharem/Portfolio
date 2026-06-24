import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profileApi, certificationsApi } from '../../services/api';
import { useIntersect } from '../../hooks/useIntersect';
import AnimatedNumber from '../ui/AnimatedNumber';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [certs, setCerts] = useState([]);
  const [ref, inView] = useIntersect();

  useEffect(() => { profileApi.get().then(setProfile).catch(() => {}); }, []);
  useEffect(() => { certificationsApi.list().then(setCerts).catch(() => {}); }, []);

  if (!profile) return null;

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const stats = [
    { label: 'Experience', value: profile.stats?.experienceYears || 0, suffix: '+ yrs' },
    { label: 'Projects', value: profile.stats?.projectCount || 0, suffix: '+' },
    { label: 'Certifications', value: certs.length || 0 },
    { label: 'Languages', value: profile.languages?.length || 0 },
  ];

  return (
    <section className="py-section" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label gradient-text-alt font-bold">About</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{profile.name}</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{profile.title}</p>
        </motion.div>

          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden border border-line bg-surface">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center geo-dot">
                  <span className="text-6xl md:text-7xl font-bold text-primary/10 select-none">{initials}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3"
          >
            <p className="text-text-muted leading-relaxed text-base mb-8">
              {profile.bio || profile.shortBio}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center p-4 bg-surface border border-line rounded-lg card-enhanced">
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    <AnimatedNumber value={s.value} suffix={s.suffix || ''} />
                  </p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/contact" className="btn btn-primary text-sm w-full sm:w-auto text-center">Let&apos;s Work Together</a>
              <a href="/about" className="btn btn-outline text-sm w-full sm:w-auto text-center">Full Bio</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
