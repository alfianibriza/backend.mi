/**
 * =============================================================
 * MODEL: EXTRACURRICULAR (Ekstrakurikuler)
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Extracurricular = sequelize.define('Extracurricular', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama ekskul tidak boleh kosong' } }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  schedule: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  coach: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'extracurriculars',
  timestamps: true,
  underscored: true,
});

module.exports = Extracurricular;
