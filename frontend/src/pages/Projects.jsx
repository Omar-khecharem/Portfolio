import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsApi, profileApi } from '../services/api';
import { ExternalLink, Github, FolderKanban, Briefcase } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
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

  const filtered = activeCat === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCat);

  return (
    <div className="pt-24">
      <section className="py-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/5 flex items-center justify-center">
              <Briefcase size={26} className="text-primary" />
            </motion.div>
            <p className="section-label">Portfolio</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">All Projects</h1>
            <p className="text-text-muted mt-3 max-w-lg mx-auto">
              Full-stack applications, AI experiments, and freelance work.
            </p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-10 flex-wrap sm:flex-nowrap">
            {filterTags.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeCat === cat ? 'bg-primary text-white' : 'bg-surface text-text-muted hover:text-text border border-line'}`}
              >{label(cat)}</button>
            ))}
          </div>

          <motion.div
            key={activeCat}
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((p) => (
              <motion.div key={p._id} variants={item}
                className="card rounded-lg overflow-hidden group"
              >
                <div className="h-36 sm:h-44 bg-surface geo-dot flex items-center justify-center relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <FolderKanban size={40} className="text-primary/10" />
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 bg-white/80 hover:bg-white rounded transition-colors">
                        <Github size={13} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 bg-white/80 hover:bg-white rounded transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-surface text-text-muted rounded font-medium capitalize">{p.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      p.status === 'completed' ? 'bg-green-100 text-green-700' :
                      p.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>{p.status}</span>
                  </div>
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

          {filtered.length === 0 && (
            <p className="text-center text-text-muted py-16">No projects found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
}
