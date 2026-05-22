/**
 * =============================================================
 * CONTROLLER: PMB (Penerimaan Murid Baru)
 * =============================================================
 */

const { PmbRegistration, User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

/**
 * POST /api/pmb/register - Submit pendaftaran (user)
 */
const register = async (req, res, next) => {
  try {
    const { student_name, birth_place, birth_date, gender, parent_name, phone, address, previous_school } = req.body;

    if (!student_name || !gender || !parent_name || !phone) {
      return errorResponse(res, 'Data wajib: nama siswa, jenis kelamin, nama orang tua, dan nomor HP.', 400);
    }

    // Generate nomor pendaftaran unik
    const year = new Date().getFullYear();
    const count = await PmbRegistration.count();
    const registration_number = `PMB-${year}-${String(count + 1).padStart(4, '0')}`;

    const registration = await PmbRegistration.create({
      registration_number,
      student_name,
      birth_place,
      birth_date,
      gender,
      parent_name,
      phone,
      address,
      previous_school,
      document_path: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'pending',
      user_id: req.user ? req.user.id : null
    });

    return successResponse(res, 'Pendaftaran berhasil! Simpan nomor pendaftaran Anda.', registration, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pmb/status?registration_number=PMB-2026-0001
 * Cek status pendaftaran (user)
 */
const checkStatus = async (req, res, next) => {
  try {
    const { registration_number } = req.query;
    
    if (!registration_number) {
      return errorResponse(res, 'Nomor pendaftaran wajib diisi.', 400);
    }

    const registration = await PmbRegistration.findOne({ 
      where: { registration_number },
      attributes: ['registration_number', 'student_name', 'status', 'created_at']
    });

    if (!registration) {
      return errorResponse(res, 'Data pendaftaran tidak ditemukan.', 404);
    }

    return successResponse(res, 'Status pendaftaran ditemukan.', registration);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pmb - List semua pendaftar (admin)
 */
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    const whereClause = status ? { status } : {};

    const { count, rows } = await PmbRegistration.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return paginatedResponse(res, 'Data pendaftar berhasil diambil.', rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/pmb/:id/status - Update status pendaftar (admin)
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return errorResponse(res, 'Status harus: pending, accepted, atau rejected.', 400);
    }

    const registration = await PmbRegistration.findByPk(req.params.id);
    if (!registration) return errorResponse(res, 'Data pendaftaran tidak ditemukan.', 404);

    await registration.update({ status });
    return successResponse(res, `Status berhasil diubah menjadi ${status}.`, registration);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/pmb/:id - Hapus pendaftar (admin)
 */
const remove = async (req, res, next) => {
  try {
    const registration = await PmbRegistration.findByPk(req.params.id);
    if (!registration) return errorResponse(res, 'Data pendaftaran tidak ditemukan.', 404);

    await registration.destroy();
    return successResponse(res, 'Data pendaftaran berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, checkStatus, getAll, updateStatus, remove };
