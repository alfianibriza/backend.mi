/**
 * =============================================================
 * MIDDLEWARE: ERROR HANDLER
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * Error handler middleware HARUS memiliki 4 parameter (err, req, res, next).
 * Express otomatis mengenali ini sebagai error handler.
 * Ditempatkan di PALING AKHIR setelah semua route.
 * 
 * Semua error yang terjadi di controller/middleware lain
 * akan di-catch di sini dan dikirim sebagai JSON response yang konsisten.
 */

const { errorResponse } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const errors = {};
    err.errors.forEach(e => {
      errors[e.path] = e.message;
    });
    return errorResponse(res, 'Validasi gagal.', 400, errors);
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    err.errors.forEach(e => {
      errors[e.path] = e.message;
    });
    return errorResponse(res, 'Data sudah ada.', 409, errors);
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'Ukuran file terlalu besar. Maksimal 5MB.', 400);
  }

  // Multer file type error
  if (err.message && err.message.includes('Tipe file tidak didukung')) {
    return errorResponse(res, err.message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Token tidak valid.', 401);
  }

  // Default server error
  return errorResponse(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan pada server.',
    err.statusCode || 500
  );
};

module.exports = errorHandler;
