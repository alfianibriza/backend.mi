/**
 * =============================================================
 * MIDDLEWARE: AUTHENTICATION (JWT)
 * =============================================================
 * 
 * PENJELASAN KONSEP MIDDLEWARE:
 * Middleware adalah fungsi yang dijalankan SEBELUM request sampai ke controller.
 * Ibarat security di pintu masuk yang memeriksa tiket sebelum masuk.
 * 
 * ALUR AUTH MIDDLEWARE:
 * 1. Client kirim request dengan header: Authorization: Bearer <token>
 * 2. Middleware extract token dari header
 * 3. Verify token menggunakan JWT_SECRET
 * 4. Jika valid → lanjut ke controller (next())
 * 5. Jika tidak valid → return 401 Unauthorized
 * 
 * KONSEP AUTHORIZATION (Role-based):
 * - authenticate: Memastikan user sudah login (punya token valid)
 * - authorize('admin'): Memastikan user memiliki role tertentu
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { errorResponse } = require('../utils/responseHelper');
const config = require('../config/config');

/**
 * Middleware: Verifikasi JWT Token
 * Memeriksa apakah request memiliki token valid.
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
    }

    // 2. Extract token (hilangkan "Bearer " di depan)
    const token = authHeader.split(' ')[1];

    // 3. Verify token dengan secret key
    const decoded = jwt.verify(token, config.jwtSecret);

    // 4. Cari user di database berdasarkan ID dari token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Jangan kirim password
    });

    if (!user) {
      return errorResponse(res, 'User tidak ditemukan.', 401);
    }

    // 5. Simpan data user ke request object agar bisa diakses di controller
    req.user = user;
    
    // 6. Lanjut ke middleware/controller berikutnya
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token tidak valid.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token sudah expired. Silakan login ulang.', 401);
    }
    return errorResponse(res, 'Gagal autentikasi.', 500);
  }
};

/**
 * Middleware: Authorization berdasarkan Role
 * Memeriksa apakah user memiliki role yang diizinkan.
 * 
 * Contoh penggunaan:
 * router.post('/news', authenticate, authorize('admin'), newsController.create);
 * 
 * @param  {...string} roles - Role yang diizinkan (bisa lebih dari satu)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user sudah diisi oleh middleware authenticate di atas
    if (!req.user) {
      return errorResponse(res, 'Silakan login terlebih dahulu.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Anda tidak memiliki akses untuk melakukan ini.', 403);
    }

    next();
  };
};

module.exports = { authenticate, authorize };
