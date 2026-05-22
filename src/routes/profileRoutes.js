const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', profileController.getAll);
router.get('/:key', profileController.getByKey);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), profileController.update);

module.exports = router;
