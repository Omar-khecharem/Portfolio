const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/visitorController');
const { protect } = require('../middleware/auth');

router.post('/log', ctrl.log);
router.get('/stats', protect, ctrl.stats);
router.get('/', protect, ctrl.visitorsList);

module.exports = router;
