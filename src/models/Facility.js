/**
 * =============================================================
 * MODEL: FACILITY (Sarana & Prasarana)
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facility = sequelize.define('Facility', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama fasilitas tidak boleh kosong' } }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  condition: {
    type: DataTypes.ENUM('baik', 'cukup', 'kurang'),
    defaultValue: 'baik'
  }
}, {
  tableName: 'facilities',
  timestamps: true,
  underscored: true,
});

module.exports = Facility;
