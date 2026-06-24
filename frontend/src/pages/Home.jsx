import SEO from '../components/ui/SEO';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Experience from '../components/sections/Experience';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import Skills from '../components/sections/Skills';
import Certifications from '../components/sections/Certifications';
import SocialLinks from '../components/sections/SocialLinks';

export default function Home() {
  return (
    <>
      <SEO
        title="Full-Stack Developer & AI Enthusiast"
        description="Portfolio of Omar Khecharem, Full-Stack Developer (MERN) and AI Enthusiast. Discover my projects, skills, and experience in web development and artificial intelligence."
        path="/"
      />
      <Hero />
      <About />
      <Experience />
      <FeaturedProjects />
      <Skills />
      <Certifications />
      <SocialLinks />
    </>
  );
}
