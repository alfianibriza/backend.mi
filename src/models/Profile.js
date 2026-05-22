/**
 * =============================================================
 * MODEL: PROFILE (Profil Sekolah)
 * =============================================================
 * 
 * Profile disimpan sebagai key-value sections.
 * section_key menentukan bagian mana (sejarah, visi_misi, dll).
 * Ini membuat data profil fleksibel tanpa perlu tabel terpisah.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  section_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { notEmpty: { msg: 'Section key tidak boleh kosong' } }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'profiles',
  timestamps: true,
  underscored: true,
});

module.exports = Profile;
