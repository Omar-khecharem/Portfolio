const mongoose = require('mongoose');

const chatConfigSchema = new mongoose.Schema({
  name: { type: String, default: 'Default' },
  isActive: { type: Boolean, default: true },
  isPreset: { type: Boolean, default: false },
  role: { type: String, default: 'You represent a freelance Full-Stack Developer portfolio.' },
  personality: { type: String, default: 'professional\nconcise\nconfident\nrecruiter-friendly' },
  rules: [{ type: String }],
  defaultRules: [{ type: String }],
  welcomeMessage: { type: String, default: "Hi! I'm Omar's AI assistant. Ask me about his skills, projects, experience, or freelance services!" },
  fallbackResponse: { type: String, default: "I can only provide information about Omar's professional profile." },
  temperature: { type: Number, default: 0.5, min: 0.1, max: 1.0 },
  maxTokens: { type: Number, default: 256, min: 64, max: 1024 },
  showSkills: { type: Boolean, default: true },
  showExperience: { type: Boolean, default: true },
  showProjects: { type: Boolean, default: true },
  showEducation: { type: Boolean, default: true },
  showCertifications: { type: Boolean, default: true },
  showLanguages: { type: Boolean, default: true },
  showServices: { type: Boolean, default: true },
  maxContextProjects: { type: Number, default: 6, min: 0, max: 20 },
  briefMode: { type: Boolean, default: true },
  allowMarkdown: { type: Boolean, default: false },
  maxHistoryMessages: { type: Number, default: 6, min: 0, max: 20 },
}, { timestamps: true });

module.exports = mongoose.model('ChatConfig', chatConfigSchema);
