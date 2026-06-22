import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsApi, profileApi } from '../services/api';
import { ExternalLink, Github, FolderKanban } from 'lucide-react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectsApi.list().then(setProjects).catch(() => {}),
      profileApi.get().then(p => setCategories(p.projectCategories || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filterTags = ['all', ...categories];
  const label = (s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const filtered = activeCat === 'all' ? projects : projects.filter((p) => p.category === activeCat);

  return (
    <div className="pt-24">
      <section className="py-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[3px] text-accent mb-3">Portfolio</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">All Projects</h1>
            <p className="text-text-muted mt-3 max-w-lg mx-auto text-sm">
              Full-stack applications, AI experiments, and freelance work.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-2 mb-10 flex-wrap"
          >
            {filterTags.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeCat === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-text-muted hover:text-text border border-line hover:border-text-muted/30'
                }`}
              >{label(cat)}</button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            key={activeCat}
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((p) => (
              <motion.div key={p._id} variants={item}
                className="group relative bg-surface border border-line rounded-xl overflow-hidden hover:border-accent/30 transition-all"
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                  {p.image ? (
                    <>
                      <img src={p.image} alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban size={36} className="text-primary/15" />
                    </div>
                  )}
                  {/* Status badge */}
                  {p.status && (
                    <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm ${
                      p.status === 'completed' ? 'bg-green-500/15 text-green-600' :
                      p.status === 'in-progress' ? 'bg-yellow-500/15 text-yellow-600' : 'bg-blue-500/15 text-blue-600'
                    }`}>{p.status}</span>
                  )}
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm">
                        <Github size={13} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-wider text-text-muted/70 font-semibold mb-1.5">
                    {label(p.category || 'uncategorized')}
                  </p>
                  <h3 className="font-semibold text-base text-text mb-1.5 leading-snug">{p.title}</h3>
                  <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">{p.description}</p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies?.slice(0, 4).map((t) => (
                      <span key={t}
                        className="text-[10px] px-2 py-0.5 bg-primary/5 text-text-muted rounded font-medium"
                      >{t}</span>
                    ))}
                    {p.technologies?.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary/5 text-text-muted rounded font-medium">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-text-muted py-20 text-sm">
              No projects found in this category.
            </motion.p>
          )}
        </div>
      </section>
    </div>
  );
}
