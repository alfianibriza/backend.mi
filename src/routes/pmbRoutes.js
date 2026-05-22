const express = require('express');
const router = express.Router();
const pmbController = require('../controllers/pmbController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User routes
router.post('/register', upload.single('document'), pmbController.register);
router.get('/status', pmbController.checkStatus);

// Admin routes
router.get('/', authenticate, authorize('admin'), pmbController.getAll);
router.put('/:id/status', authenticate, authorize('admin'), pmbController.updateStatus);
router.delete('/:id', authenticate, authorize('admin'), pmbController.remove);

module.exports = router;
