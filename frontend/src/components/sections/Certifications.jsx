import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Award, Calendar, ArrowUpRight } from 'lucide-react';
import { certificationsApi } from '../../services/api';

const ease = [0.22, 1, 0.36, 1];

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    certificationsApi.list()
      .then(setCerts)
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
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="section-label gradient-text-alt font-bold">Credentials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Certifications</h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            Professional certifications that validate expertise and commitment to continuous learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {certs.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease }}
              className="group relative bg-surface border border-line rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-500 cursor-pointer"
              onClick={() => setSelected(c)}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/[0.04] to-accent/[0.04] overflow-hidden">
                {c.image ? (
                  <>
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award size={44} className="text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                  </div>
                )}
                {c.date && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm bg-white/80 text-text-muted">
                      <Calendar size={10} />
                      {c.date}
                    </span>
                  </div>
                )}
                {c.credentialUrl && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold leading-snug text-text mb-1.5 group-hover:text-accent transition-colors duration-300">
                  {c.name}
                </h3>
                <p className="text-xs text-text-muted mb-3">{c.issuer}</p>
                <div className="flex items-center gap-2 text-[11px] font-medium text-accent/80 group-hover:text-accent transition-colors duration-300">
                  <span>View details</span>
                  <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.3, ease }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.image && (
                <div className="w-full bg-surface overflow-hidden rounded-t-2xl flex items-center justify-center p-4">
                  <img src={selected.image} alt={selected.name} className="w-full max-h-[50vh] object-contain rounded-lg" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary leading-snug">{selected.name}</h3>
                    <p className="text-sm font-medium text-accent mt-1.5">{selected.issuer}</p>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface transition-colors">
                    <X size={16} />
                  </button>
                </div>
                {selected.date && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-text-muted bg-surface px-3 py-1.5 rounded-lg mt-4">
                    <Calendar size={12} />
                    {selected.date}
                  </div>
                )}
                {selected.description && (
                  <p className="text-sm text-text-muted mt-5 leading-relaxed">{selected.description}</p>
                )}
                {selected.credentialUrl && (
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={selected.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                  ><ExternalLink size={14} /> View Credential</motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
