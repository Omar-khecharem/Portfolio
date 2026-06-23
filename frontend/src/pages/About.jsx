import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileApi, certificationsApi } from '../services/api';
import SEO from '../components/ui/SEO';
import { MapPin, Mail, Award, Download, ExternalLink, X, Calendar } from 'lucide-react';

export default function About() {
  const [profile, setProfile] = useState(null);
  const [certs, setCerts] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    profileApi.get().then(setProfile).catch(() => {});
    certificationsApi.list().then(setCerts).catch(() => {});
  }, []);

  if (!profile) return null;

  const initials = profile.name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const titleDesc = profile.title || 'Full-Stack Developer & AI Enthusiast';
  const bioDesc = profile.bio || profile.shortBio || '';

  return (
    <div className="pt-24">
      <SEO
        title={profile.name}
        description={`Learn more about ${profile.name}, ${titleDesc}. ${bioDesc.slice(0, 150)}`}
        path="/about"
      />
      <section className="py-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[3px] text-accent mb-3">About Me</p>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Who I Am</h1>
          </motion.div>

          <div className="lg:grid lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left: Image + Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-4 mb-10 lg:mb-0"
            >
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-accent/30 via-primary/20 to-transparent rounded-2xl blur-sm" />
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-line bg-surface shadow-lg">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                        <span className="text-7xl font-bold text-primary/10 select-none">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-primary" />
                    </span>
                    <span>{profile.location || 'Ariana, Tunisia'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={14} className="text-primary" />
                    </span>
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award size={14} className="text-primary" />
                    </span>
                    <span>{certs.length} Certification{certs.length !== 1 ? 's' : ''}</span>
                  </div>
                  {profile.available && (
                    <div className="flex items-center gap-2 pt-1 text-xs font-medium text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Available for freelance & internships
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <a href="/contact" className="flex-1 btn btn-primary text-sm justify-center">Hire Me</a>
                  {profile.resumeUrl ? (
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex-1 btn btn-outline text-sm justify-center">
                      <Download size={14} /> CV
                    </a>
                  ) : (
                    <span className="flex-1 btn btn-outline text-sm justify-center opacity-40 cursor-not-allowed">
                      <Download size={14} /> CV
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-8"
            >
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[3px] text-accent mb-2">About</p>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">{profile.name}</h2>
                <p className="text-sm text-text-muted mb-5">{profile.title}</p>
                <p className="text-text-muted leading-relaxed text-[15px]">
                  {profile.bio || profile.shortBio}
                </p>
              </div>

              {/* Languages */}
              {profile.languages?.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[3px] text-text-muted mb-3">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((l) => (
                      <span key={l.name} className="px-3 py-1.5 bg-surface border border-line rounded-lg text-sm font-medium">
                        {l.name}
                        <span className="text-text-muted text-xs ml-1">({l.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[3px] text-text-muted mb-3">Certifications</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {certs.map((c, i) => (
                      <motion.button
                        key={c._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => c.image && setSelectedCert(c)}
                        className="group flex items-start gap-3 p-4 rounded-xl bg-surface border border-line text-left hover:border-accent/30 hover:shadow-sm transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {c.image ? (
                            <img src={c.image} alt="" className="w-full h-full object-cover rounded-lg"
                              onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <Award size={16} className="text-accent" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text truncate group-hover:text-accent transition-colors">{c.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{c.issuer}</p>
                          {c.date && (
                            <p className="text-[11px] text-text-muted/60 mt-1 flex items-center gap-1">
                              <Calendar size={10} /> {c.date}
                            </p>
                          )}
                        </div>
                        {c.credentialUrl && (
                          <ExternalLink size={13} className="text-text-muted/40 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedCert(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                <X size={15} />
              </button>
              {selectedCert.image && (
                <div className="w-full bg-[#fafaf8]">
                  <img src={selectedCert.image} alt={selectedCert.name}
                    className="w-full max-h-[65vh] object-contain mx-auto" />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-base font-semibold text-[#0a0a23]">{selectedCert.name}</h3>
                <p className="text-sm text-[#6b7280] mt-1">{selectedCert.issuer}</p>
                {selectedCert.date && <p className="text-xs text-[#6b7280]/60 mt-1">{selectedCert.date}</p>}
                {selectedCert.credentialUrl && (
                  <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#0a0a23] text-white text-sm font-medium rounded-lg hover:bg-[#e94560] transition-colors"
                  ><ExternalLink size={14} /> View Credential</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
