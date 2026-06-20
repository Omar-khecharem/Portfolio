const Theme = require('../models/Theme');

exports.getActive = async (req, res, next) => {
  try {
    let theme = await Theme.findOne({ isActive: true });
    if (!theme) {
      theme = await Theme.create({});
    }
    res.json(theme);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    res.json(themes);
  } catch (err) {
    next(err);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findById(id);
    if (!theme) return res.status(404).json({ message: 'Theme not found' });

    await Theme.updateMany({}, { isActive: false });
    theme.isActive = true;
    await theme.save();

    res.json(theme);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theme) return res.status(404).json({ message: 'Theme not found' });
    res.json(theme);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const theme = await Theme.create({ ...req.body, isActive: true, isPreset: false });
    await Theme.updateMany({ _id: { $ne: theme._id } }, { isActive: false });
    res.status(201).json(theme);
  } catch (err) {
    next(err);
  }
};
