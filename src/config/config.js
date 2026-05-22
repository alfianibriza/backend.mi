/**
 * =============================================================
 * APPLICATION CONFIG
 * =============================================================
 * 
 * Centralized configuration values.
 * Semua konfigurasi app diambil dari .env dan di-export dari sini
 * agar mudah diakses dari file manapun.
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
