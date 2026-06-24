const dns = require('dns');
const Message = require('../models/Message');

exports.validateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.json({ valid: false, reason: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ valid: false, reason: 'Invalid email format' });
    }

    const domain = email.split('@')[1];

    try {
      const mx = await new Promise((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });

      if (!mx || mx.length === 0) {
        return res.json({ valid: false, reason: 'Email domain does not accept emails' });
      }

      res.json({ valid: true });
    } catch {
      res.json({ valid: false, reason: 'Email domain does not exist' });
    }
  } catch (err) { next(err); }
};

exports.send = async (req, res, next) => {
  try {
    await Message.create(req.body);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) { next(err); }
};
