const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Omar KHECHAREM' },
  title: { type: String, default: 'Full-Stack Developer (MERN) | AI Enthusiast | Engineering Student' },
  bio: { type: String, default: '' },
  shortBio: { type: String, default: 'Engineering student passionate about full-stack development, AI integration, and building digital products.' },
  location: { type: String, default: 'Ariana, Tunisia' },
  email: { type: String, default: 'omar.khecharem@isimg.tn' },
  image: { type: String },
  resumeUrl: { type: String },
  available: { type: Boolean, default: true },
  availability: {
    freelance: { type: Boolean, default: true },
    internship: { type: Boolean, default: true },
    remote: { type: Boolean, default: true },
  },
  social: {
    github: { type: String, default: 'https://github.com/Omar-khecharem' },
    linkedin: { type: String, default: 'https://linkedin.com/in/omar-khecharem-373b16241' },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
  },
  skills: [{
    name: { type: String, required: true },
    category: { type: String, enum: ['frontend', 'backend', 'ai', 'tools'], required: true },
    level: { type: Number, min: 0, max: 100, required: true },
    color: { type: String, default: '' },
  }],
  experience: [{
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String },
    highlights: [String],
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String, required: true },
    description: { type: String },
  }],
  languages: [{
    name: { type: String, required: true },
    level: { type: String, required: true },
  }],
  services: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
  }],
  projectCategories: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
