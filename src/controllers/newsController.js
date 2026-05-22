/**
 * =============================================================
 * CONTROLLER: NEWS (Berita)
 * =============================================================
 * 
 * CRUD lengkap untuk berita sekolah.
 * GET (list & detail) bisa diakses publik.
 * POST, PUT, DELETE hanya bisa diakses admin.
 */

const { Op } = require('sequelize');
const { News, User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * Helper: buat slug dari judul berita
 * "Berita Terbaru 2026" → "berita-terbaru-2026"
 */
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * GET /api/news
 * List berita dengan pagination dan search
 */
const getAll = async (req, res, next) => {
  try {
    // Query parameters untuk pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Build where clause untuk search
    const whereClause = search ? {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    // Query dengan pagination
    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['published_at', 'DESC']],
      limit,
      offset
    });

    return paginatedResponse(res, 'Data berita berhasil diambil.', rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/news/:slug
 * Detail berita berdasarkan slug
 */
const getBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({
      where: { slug: req.params.slug },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });

    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', 404);
    }

    return successResponse(res, 'Detail berita berhasil diambil.', news);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/news
 * Buat berita baru (admin only)
 */
const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return errorResponse(res, 'Judul dan konten berita wajib diisi.', 400);
    }

    // Buat slug unik
    let slug = createSlug(title);
    const existingSlug = await News.findOne({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`; // Tambahkan timestamp jika slug sudah ada
    }

    const news = await News.create({
      title,
      slug,
      content,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : (req.body.thumbnail || null),
      author: req.user.name,
      user_id: req.user.id,
      published_at: new Date()
    });

    return successResponse(res, 'Berita berhasil dibuat.', news, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/news/:id
 * Update berita (admin only)
 */
const update = async (req, res, next) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', 404);
    }

    const { title, content } = req.body;
    
    const updateData = {};
    if (title) {
      updateData.title = title;
      updateData.slug = createSlug(title);
    }
    if (content) updateData.content = content;
    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    } else if (req.body.thumbnail) {
      updateData.thumbnail = req.body.thumbnail;
    }

    await news.update(updateData);

    return successResponse(res, 'Berita berhasil diupdate.', news);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/news/:id
 * Hapus berita (admin only)
 */
const remove = async (req, res, next) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return errorResponse(res, 'Berita tidak ditemukan.', 404);
    }

    await news.destroy();
    return successResponse(res, 'Berita berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getBySlug, create, update, remove };
