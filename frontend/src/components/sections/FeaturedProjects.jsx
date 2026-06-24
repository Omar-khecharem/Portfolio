import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsApi } from '../../services/api';
import { ExternalLink, Github, Code2 } from 'lucide-react';
import { TECH_COLORS } from '../../config/navigation';
import ProjectDetailModal from '../ui/ProjectDetailModal';

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

function getTechColor(tech) {
  const key = tech.toLowerCase();
  return TECH_COLORS[key] || null;
}

function TechTag({ name }) {
  const color = getTechColor(name);
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -1 }}
      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-default"
      style={{
        background: color ? `${color}18` : 'var(--clr-surface)',
        color: color || 'var(--clr-text-muted)',
        border: `1px solid ${color ? `${color}30` : 'var(--clr-line)'}`,
      }}
    >
      {name}
    </motion.span>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    projectsApi.list({ featured: true })
      .then(setProjects)
      .catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
          <p className="section-label gradient-text-alt font-bold">Portfolio</p>
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
          {projects.map((p) => {
            const isExpanded = expanded[p._id];
            const descLong = p.description?.length > 100;

            return (
              <motion.div
                key={p._id}
                variants={item}
                onClick={() => setSelected(p)}
                className="group relative bg-surface border border-line rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-40 sm:h-44 bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] overflow-hidden">
                  {p.image ? (
                    <>
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code2 size={40} className="text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        <Github size={14} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  {p.status && (
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                        p.status === 'completed' ? 'bg-green-500/12 text-green-600' :
                        p.status === 'in-progress' ? 'bg-yellow-500/12 text-yellow-600' : 'bg-blue-500/12 text-blue-600'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          p.status === 'completed' ? 'bg-green-500 animate-pulse' :
                          p.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                        }`} />
                        {p.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base text-text mb-1.5 leading-snug group-hover:text-accent transition-colors duration-300">{p.title}</h3>
                  <div>
                    <p className={`text-sm text-text-muted leading-relaxed mb-2 ${!isExpanded && descLong ? 'line-clamp-2' : ''}`}>
                      {p.description}
                    </p>
                    {descLong && (
                      <button onClick={(e) => toggleExpand(p._id, e)}
                        className="text-[11px] font-semibold text-accent hover:text-accent/80 transition-colors"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.technologies?.slice(0, 4).map((t) => (
                      <TechTag key={t} name={t} />
                    ))}
                    {p.technologies?.length > 4 && (
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-surface text-text-muted border border-line"
                      >
                        +{p.technologies.length - 4}
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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

      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
