const Message = require('../models/Message');

exports.list = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) { next(err); }
};

exports.send = async (req, res, next) => {
  try {
    await Message.create(req.body);
    res.status(201).json({ message: 'Message sent successfully' });
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
