const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Certification = require('./models/Certification');
const Theme = require('./models/Theme');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany(),
      Profile.deleteMany(),
      Project.deleteMany(),
      Certification.deleteMany(),
      Theme.deleteMany(),
    ]);

    await User.create({
      email: process.env.ADMIN_EMAIL || 'omar.khecharem@isimg.tn',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
    });

    await Profile.create({
      name: 'Omar KHECHAREM',
      title: 'Full-Stack Developer (MERN) | AI Enthusiast | Engineering Student',
      location: 'Ariana, Tunisia',
      email: 'omar.khecharem@isimg.tn',
      shortBio: 'Engineering student passionate about full-stack development, AI integration, and building digital products.',
      bio: 'I am a software engineering student at ISIMG with a strong foundation in Mathematics, Physics, and Computer Science. My expertise spans the MERN stack, AI integration, and clean software architecture. As the winner of the ISIMG Innovation Challenge and a former intern at CERT (Telecommunications Research Center), I bring both academic rigor and practical industry experience to every project.',
      available: true,
      availability: { freelance: true, internship: true, remote: true },
      projectCategories: ['fullstack', 'ai', 'freelance', 'academic'],
      social: {
        github: 'https://github.com/Omar-khecharem',
        linkedin: 'https://linkedin.com/in/omar-khecharem-373b16241',
        facebook: 'https://www.facebook.com/omar.kcharem.39',
        instagram: 'https://www.instagram.com/omar.khecharem/',
      },
      skills: [
        { name: 'React', category: 'frontend', level: 90 },
        { name: 'Node.js', category: 'backend', level: 85 },
        { name: 'Express', category: 'backend', level: 85 },
        { name: 'MongoDB', category: 'backend', level: 80 },
        { name: 'JavaScript', category: 'frontend', level: 90 },
        { name: 'TypeScript', category: 'frontend', level: 75 },
        { name: 'Python', category: 'ai', level: 70 },
        { name: 'Java', category: 'backend', level: 65 },
        { name: 'SQL', category: 'backend', level: 70 },
        { name: 'Git/GitHub', category: 'tools', level: 90 },
        { name: 'AI Integration', category: 'ai', level: 75 },
        { name: 'Prompt Engineering', category: 'ai', level: 80 },
        { name: 'Agile/Scrum', category: 'tools', level: 75 },
        { name: 'Tailwind CSS', category: 'frontend', level: 85 },
      ],
      experience: [
        {
          role: 'Frontend & Infrastructure Intern',
          company: 'CERT (Telecommunications Research Center)',
          period: '2024',
          description: 'Developed React.js interfaces for telecom monitoring dashboards. Gained exposure to telecommunications infrastructure and R&D environment analysis.',
          highlights: ['Built production React.js interfaces', 'Telecom infrastructure exposure', 'R&D methodology experience'],
        },
        {
          role: 'Web Development Lead & Trainer',
          company: 'IoT Club ISIMG',
          period: '2024–Present',
          description: 'Leading web development training sessions covering HTML, CSS, Tailwind CSS. Mentoring students and managing HR & recruitment.',
          highlights: ['Trained 20+ students in web development', 'Curriculum design', 'HR and team management'],
        },
      ],
      education: [
        { degree: 'Engineering Degree in Software Engineering', institution: 'ISIMG', period: '2025–2028', description: 'Specialized in software engineering, system design, and AI.' },
        { degree: 'Preparatory Cycle in Mathematics, Physics, Computer Science', institution: 'ISIMG', period: '2023–2025', description: 'Intensive foundation in mathematical modeling and computer science.' },
        { degree: 'Bachelor in Mathematics', institution: 'High School', period: '2023', description: 'High school diploma with specialization in Mathematics. Mention: Bien.' },
      ],
      languages: [
        { name: 'English', level: 'Professional' },
        { name: 'French', level: 'Fluent' },
        { name: 'Arabic', level: 'Native' },
        { name: 'German', level: 'Beginner' },
      ],
      services: [
        { title: 'Full-Stack Development', description: 'End-to-end web applications using the MERN stack with clean architecture.', icon: 'code' },
        { title: 'AI Integration', description: 'Integrate AI APIs and LLMs into existing applications. Chatbots, content generation.', icon: 'brain' },
        { title: 'Technical Training', description: 'Workshops and mentoring in web development, Git, and software engineering.', icon: 'graduation' },
        { title: 'Freelance Consulting', description: 'Technical consulting for startups. Architecture review, rapid prototyping.', icon: 'briefcase' },
      ],
    });

    await Project.create([
      {
        title: 'ISIMG Innovation Challenge – Winner',
        slug: 'isimg-innovation-challenge',
        description: 'First prize winner of the ISIMG Innovation Challenge.',
        longDescription: 'Developed an innovative solution that won first prize. Demonstrated problem-solving, technical execution, and creative thinking.',
        technologies: ['React', 'Node.js', 'MongoDB', 'AI'],
        category: 'academic',
        status: 'completed',
        featured: true,
        order: 1,
        githubUrl: 'https://github.com/Omar-khecharem',
        liveUrl: 'https://portfolio-blue-rho-21.vercel.app',
        highlights: ['First Prize Winner', 'Judged by industry experts'],
      },
      {
        title: 'MERN Stack Application',
        slug: 'mern-fullstack-app',
        description: 'Full-stack application with authentication and CRUD operations.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
        category: 'fullstack',
        status: 'completed',
        featured: true,
        order: 2,
        githubUrl: 'https://github.com/Omar-khecharem/Portfolio',
        liveUrl: 'https://portfolio-blue-rho-21.vercel.app',
        highlights: ['JWT Authentication', 'RESTful API', 'Responsive UI'],
      },
      {
        title: 'AI API Integration Experiments',
        slug: 'ai-api-integration',
        description: 'Projects integrating various AI APIs into web applications.',
        technologies: ['Python', 'React', 'OpenAI', 'FastAPI'],
        category: 'ai',
        status: 'in-progress',
        featured: false,
        order: 3,
        githubUrl: 'https://github.com/Omar-khecharem',
        highlights: ['LLM Integration', 'Prompt Engineering'],
      },
    ]);

    await Certification.create([
      { name: 'AI for Anomaly Detection', issuer: 'NVIDIA', date: '2024', order: 1, credentialUrl: 'https://learn.nvidia.com/certificates' },
      { name: 'Generative AI', issuer: 'Udacity', date: '2024', order: 2, credentialUrl: 'https://www.udacity.com/certificates' },
      { name: 'Scrum Fundamentals Certified', issuer: 'Scrum Study', date: '2024', order: 3, credentialUrl: 'https://www.scrumstudy.com/certification' },
      { name: 'Google Cloud Fundamentals', issuer: 'Google', date: '2024', order: 4, credentialUrl: 'https://cloud.google.com/learn/certification' },
    ]);

    await Theme.create([
      {
        name: 'Default Dark',
        isActive: true,
        colors: { primary: '#0a0a23', secondary: '#1a1a3e', accent: '#e94560', base: '#f5f5f0', surface: '#eae8e4', text: '#16161a', textMuted: '#6e7a8a', line: '#d8d6d0' },
        spacing: { section: 120 },
        hero: { backgroundType: 'gradient', gradientStart: '#0a0a23', gradientEnd: '#1a1a3e', overlay: 0.6 },
        animations: { enabled: true, duration: 0.6 },
      },
      {
        name: 'Light Minimal',
        isActive: false,
        colors: { primary: '#1e293b', secondary: '#334155', accent: '#0ea5e9', base: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b', line: '#e2e8f0' },
        spacing: { section: 120 },
        hero: { backgroundType: 'gradient', gradientStart: '#1e293b', gradientEnd: '#334155', overlay: 0.5 },
        animations: { enabled: true, duration: 0.6 },
      },
      {
        name: 'Ocean Blue',
        isActive: false,
        colors: { primary: '#1e3a5f', secondary: '#2c5282', accent: '#f6ad55', base: '#f4f8fb', surface: '#e6eef7', text: '#0c1929', textMuted: '#5a7a96', line: '#ccddee' },
        spacing: { section: 120 },
        hero: { backgroundType: 'gradient', gradientStart: '#1e3a5f', gradientEnd: '#2c5282', overlay: 0.5 },
        animations: { enabled: true, duration: 0.6 },
      },
      {
        name: 'Forest',
        isActive: false,
        colors: { primary: '#1a3c34', secondary: '#2d6a4f', accent: '#d4a373', base: '#f2f9f4', surface: '#e3f0e8', text: '#0d1f1a', textMuted: '#4d7c6b', line: '#c8dfd3' },
        spacing: { section: 120 },
        hero: { backgroundType: 'gradient', gradientStart: '#1a3c34', gradientEnd: '#2d6a4f', overlay: 0.5 },
        animations: { enabled: true, duration: 0.6 },
      },
      {
        name: 'Sunset',
        isActive: false,
        colors: { primary: '#5c1a0e', secondary: '#9c3a1a', accent: '#f6ad55', base: '#fef6f0', surface: '#fcebe0', text: '#1c0a05', textMuted: '#8c6d5a', line: '#f0d6c5' },
        spacing: { section: 120 },
        hero: { backgroundType: 'gradient', gradientStart: '#5c1a0e', gradientEnd: '#9c3a1a', overlay: 0.5 },
        animations: { enabled: true, duration: 0.6 },
      },
    ]);

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
