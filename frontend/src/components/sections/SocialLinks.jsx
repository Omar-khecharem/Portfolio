import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profileApi } from '../../services/api';
import { Github, Linkedin, Facebook, Instagram } from 'lucide-react';

const PLATFORMS = [
  { key: 'github', icon: Github, label: 'GitHub', color: '#333' },
  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
  { key: 'facebook', icon: Facebook, label: 'Facebook', color: '#1877F2' },
  { key: 'instagram', icon: Instagram, label: 'Instagram', color: '#E4405F' },
];

export default function SocialLinks() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    profileApi.get().then(setProfile).catch(() => {});
  }, []);

  const social = profile?.social || {};
  const available = PLATFORMS.filter(p => social[p.key]);

  if (available.length === 0) return null;

  return (
    <section className="py-section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="section-label gradient-text-alt font-bold">Connect</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Find Me Online</h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            Let's connect on your preferred platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          className="flex flex-wrap justify-center gap-4"
        >
          {available.map((platform) => {
            const Icon = platform.icon;
            const url = social[platform.key];
            return (
              <motion.a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex flex-col items-center gap-3 p-6 sm:p-8 w-36 sm:w-40 bg-surface border border-line rounded-2xl hover:border-accent/30 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                  style={{ background: `${platform.color}15`, color: platform.color }}
                >
                  <Icon size={22} />
                </div>
                <span className="text-sm font-semibold text-text group-hover:text-accent transition-colors duration-300">
                  {platform.label}
                </span>
                <span className="text-[10px] text-text-muted/60 group-hover:text-text-muted transition-colors duration-300">
                  @{url?.split('/').filter(Boolean).pop() || platform.label}
                </span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
