/**
 * =============================================================
 * RESPONSE HELPER
 * =============================================================
 * 
 * Utility untuk menstandarkan format JSON response.
 * Semua API endpoint menggunakan format yang konsisten
 * agar frontend mudah mengolah response.
 * 
 * KONSEP: Standarisasi response membuat frontend developer
 * tahu persis struktur data yang akan diterima.
 */

/**
 * Response sukses
 * @param {Object} res - Express response object
 * @param {string} message - Pesan sukses
 * @param {*} data - Data yang dikirim
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Response error
 * @param {Object} res - Express response object
 * @param {string} message - Pesan error
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {Object} errors - Detail error (optional)
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Response dengan pagination
 * @param {Object} res - Express response object
 * @param {string} message - Pesan sukses
 * @param {Array} data - Array data
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah per halaman
 * @param {number} totalItems - Total item keseluruhan
 */
const paginatedResponse = (res, message, data, page, limit, totalItems) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  });
};

module.exports = { successResponse, errorResponse, paginatedResponse };
