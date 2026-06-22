const ChatConfig = require('../models/ChatConfig');

exports.getActive = async (req, res, next) => {
  try {
    let config = await ChatConfig.findOne({ isActive: true });
    if (!config) {
      config = await ChatConfig.create({});
    }
    res.json(config);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const configs = await ChatConfig.find().sort({ createdAt: -1 });
    res.json(configs);
  } catch (err) {
    next(err);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const config = await ChatConfig.findById(id);
    if (!config) return res.status(404).json({ message: 'Chat config not found' });

    await ChatConfig.updateMany({}, { isActive: false });
    config.isActive = true;
    await config.save();

    res.json(config);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const config = await ChatConfig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!config) return res.status(404).json({ message: 'Chat config not found' });
    res.json(config);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const config = await ChatConfig.create({ ...req.body, isActive: true, isPreset: false });
    await ChatConfig.updateMany({ _id: { $ne: config._id } }, { isActive: false });
    res.status(201).json(config);
  } catch (err) {
    next(err);
  }
};
