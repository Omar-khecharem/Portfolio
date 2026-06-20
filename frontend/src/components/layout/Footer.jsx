import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Facebook, Instagram } from 'lucide-react';
import { profileApi } from '../../services/api';

export default function Footer() {
  const [social, setSocial] = useState({});

  useEffect(() => {
    profileApi.get().then(p => setSocial(p.social || {})).catch(() => {});
  }, []);

  const SOCIAL_LINKS = [
    { icon: Github,    href: social.github },
    { icon: Linkedin,  href: social.linkedin },
    { icon: Facebook,  href: social.facebook },
    { icon: Instagram, href: social.instagram },
  ].filter(s => s.href);
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-3">OMAR<span className="text-accent">.</span></h3>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Full-Stack Developer &amp; AI Enthusiast. Building modern digital products.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">Navigate</h4>
            <div className="flex flex-col gap-2">
              {['Home', 'About', 'Projects', 'Contact'].map((label) => {
                const href = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
                return <a key={label} href={href} className="text-white/40 hover:text-white text-sm transition-colors">{label}</a>;
              })}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-4">Connect</h4>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                  <Icon size={18} />
                </a>
              ))}
              <a href="mailto:omar.khecharem@isimg.tn"
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Omar Khecharem. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="/privacy" className="text-white/30 hover:text-white transition-colors">Privacy Policy</a>
            <span>Available for freelance &amp; internships</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
