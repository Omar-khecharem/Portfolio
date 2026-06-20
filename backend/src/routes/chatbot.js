const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { chat } = require('../controllers/chatbotController');

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests. Please wait a moment.' },
});

router.post('/', chatLimiter, chat);

module.exports = router;
