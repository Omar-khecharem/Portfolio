const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fingerprint: { type: String, required: true, index: true },
  ip: { type: String },
  userAgent: { type: String },
  page: { type: String, required: true },
  referrer: { type: String, default: '' },
  screenSize: { type: String },
  language: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ fingerprint: 1, timestamp: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
