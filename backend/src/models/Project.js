const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: [true, 'Description is required'] },
  longDescription: { type: String },
  technologies: [{ type: String }],
  image: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
  category: {
    type: String,
    enum: ['fullstack', 'ai', 'freelance', 'academic'],
    required: [true, 'Category is required'],
    default: 'fullstack',
  },
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  highlights: [String],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
