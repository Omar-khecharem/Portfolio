import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import { TECH_COLORS } from '../../config/navigation';

function getTechColor(tech) {
  const key = tech.toLowerCase();
  return TECH_COLORS[key] || null;
}

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  const label = (s) => s?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-surface border border-line rounded-2xl shadow-2xl"
        >
          <button onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X size={15} />
          </button>

          {project.image && (
            <div className="relative w-full aspect-video bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {project.category && (
                  <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1.5">
                    {label(project.category)}
                  </p>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-text leading-snug">{project.title}</h2>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-accent transition-colors">
                    <Github size={16} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-accent transition-colors">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {project.status && (
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-medium ${
                  project.status === 'completed' ? 'bg-green-500/12 text-green-600' :
                  project.status === 'in-progress' ? 'bg-yellow-500/12 text-yellow-600' : 'bg-blue-500/12 text-blue-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    project.status === 'completed' ? 'bg-green-500 animate-pulse' :
                    project.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500 animate-pulse'
                  }`} />
                  {label(project.status)}
                </span>
              </div>
            )}

            <p className="text-sm text-text-muted leading-relaxed mb-4">{project.description}</p>

            {project.longDescription && (
              <div className="mb-5">
                <p className="text-sm text-text leading-relaxed">{project.longDescription}</p>
              </div>
            )}

            {project.highlights?.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">Key Highlights</p>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.technologies?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2.5">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => {
                    const color = getTechColor(t);
                    return (
                      <span key={t}
                        className="inline-flex items-center gap-1 text-[12px] px-3 py-1.5 rounded-lg font-medium"
                        style={{
                          background: color ? `${color}18` : 'var(--clr-surface)',
                          color: color || 'var(--clr-text-muted)',
                          border: `1px solid ${color ? `${color}30` : 'var(--clr-line)'}`,
                        }}
                      >
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
