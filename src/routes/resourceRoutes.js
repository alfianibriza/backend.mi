/**
 * =============================================================
 * ROUTES: RESOURCE ROUTES (Teacher, Achievement, etc.)
 * =============================================================
 * 
 * Menggunakan factory pattern untuk membuat routes CRUD standar.
 */

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const createCrudController = require('../controllers/crudFactory');

/**
 * Factory: buat router CRUD untuk model tertentu
 * @param {Object} Model - Sequelize model
 * @param {string} name - Nama resource
 * @param {string} imageFieldName - Nama field untuk upload image
 */
const createCrudRoutes = (Model, name, imageFieldName = 'image') => {
  const router = express.Router();
  const controller = createCrudController(Model, name, { imageField: imageFieldName });

  // GET publik
  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);

  // POST/PUT/DELETE admin only
  router.post('/', authenticate, authorize('admin'), upload.single(imageFieldName), controller.create);
  router.put('/:id', authenticate, authorize('admin'), upload.single(imageFieldName), controller.update);
  router.delete('/:id', authenticate, authorize('admin'), controller.remove);

  return router;
};

module.exports = createCrudRoutes;
