const Visitor = require('../models/Visitor');

exports.log = async (req, res, next) => {
  try {
    const { fingerprint, page, referrer, screenSize, language } = req.body;
    if (!fingerprint || !page) {
      return res.status(400).json({ message: 'fingerprint and page are required' });
    }
    await Visitor.create({
      fingerprint,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent'],
      page,
      referrer: referrer || '',
      screenSize: screenSize || '',
      language: language || '',
    });
    res.status(201).json({ message: 'ok' });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.distinct('fingerprint').then(r => r.length);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = await Visitor.countDocuments({ timestamp: { $gte: today } });

    const pageViews = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    const dailyVisits = await Visitor.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, visits: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 60 },
    ]);

    const hourlyData = await Visitor.aggregate([
      { $group: { _id: { $hour: '$timestamp' }, visits: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const recentVisitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .select('fingerprint page referrer screenSize language timestamp ip userAgent');

    const browsers = await Visitor.aggregate([
      { $match: { userAgent: { $ne: '' } } },
      { $group: { _id: '$userAgent', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      todayVisits,
      pageViews,
      dailyVisits,
      hourlyData,
      recentVisitors,
      browsers,
    });
  } catch (err) { next(err); }
};

exports.visitorsList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [visitors, total] = await Promise.all([
      Visitor.find().sort({ timestamp: -1 }).skip(skip).limit(limit),
      Visitor.countDocuments(),
    ]);

    res.json({ visitors, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
