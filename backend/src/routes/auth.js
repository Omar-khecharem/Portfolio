const express = require('express');
const router = express.Router();
const { login, verifyCode, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginRules, verifyCodeRules, handleErrors } = require('../middleware/validate');

router.post('/login', loginRules, handleErrors, login);
router.post('/verify-code', verifyCodeRules, handleErrors, verifyCode);
router.get('/me', protect, getMe);

module.exports = router;
