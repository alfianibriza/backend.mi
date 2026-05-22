/**
 * =============================================================
 * MODEL: SCHEDULE (Jadwal Pelajaran)
 * =============================================================
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: { notEmpty: { msg: 'Nama kelas tidak boleh kosong' } }
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  teacher: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  day: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  time_start: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  time_end: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: true,
  underscored: true,
});

module.exports = Schedule;
