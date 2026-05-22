/**
 * =============================================================
 * ROUTES: HOME SETTINGS
 * =============================================================
 * 
 * Endpoint untuk kelola tampilan beranda.
 * GET route publik, POST/PUT admin only.
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const homeSettingController = require('../controllers/homeSettingController');

// Public routes
router.get('/', homeSettingController.getAll);
router.get('/:key', homeSettingController.getByKey);

// Admin only routes
router.put('/:key', authenticate, authorize('admin'), homeSettingController.update);
router.post('/init', authenticate, authorize('admin'), homeSettingController.init);
router.post('/upload-image', authenticate, authorize('admin'), upload.single('image'), homeSettingController.uploadImage);

module.exports = router;
