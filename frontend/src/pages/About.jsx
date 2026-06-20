import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileApi } from '../services/api';
import api from '../services/api';
import { MapPin, Mail, Award, Download, ExternalLink, X, User } from 'lucide-react';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [certs, setCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    profileApi.get().then(setProfile).catch(() => {});
    api.get('/certifications').then(r => setCerts(r.data)).catch(() => {});
  }, []);

  if (!profile) return null;

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="pt-24">
      <section className="py-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/5 flex items-center justify-center">
              <User size={26} className="text-primary" />
            </motion.div>
            <p className="section-label">About Me</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Who I Am</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-5 gap-8 md:gap-12"
          >
            <div className="md:col-span-2">
              <div className="sticky top-28">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-line bg-surface mb-6">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center geo-dot">
                      <span className="text-7xl font-bold text-primary/10 select-none">{initials}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm text-text-muted">
                  <p className="flex items-center gap-2"><MapPin size={14} /> {profile.location}</p>
                  <p className="flex items-center gap-2"><Mail size={14} /> {profile.email}</p>
                  <p className="flex items-center gap-2"><Award size={14} /> {certs.length} certification{certs.length !== 1 ? 's' : ''}</p>
                  {profile.available && (
                    <p className="flex items-center gap-2 text-green-600 font-medium text-xs mt-3">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Available for freelance &amp; internships
                    </p>
                  )}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <a href="/contact" className="btn btn-primary text-sm w-full sm:w-auto justify-center">Hire Me</a>
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline text-sm w-full sm:w-auto justify-center"><Download size={14} /> See My CV</a>
                  ) : (
                    <span className="btn btn-outline text-sm w-full sm:w-auto justify-center opacity-40 cursor-not-allowed"><Download size={14} /> See My CV</span>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <p className="section-label">About</p>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">{profile.name}</h1>
              <p className="text-text-muted text-base mb-6">{profile.title}</p>
              <p className="text-text-muted leading-relaxed mb-8">{profile.bio || profile.shortBio}</p>

              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((l) => (
                    <span key={l.name} className="px-3 py-1.5 bg-white border border-line rounded text-sm">
                      {l.name} <span className="text-text-muted text-xs">({l.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              {certs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-4">Certifications</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {certs.map((c, i) => (
                      <motion.div key={c._id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="card rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => c.image && setSelectedCert(c)}
                      >
                        {c.image && (
                          <div className="h-32 bg-surface overflow-hidden">
                            <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                          </div>
                        )}
                        <div className="p-4 flex items-start gap-3">
                          {!c.image && <Award size={18} className="text-accent flex-shrink-0 mt-0.5" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text">{c.name}</p>
                            <p className="text-xs text-text-muted mt-0.5">{c.issuer}</p>
                            {c.date && <p className="text-[10px] text-text-muted/60 mt-1">{c.date}</p>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X size={16} />
              </button>
              {selectedCert.image && (
                <img src={selectedCert.image} alt={selectedCert.name} className="w-full max-h-[70vh] object-contain bg-[#fafaf8]" />
              )}
              <div className="p-5">
                <h3 className="text-base font-semibold text-[#0a0a23]">{selectedCert.name}</h3>
                <p className="text-sm text-[#6b7280] mt-1">{selectedCert.issuer}</p>
                {selectedCert.date && <p className="text-xs text-[#6b7280]/60 mt-1">{selectedCert.date}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
