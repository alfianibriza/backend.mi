const express = require('express');
const router = express.Router();
const pmbSettingController = require('../controllers/pmbSettingController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', pmbSettingController.getAll);
router.get('/accepted', pmbSettingController.getAcceptedStudents);
router.get('/by-section/:key', pmbSettingController.getBySection);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), pmbSettingController.getAllAdmin);
router.post('/', authenticate, authorize('admin'), pmbSettingController.create);
router.post('/init', authenticate, authorize('admin'), pmbSettingController.initDefaults);
router.put('/:id', authenticate, authorize('admin'), pmbSettingController.update);
router.delete('/:id', authenticate, authorize('admin'), pmbSettingController.remove);

module.exports = router;
