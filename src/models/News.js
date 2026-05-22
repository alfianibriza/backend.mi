/**
 * =============================================================
 * MODEL: NEWS (Berita)
 * =============================================================
 * 
 * Tabel berita sekolah. Setiap berita memiliki:
 * - Judul, konten, thumbnail, dan slug (URL-friendly)
 * - Relasi ke User (siapa yang menulis)
 * - Pagination didukung di controller
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: { msg: 'Judul berita tidak boleh kosong' } }
  },
  slug: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: { notEmpty: { msg: 'Konten berita tidak boleh kosong' } }
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'news',
  timestamps: true,
  underscored: true,
});

module.exports = News;
