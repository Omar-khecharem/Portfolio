const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: { type: String, default: 'Default' },
  isActive: { type: Boolean, default: true },
  isPreset: { type: Boolean, default: false },
  colors: {
    primary: { type: String, default: '#0a0a23' },
    secondary: { type: String, default: '#1a1a3e' },
    accent: { type: String, default: '#e94560' },
    base: { type: String, default: '#fafaf8' },
    surface: { type: String, default: '#f2f0ed' },
    text: { type: String, default: '#1a1a2e' },
    textMuted: { type: String, default: '#6b7280' },
    line: { type: String, default: '#e5e3df' },
  },
  spacing: {
    section: { type: Number, default: 120 },
  },
  hero: {
    backgroundType: { type: String, enum: ['gradient', 'color', 'image', 'video'], default: 'gradient' },
    gradientStart: { type: String, default: '#0a0a23' },
    gradientEnd: { type: String, default: '#1a1a3e' },
    imageUrl: { type: String },
    images: [{ type: String }],
    imageTransitionDuration: { type: Number, default: 5, min: 1, max: 30 },
    videoUrl: { type: String },
    overlay: { type: Number, default: 0.6, min: 0, max: 1 },
    blur: { type: Number, default: 0, min: 0, max: 10 },
    brightness: { type: Number, default: 1.0, min: 0.5, max: 1.5 },
    imagePosition: { type: String, enum: ['center', 'top', 'bottom'], default: 'center' },
  },
  animations: {
    enabled: { type: Boolean, default: true },
    duration: { type: Number, default: 0.6 },
    ambient: {
      enabled: { type: Boolean, default: true },
      orbs: { type: Boolean, default: true },
      shapes: { type: Boolean, default: true },
      particles: { type: Boolean, default: true },
      mouseParallax: { type: Boolean, default: true },
      orbsSpeed: { type: Number, default: 1.0, min: 0.3, max: 3.0 },
      shapesSpeed: { type: Number, default: 1.0, min: 0.3, max: 3.0 },
      particlesDensity: { type: Number, default: 35, min: 0, max: 80 },
      orbsOpacity: { type: Number, default: 0.25, min: 0, max: 0.5 },
      shapesOpacity: { type: Number, default: 0.12, min: 0, max: 0.3 },
      blurIntensity: { type: Number, default: 1.0, min: 0.0, max: 2.0 },
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Theme', themeSchema);
