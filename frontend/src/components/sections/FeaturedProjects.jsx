import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsApi } from '../../services/api';
import { ExternalLink, Github } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectsApi.list({ featured: true })
      .then(setProjects)
      .catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="section-label">Portfolio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Selected Projects</h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            A selection of featured work in full-stack development and AI.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {projects.map((p) => (
            <motion.div
              key={p._id}
              variants={item}
              className="card rounded-lg overflow-hidden group"
            >
              <div className="h-36 sm:h-44 bg-surface geo-dot flex items-center justify-center relative overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <span className="text-5xl font-bold text-primary/5 select-none">{p.title.charAt(0)}</span>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-white/80 hover:bg-white rounded transition-colors">
                      <Github size={13} />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-white/80 hover:bg-white rounded transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                  <h3 className="font-semibold text-base text-text mb-2">{p.title}</h3>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies?.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-surface text-text-muted rounded font-medium">{t}</span>
                  ))}
                  {p.technologies?.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 bg-surface text-text-muted rounded font-medium">+{p.technologies.length - 3}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a href="/projects" className="btn btn-outline text-sm">View All Projects</a>
        </motion.div>
      </div>
    </section>
  );
}
