import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { projectsApi, profileApi } from '../services/api';
import SEO from '../components/ui/SEO';
import { ExternalLink, Github, FolderKanban } from 'lucide-react';
import ProjectDetailModal from '../components/ui/ProjectDetailModal';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const TECH_COLORS = {
  react: '#61DAFB', 'next.js': '#000000', vue: '#4FC08D', angular: '#DD0031',
  'node.js': '#339933', express: '#000000', django: '#092E20', flask: '#000000',
  mongodb: '#47A248', postgresql: '#4169E1', mysql: '#4479A1', redis: '#DC382D',
  typescript: '#3178C6', javascript: '#F7DF1E', python: '#3776AB', java: '#ED8B00',
  tailwind: '#06B6D4', css: '#1572B6', html: '#E34F26', sass: '#CC6699',
  docker: '#2496ED', aws: '#FF9900', gcp: '#4285F4', firebase: '#FFCA28',
  tensorflow: '#FF6F00', pytorch: '#EE4C2C', openai: '#412991', langchain: '#1C3C3C',
  graphql: '#E10098', nginx: '#009639', linux: '#FCC624',
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

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCat, setActiveCat] = useState('all');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    Promise.all([
      projectsApi.list().then(setProjects).catch(() => {}),
      profileApi.get().then(p => setCategories(p.projectCategories || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filterTags = ['all', ...categories];
  const label = (s) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const filtered = activeCat === 'all' ? projects : projects.filter((p) => p.category === activeCat);

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pt-24">
      <SEO
        title="Projects"
        description="Explore Omar Khecharem's portfolio of full-stack applications, AI experiments, and freelance web development projects built with React, Node.js, MongoDB, and more."
        path="/projects"
      />
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
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  activeCat === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface text-text-muted hover:text-text border border-line hover:border-text-muted/30'
                }`}
              >{label(cat)}</motion.button>
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
            {filtered.map((p) => {
              const isExpanded = expanded[p._id];
              const descLong = p.description?.length > 100;

              return (
                <motion.div key={p._id} variants={item}
                  onClick={() => setSelected(p)}
                  className="group relative bg-surface border border-line rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-500 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] overflow-hidden">
                    {p.image ? (
                      <>
                        <img src={p.image} alt={p.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderKanban size={36} className="text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                      </div>
                    )}
                    {/* Status badge */}
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
                    {/* Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                          <Github size={14} />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-wider text-text-muted/70 font-semibold mb-1.5">
                      {label(p.category || 'uncategorized')}
                    </p>
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

                    {/* Tech tags */}
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

          {filtered.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-text-muted py-20 text-sm">
              No projects found in this category.
            </motion.p>
          )}
        </div>
      </section>

      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
