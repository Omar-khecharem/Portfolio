import { motion } from 'framer-motion';
import SEO from '../components/ui/SEO';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="pt-24">
      <SEO title="Page Not Found" description="The page you are looking for does not exist or has been moved." path="*" />
      <section className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[120px] sm:text-[160px] font-bold leading-none text-primary/20 select-none">
              404
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl font-bold text-primary mt-[-20px]"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-text/70 mt-3 leading-relaxed text-sm sm:text-base"
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
          >
            <a href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-accent transition-colors"
            ><Home size={15} /> Go Home</a>
            <button onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-line text-text text-sm font-medium rounded-lg hover:bg-surface transition-colors"
            ><ArrowLeft size={15} /> Go Back</button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 flex justify-center gap-6 text-text-muted"
          >
            {[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <a key={link.label} href={link.href}
                className="text-xs font-medium hover:text-primary transition-colors"
              >{link.label}</a>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
