/**
 * =============================================================
 * MODEL: USER
 * =============================================================
 * 
 * PENJELASAN KONSEP MODEL:
 * Model adalah representasi tabel database dalam bentuk JavaScript class.
 * Setiap property di model = kolom di tabel database.
 * 
 * FIELD UTAMA:
 * - name: Nama lengkap user
 * - email: Email unik untuk login
 * - password: Password yang sudah di-hash (bcrypt)
 * - role: 'admin' atau 'user' (untuk authorization)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nama tidak boleh kosong' },
      len: { args: [2, 100], msg: 'Nama harus 2-100 karakter' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: { msg: 'Email sudah terdaftar' },
    validate: {
      isEmail: { msg: 'Format email tidak valid' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password minimal 6 karakter' }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,             // Otomatis buat createdAt & updatedAt
  underscored: true,            // Gunakan snake_case untuk kolom (created_at)
});

module.exports = User;
