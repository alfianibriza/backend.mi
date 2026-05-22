/**
 * =============================================================
 * MODEL: ACHIEVEMENT (Prestasi)
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: { msg: 'Judul prestasi tidak boleh kosong' } }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  year: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'achievements',
  timestamps: true,
  underscored: true,
});

module.exports = Achievement;
