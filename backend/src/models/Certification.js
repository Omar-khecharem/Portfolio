const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Certification name is required'], trim: true },
  issuer: { type: String, required: [true, 'Issuer is required'], trim: true },
  date: { type: String },
  image: { type: String },
  credentialUrl: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
