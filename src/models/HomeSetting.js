/**
 * =============================================================
 * MODEL: HOME SETTING
 * =============================================================
 * 
 * PENJELASAN:
 * Model ini menyimpan pengaturan konten beranda secara dinamis.
 * Admin bisa mengubah hero slides, statistik, program unggulan, 
 * dan CTA section melalui panel admin.
 * 
 * Setiap baris mewakili satu section beranda,
 * dengan data disimpan dalam format JSON agar fleksibel.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeSetting = sequelize.define('HomeSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  section_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'Key unik untuk identifikasi section: hero_slides, stats, programs, cta'
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nama section yang tampil di admin panel'
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Data section dalam format JSON'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Status aktif/nonaktif section'
  }
}, {
  tableName: 'home_settings',
  timestamps: true,
  underscored: true
});

module.exports = HomeSetting;
