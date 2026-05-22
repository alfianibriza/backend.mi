/**
 * =============================================================
 * MODEL: PMB SETTING
 * =============================================================
 * 
 * Menyimpan pengaturan halaman PMB yang dikelola admin:
 * - section_key: 'informasi' | 'unduh_pendaftaran' | 'pengumuman'
 * - title: Judul section
 * - content: Konten HTML / teks
 * - file_url: URL file (untuk unduhan)
 * - is_active: Aktif atau tidak
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PmbSetting = sequelize.define('PmbSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'informasi | unduh_pendaftaran | pengumuman'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: ''
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'HTML content for informasi / pengumuman'
  },
  file_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL file untuk unduhan pendaftaran'
  },
  file_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Nama file asli untuk ditampilkan'
  },
  academic_year: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Tahun ajaran, misal 2026/2027'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'pmb_settings',
  timestamps: true,
  underscored: true
});

module.exports = PmbSetting;
