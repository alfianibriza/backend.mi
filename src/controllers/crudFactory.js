/**
 * =============================================================
 * GENERIC CRUD CONTROLLER FACTORY
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * Karena banyak model (Teacher, Achievement, Extracurricular, Facility, Alumni, Schedule)
 * memiliki operasi CRUD yang sama, kita buat "factory" yang generate controller otomatis.
 * Ini menghindari duplikasi kode (DRY principle - Don't Repeat Yourself).
 */

const { Op } = require('sequelize');

const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * Buat controller CRUD untuk model tertentu
 * @param {Object} Model - Sequelize model
 * @param {string} name - Nama resource (untuk pesan response)
 * @param {Object} options - Opsi tambahan
 */
const createCrudController = (Model, name, options = {}) => {
  const { defaultOrder = [['created_at', 'DESC']], imageField = 'image' } = options;

  return {
    getAll: async (req, res, next) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        // Build WHERE clause from query params (exclude pagination & search)
        const where = {};
        const reservedParams = ['page', 'limit', 'search'];
        const modelAttributes = Object.keys(Model.rawAttributes);
        
        for (const [key, value] of Object.entries(req.query)) {
          if (!reservedParams.includes(key) && modelAttributes.includes(key) && value) {
            where[key] = value;
          }
        }

        // Search support (searches all STRING fields)
        if (req.query.search) {
          const searchConditions = modelAttributes
            .filter(attr => ['STRING', 'TEXT'].includes(Model.rawAttributes[attr].type.key))
            .map(attr => ({ [attr]: { [Op.like]: `%${req.query.search}%` } }));
          if (searchConditions.length > 0) {
            where[Op.or] = searchConditions;
          }
        }

        const { count, rows } = await Model.findAndCountAll({
          where,
          order: defaultOrder,
          limit,
          offset
        });

        return paginatedResponse(res, `Data ${name} berhasil diambil.`, rows, page, limit, count);
      } catch (error) {
        next(error);
      }
    },

    getById: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return errorResponse(res, `${name} tidak ditemukan.`, 404);
        return successResponse(res, `Data ${name} berhasil diambil.`, item);
      } catch (error) {
        next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        const data = { ...req.body };
        if (req.file) data[imageField] = `/uploads/${req.file.filename}`;
        
        const item = await Model.create(data);
        return successResponse(res, `${name} berhasil ditambahkan.`, item, 201);
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return errorResponse(res, `${name} tidak ditemukan.`, 404);

        const data = { ...req.body };
        if (req.file) data[imageField] = `/uploads/${req.file.filename}`;

        await item.update(data);
        return successResponse(res, `${name} berhasil diupdate.`, item);
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) return errorResponse(res, `${name} tidak ditemukan.`, 404);

        await item.destroy();
        return successResponse(res, `${name} berhasil dihapus.`);
      } catch (error) {
        next(error);
      }
    }
  };
};

module.exports = createCrudController;
