const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { projectRules, handleErrors } = require('../middleware/validate');

router.get('/', ctrl.list);
router.get('/:slug', ctrl.get);
router.post('/', protect, projectRules, handleErrors, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
