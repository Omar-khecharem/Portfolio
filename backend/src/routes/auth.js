const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginRules, handleErrors } = require('../middleware/validate');

router.post('/login', loginRules, handleErrors, login);
router.get('/me', protect, getMe);

module.exports = router;
