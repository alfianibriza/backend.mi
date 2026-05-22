/**
 * =============================================================
 * CONTROLLER: PROFILE (Profil Sekolah)
 * =============================================================
 * 
 * Mengelola section profil sekolah (sejarah, visi misi, dll).
 * Setiap section diidentifikasi oleh section_key unik.
 */

const { Profile } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const getAll = async (req, res, next) => {
  try {
    const profiles = await Profile.findAll({ order: [['sort_order', 'ASC']] });
    return successResponse(res, 'Data profil berhasil diambil.', profiles);
  } catch (error) {
    next(error);
  }
};

const getByKey = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ where: { section_key: req.params.key } });
    if (!profile) return errorResponse(res, 'Section tidak ditemukan.', 404);
    return successResponse(res, 'Data profil berhasil diambil.', profile);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    if (!profile) return errorResponse(res, 'Section tidak ditemukan.', 404);

    const { title, content, sort_order, image } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (image !== undefined) updateData.image = image;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    await profile.update(updateData);
    return successResponse(res, 'Profil berhasil diupdate.', profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getByKey, update };
