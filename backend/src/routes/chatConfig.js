const express = require('express');
const router = express.Router();
const { getActive, list, activate, update, create } = require('../controllers/chatConfigController');
const { protect } = require('../middleware/auth');

router.get('/', getActive);
router.get('/all', protect, list);
router.put('/:id', protect, update);
router.put('/:id/activate', protect, activate);
router.post('/', protect, create);

module.exports = router;
