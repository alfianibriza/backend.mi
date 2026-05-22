/**
 * =============================================================
 * MODEL INDEX - Associations / Relasi Antar Tabel
 * =============================================================
 * 
 * PENJELASAN KONSEP RELASI:
 * - hasMany: User PUNYA BANYAK News (1:N)
 * - belongsTo: News MILIK satu User (N:1)
 * 
 * File ini mengumpulkan semua model dan mendefinisikan relasinya.
 * Ini penting agar saat query, kita bisa include data relasi.
 * Contoh: saat ambil news, bisa include data user penulisnya.
 */

const sequelize = require('../config/database');
const User = require('./User');
const News = require('./News');
const Profile = require('./Profile');
const Teacher = require('./Teacher');
const Achievement = require('./Achievement');
const Extracurricular = require('./Extracurricular');
const Facility = require('./Facility');
const PmbRegistration = require('./PmbRegistration');
const Alumni = require('./Alumni');
const Schedule = require('./Schedule');
const HomeSetting = require('./HomeSetting');
const PmbSetting = require('./PmbSetting');

// ==================== RELASI ====================

// User memiliki banyak News (1 user bisa tulis banyak berita)
User.hasMany(News, { foreignKey: 'user_id', as: 'news' });
News.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User memiliki banyak PMB Registration 
User.hasMany(PmbRegistration, { foreignKey: 'user_id', as: 'registrations' });
PmbRegistration.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Export semua model dan sequelize instance
module.exports = {
  sequelize,
  User,
  News,
  Profile,
  Teacher,
  Achievement,
  Extracurricular,
  Facility,
  PmbRegistration,
  Alumni,
  Schedule,
  HomeSetting,
  PmbSetting
};
