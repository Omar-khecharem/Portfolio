const express = require('express');
const router = express.Router();
const { getActive, update } = require('../controllers/themeController');
const { protect } = require('../middleware/auth');

router.get('/', getActive);
router.put('/:id', protect, update);

module.exports = router;
