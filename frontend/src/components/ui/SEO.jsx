import { useEffect } from 'react';

const SITE = 'https://omar-khecharem.vercel.app';
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

export default function SEO({ title, description, path, image, type = 'website' }) {
  const url = `${SITE}${path || '/'}`;
  const img = image || DEFAULT_IMAGE;
  const fullTitle = title ? `${title} — Omar Khecharem` : 'Omar Khecharem — Full-Stack Developer & AI Enthusiast';
  const desc = description || "Portfolio of Omar Khecharem, Full-Stack Developer (MERN) and AI Enthusiast based in Ariana, Tunisia. Available for freelance and internships.";

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, prop = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${prop}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(prop, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', desc);
    setMeta('title', fullTitle);
    setMeta('keywords', "Omar Khecharem, full-stack developer, MERN, React, Node.js, AI, portfolio, Tunisia, freelance, web developer");

    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', img, 'property');
    setMeta('og:type', type, 'property');

    setMeta('twitter:title', fullTitle, 'property');
    setMeta('twitter:description', desc, 'property');
    setMeta('twitter:url', url, 'property');
    setMeta('twitter:image', img, 'property');
    setMeta('twitter:card', 'summary_large_image', 'property');

    const link = document.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute('href', url);

    return () => {
      document.title = 'Omar Khecharem — Full-Stack Developer & AI Enthusiast';
    };
  }, [title, description, path, image, type, fullTitle, desc, url, img]);

  return null;
}
