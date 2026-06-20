const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { messageRules, handleErrors } = require('../middleware/validate');

router.post('/', messageRules, handleErrors, ctrl.send);
router.get('/', protect, ctrl.list);
router.put('/:id/read', protect, ctrl.markRead);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
