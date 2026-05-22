const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protect all routes (only logged in users can access)
router.use(authenticate);

// Get all media (admin only)
router.get('/', authorize('admin'), mediaController.getAllMedia);

// Upload new media directly to library (admin only)
router.post('/', authorize('admin'), upload.single('file'), mediaController.uploadMedia);

// Delete media (admin only)
router.delete('/:filename', authorize('admin'), mediaController.deleteMedia);

module.exports = router;
