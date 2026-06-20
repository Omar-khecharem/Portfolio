const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/certificationController');
const { protect } = require('../middleware/auth');
const { certificationRules, handleErrors } = require('../middleware/validate');

router.get('/', ctrl.list);
router.post('/', protect, certificationRules, handleErrors, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
