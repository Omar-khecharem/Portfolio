const crypto = require('crypto');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/jwt');
const { sendVerificationCode } = require('../utils/email');

const CODE_EXPIRY_MS = 10 * 60 * 1000;
const LOGIN_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const generateCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const now = new Date();
    const lastLogin = user.lastLoginAt;
    const isRecent = lastLogin && (now.getTime() - lastLogin.getTime() < LOGIN_COOLDOWN_MS);

    if (isRecent) {
      user.lastLoginAt = now;
      await user.save();
      return sendTokenResponse(user, 200, res);
    }

    const code = generateCode();
    user.loginCode = code;
    user.loginCodeExpiresAt = new Date(now.getTime() + CODE_EXPIRY_MS);
    await user.save();

    await sendVerificationCode(user.email, code);

    res.json({ requiresVerification: true, email: user.email });
  } catch (err) {
    next(err);
  }
};

exports.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email }).select('+loginCode +loginCodeExpiresAt');

    if (!user || !user.loginCode || !user.loginCodeExpiresAt) {
      return res.status(400).json({ message: 'No verification code requested' });
    }

    if (user.loginCode !== code) {
      return res.status(401).json({ message: 'Invalid verification code' });
    }

    if (new Date() > user.loginCodeExpiresAt) {
      user.loginCode = undefined;
      user.loginCodeExpiresAt = undefined;
      await user.save();
      return res.status(401).json({ message: 'Verification code expired. Please login again.' });
    }

    user.loginCode = undefined;
    user.loginCodeExpiresAt = undefined;
    user.lastLoginAt = new Date();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
