export const NAV_ACTIONS = [
  { keywords: ['contact', 'email', 'hire', 'freelance', 'get in touch', 'reach out'], label: 'Go to Contact', path: '/contact' },
  { keywords: ['project', 'projects', 'portfolio', 'project section'], label: 'View Projects', path: '/projects' },
  { keywords: ['about', 'biography', 'background', 'who is omar'], label: 'About Omar', path: '/about' },
  { keywords: ['skill', 'skills', 'technologie', 'tech stack', 'technologies'], label: 'View Skills', path: '/' },
  { keywords: ['experience', 'experiences', 'work history', 'professional'], label: 'View Experience', path: '/' },
  { keywords: ['certification', 'certifications', 'certificate', 'certificates'], label: 'View Certifications', path: '/' },
  { keywords: ['education', 'study', 'studies', 'degree', 'academic'], label: 'View Education', path: '/about' },
  { keywords: ['service', 'services', 'offer', 'offering'], label: 'View Services', path: '/contact' },
];

export const SOCIAL_ICONS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
];

export const ADMIN_QUICK_ACTIONS = [
  { label: 'Edit Profile', tab: 'profile' },
  { label: 'Add Project', tab: 'projects' },
  { label: 'Add Certification', tab: 'certs' },
  { label: 'Customize Theme', tab: 'theme' },
];

export const TECH_COLORS = {
  react: '#61DAFB', 'next.js': '#000000', vue: '#4FC08D', angular: '#DD0031',
  'node.js': '#339933', express: '#000000', django: '#092E20', flask: '#000000',
  mongodb: '#47A248', postgresql: '#4169E1', mysql: '#4479A1', redis: '#DC382D',
  typescript: '#3178C6', javascript: '#F7DF1E', python: '#3776AB', java: '#ED8B00',
  tailwind: '#06B6D4', css: '#1572B6', html: '#E34F26', sass: '#CC6699',
  docker: '#2496ED', aws: '#FF9900', gcp: '#4285F4', firebase: '#FFCA28',
  tensorflow: '#FF6F00', pytorch: '#EE4C2C', openai: '#412991', langchain: '#1C3C3C',
  graphql: '#E10098', nginx: '#009639', linux: '#FCC624',
};
