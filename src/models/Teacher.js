/**
 * =============================================================
 * MODEL: TEACHER (Guru & Staff / PTK)
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama guru tidak boleh kosong' } }
  },
  position: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  education: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'teachers',
  timestamps: true,
  underscored: true,
});

module.exports = Teacher;
