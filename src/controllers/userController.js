/**
 * =============================================================
 * CONTROLLER: USER MANAGEMENT (Admin)
 * =============================================================
 */

const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');

const create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email sudah terdaftar.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    const user = await User.findByPk(newUser.id, {
      attributes: { exclude: ['password'] }
    });

    return successResponse(res, 'User berhasil ditambahkan.', user, 201);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return paginatedResponse(res, 'Data user berhasil diambil.', rows, page, limit, count);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return errorResponse(res, 'User tidak ditemukan.', 404);

    const { name, email, role, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    await user.update(updateData);
    
    const updatedUser = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    return successResponse(res, 'User berhasil diupdate.', updatedUser);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return errorResponse(res, 'User tidak ditemukan.', 404);
    if (user.id === req.user.id) return errorResponse(res, 'Tidak bisa menghapus akun sendiri.', 400);
    
    await user.destroy();
    return successResponse(res, 'User berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, update, remove };
