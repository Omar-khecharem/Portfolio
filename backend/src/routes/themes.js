const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/themeController');
const { protect } = require('../middleware/auth');

router.get('/', ctrl.list);
router.post('/', protect, ctrl.create);
router.put('/:id/activate', protect, ctrl.activate);

module.exports = router;
