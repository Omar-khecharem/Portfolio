const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const exists = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.json({ message: 'You are already subscribed!' });
    }
    await Newsletter.create({ email: email.toLowerCase().trim() });
    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    next(err);
  }
};
