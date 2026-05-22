/**
 * =============================================================
 * MODEL: ALUMNI
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alumni = sequelize.define('Alumni', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama alumni tidak boleh kosong' } }
  },
  graduation_year: {
    type: DataTypes.STRING(4),
    allowNull: false
  },
  current_activity: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  testimonial: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'alumni',
  timestamps: true,
  underscored: true,
});

module.exports = Alumni;
