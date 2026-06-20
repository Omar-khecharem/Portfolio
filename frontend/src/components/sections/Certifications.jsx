import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import api from '../../services/api';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/certifications')
      .then((r) => setCerts(r.data))
      .catch(() => {});
  }, []);

  if (certs.length === 0) return null;

  return (
    <section className="py-section">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="section-label">Credentials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Certifications</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {certs.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => setSelected(c)}
            >
              <div className="h-36 sm:h-44 bg-surface relative overflow-hidden">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center geo-dot">
                    <div className="text-center">
                      <svg className="mx-auto mb-2 text-primary/10" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold leading-snug">{c.name}</h3>
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 p-1 text-text-muted hover:text-accent transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1">{c.issuer}</p>
                {c.date && <p className="text-[10px] text-text-muted/60 mt-2">{c.date}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <div className="w-full aspect-[16/9] bg-surface overflow-hidden rounded-t-2xl">
                  <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-primary leading-snug">{selected.name}</h3>
                  <button onClick={() => setSelected(null)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-sm font-medium text-accent mt-2">{selected.issuer}</p>
                {selected.date && <p className="text-xs text-text-muted mt-1.5">{selected.date}</p>}
                {selected.description && <p className="text-sm text-text-muted mt-4 leading-relaxed">{selected.description}</p>}
                {selected.credentialUrl && (
                  <a href={selected.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                  ><ExternalLink size={14} /> View Credential</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
