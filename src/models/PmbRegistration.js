/**
 * =============================================================
 * MODEL: PMB REGISTRATION (Penerimaan Murid Baru)
 * =============================================================
 * 
 * Data pendaftaran siswa baru.
 * - Status: pending → accepted/rejected (diubah oleh admin)
 * - document_path: file dokumen yang diupload
 * - Relasi ke User (siapa yang mendaftar)
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PmbRegistration = sequelize.define('PmbRegistration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  student_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama siswa tidak boleh kosong' } }
  },
  birth_place: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('L', 'P'),
    allowNull: false
  },
  parent_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  previous_school: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  document_path: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'pmb_registrations',
  timestamps: true,
  underscored: true,
});

module.exports = PmbRegistration;
