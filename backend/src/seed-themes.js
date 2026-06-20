const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Theme = require('./models/Theme');

const themes = [
  {
    name: 'Default Dark',
    isActive: true,
    isPreset: true,
    colors: { primary: '#0a0a23', secondary: '#1a1a3e', accent: '#e94560', base: '#f5f5f0', surface: '#eae8e4', text: '#16161a', textMuted: '#6e7a8a', line: '#d8d6d0' },
    spacing: { section: 120 },
    hero: { backgroundType: 'gradient', gradientStart: '#0a0a23', gradientEnd: '#1a1a3e', overlay: 0.6 },
    animations: { enabled: true, duration: 0.6 },
  },
  {
    name: 'Light Minimal',
    isActive: false,
    isPreset: true,
    colors: { primary: '#1e293b', secondary: '#334155', accent: '#0ea5e9', base: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b', line: '#e2e8f0' },
    spacing: { section: 120 },
    hero: { backgroundType: 'gradient', gradientStart: '#1e293b', gradientEnd: '#334155', overlay: 0.5 },
    animations: { enabled: true, duration: 0.6 },
  },
  {
    name: 'Ocean Blue',
    isActive: false,
    isPreset: true,
    colors: { primary: '#1e3a5f', secondary: '#2c5282', accent: '#f6ad55', base: '#f4f8fb', surface: '#e6eef7', text: '#0c1929', textMuted: '#5a7a96', line: '#ccddee' },
    spacing: { section: 120 },
    hero: { backgroundType: 'gradient', gradientStart: '#1e3a5f', gradientEnd: '#2c5282', overlay: 0.5 },
    animations: { enabled: true, duration: 0.6 },
  },
  {
    name: 'Forest',
    isActive: false,
    isPreset: true,
    colors: { primary: '#1a3c34', secondary: '#2d6a4f', accent: '#d4a373', base: '#f2f9f4', surface: '#e3f0e8', text: '#0d1f1a', textMuted: '#4d7c6b', line: '#c8dfd3' },
    spacing: { section: 120 },
    hero: { backgroundType: 'gradient', gradientStart: '#1a3c34', gradientEnd: '#2d6a4f', overlay: 0.5 },
    animations: { enabled: true, duration: 0.6 },
  },
  {
    name: 'Sunset',
    isActive: false,
    isPreset: true,
    colors: { primary: '#5c1a0e', secondary: '#9c3a1a', accent: '#f6ad55', base: '#fef6f0', surface: '#fcebe0', text: '#1c0a05', textMuted: '#8c6d5a', line: '#f0d6c5' },
    spacing: { section: 120 },
    hero: { backgroundType: 'gradient', gradientStart: '#5c1a0e', gradientEnd: '#9c3a1a', overlay: 0.5 },
    animations: { enabled: true, duration: 0.6 },
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Theme.deleteMany();
    const created = await Theme.create(themes);

    console.log(`✓ ${created.length} themes re-seeded`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err);
    process.exit(1);
  }
};

run();
