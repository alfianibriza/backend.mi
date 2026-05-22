/**
 * =============================================================
 * DATABASE CONFIGURATION
 * =============================================================
 * 
 * File ini mengkonfigurasi koneksi ke MySQL menggunakan Sequelize ORM.
 * 
 * PENJELASAN KONSEP:
 * - Sequelize adalah ORM (Object-Relational Mapping) yang memungkinkan
 *   kita berinteraksi dengan database menggunakan JavaScript objects
 *   tanpa menulis raw SQL query.
 * - Connection pooling digunakan agar koneksi database di-reuse,
 *   bukan membuat koneksi baru setiap kali ada request.
 * 
 * ALUR:
 * .env → dotenv → config values → Sequelize instance → MySQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Membuat instance Sequelize dengan konfigurasi dari .env
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nama database
  process.env.DB_USER,     // Username MySQL
  process.env.DB_PASS,     // Password MySQL
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',        // Tipe database yang digunakan
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Connection pool: mengatur berapa koneksi yang bisa dibuka
    pool: {
      max: 10,      // Maksimal 10 koneksi bersamaan
      min: 0,       // Minimal 0 koneksi (hemat resource)
      acquire: 30000, // Timeout 30 detik untuk mendapatkan koneksi
      idle: 10000     // Koneksi idle ditutup setelah 10 detik
    },

    // Timezone untuk konsistensi waktu
    timezone: '+07:00'
  }
);

module.exports = sequelize;
