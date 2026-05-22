/**
 * =============================================================
 * ROUTES: NEWS (Berita)
 * =============================================================
 */

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Route publik
router.get('/', newsController.getAll);
router.get('/:slug', newsController.getBySlug);

// Route admin only (perlu login + role admin)
router.post('/', authenticate, authorize('admin'), upload.single('thumbnail'), newsController.create);
router.put('/:id', authenticate, authorize('admin'), upload.single('thumbnail'), newsController.update);
router.delete('/:id', authenticate, authorize('admin'), newsController.remove);

module.exports = router;
