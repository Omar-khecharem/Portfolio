import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileApi } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import GeoShapes from '../ui/GeoShapes';

export default function Hero() {
  const [profile, setProfile] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    profileApi.get()
      .then(setProfile)
      .catch(() => setProfile({
        name: 'Omar KHECHAREM',
        title: 'Full-Stack Developer (MERN) | AI Enthusiast | Engineering Student',
        shortBio: 'Engineering student passionate about full-stack development, AI integration, and building digital products.',
        available: true,
      }));
  }, []);

  const hero = theme?.hero || {};
  const bgType = hero.backgroundType || 'gradient';
  const images = hero.images?.length > 0 ? hero.images : (hero.imageUrl ? [hero.imageUrl] : []);
  const hasSlideshow = bgType === 'image' && images.length > 1;
  const transitionDuration = (hero.imageTransitionDuration || 5) * 1000;

  useEffect(() => {
    if (!hasSlideshow) return;
    intervalRef.current = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, transitionDuration);
    return () => clearInterval(intervalRef.current);
  }, [hasSlideshow, images.length, transitionDuration]);

  useEffect(() => {
    if (bgType !== 'image' || images.length === 0) return;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [bgType, images]);

  const imgPos = hero.imagePosition || 'center';
  const blur = hero.blur || 0;
  const brightness = hero.brightness || 1;
  const currentImg = bgType === 'image' && images.length > 0 ? images[imgIndex % images.length] : null;

  let bgStyle = {};
  if (bgType === 'gradient') {
    bgStyle = { background: `linear-gradient(135deg, ${hero.gradientStart || '#0a0a23'}, ${hero.gradientEnd || '#1a1a3e'})` };
  } else if (bgType === 'color') {
    bgStyle = { backgroundColor: hero.backgroundColor || '#0a0a23' };
  }

  const hasMedia = currentImg || (bgType === 'video' && hero.videoUrl);

  if (!profile) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={bgStyle}>
      {bgType === 'image' && images.length > 0 && (
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${currentImg})`,
                backgroundSize: 'cover',
                backgroundPosition: imgPos,
                filter: `blur(${blur}px) brightness(${brightness})`,
              }}
            />
          </AnimatePresence>
          {hasSlideshow && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === imgIndex ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {bgType === 'video' && hero.videoUrl && (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: `blur(${blur}px) brightness(${brightness})` }}>
          <source src={hero.videoUrl} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${hero.overlay || 0.6})` }} />
      {!hasMedia && <div className="absolute inset-0 geo-grid opacity-[0.08]" />}

      <GeoShapes />


      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-16 md:py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/80 text-[10px] sm:text-xs font-semibold tracking-[2px] sm:tracking-[4px] uppercase mb-4 sm:mb-6 max-w-xs sm:max-w-none mx-auto"
        >
          {(profile.title || 'Full-Stack Developer & AI Enthusiast').split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
              className="inline"
            >{char === ' ' ? '\u00A0' : char}</motion.span>
          ))}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 leading-[1.1]"
        >
          <span className="whitespace-nowrap">{profile.name.split(' ')[0]}</span>
          <br />
          <span className="text-white/60 font-light whitespace-nowrap">{profile.name.split(' ').slice(1).join(' ')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-sm sm:text-base md:text-lg text-white/70 max-w-xs sm:max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed"
        >
          {profile.shortBio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
        >
          <a href="/contact" className="btn btn-primary bg-white !text-primary hover:!bg-accent hover:!text-white text-xs sm:text-sm w-full sm:w-auto text-center">
            Hire Me
          </a>
          <a href="/projects" className="btn btn-outline !border-white !text-white hover:!bg-white hover:!text-primary text-xs sm:text-sm w-full sm:w-auto text-center">
            View Projects
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-2 text-white/30 text-xs"
        >
          {profile.available && (
            <>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Available for freelance & internships
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
