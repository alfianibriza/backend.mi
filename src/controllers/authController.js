/**
 * =============================================================
 * CONTROLLER: AUTHENTICATION
 * =============================================================
 * 
 * PENJELASAN KONSEP CONTROLLER:
 * Controller menerima request dari route, memproses logic,
 * dan mengirim response. Ini adalah "otak" dari API.
 * 
 * ALUR LOGIN:
 * 1. Client POST { email, password } ke /api/auth/login
 * 2. Controller cari user berdasarkan email
 * 3. Bandingkan password (bcrypt.compare)
 * 4. Jika cocok → generate JWT token → kirim ke client
 * 5. Client simpan token untuk request berikutnya
 * 
 * ALUR REGISTER:
 * 1. Client POST { name, email, password } ke /api/auth/register
 * 2. Hash password dengan bcrypt
 * 3. Simpan user ke database
 * 4. Generate JWT token → kirim ke client
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const config = require('../config/config');

/**
 * Generate JWT Token
 * Token berisi user ID dan role, ditandatangani dengan secret key
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },   // Payload: data yang disimpan di token
    config.jwtSecret,                     // Secret key untuk signing
    { expiresIn: config.jwtExpiresIn }   // Durasi expired
  );
};

/**
 * POST /api/auth/register
 * Mendaftarkan user baru
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return errorResponse(res, 'Nama, email, dan password wajib diisi.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password minimal 6 karakter.', 400);
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email sudah terdaftar.', 409);
    }

    // Hash password sebelum disimpan ke database
    // bcrypt.hash(password, salt_rounds) → semakin tinggi salt_rounds, semakin aman tapi lambat
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru di database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'   // Default role adalah user biasa
    });

    // Generate token untuk auto-login setelah register
    const token = generateToken(user);

    return successResponse(res, 'Registrasi berhasil!', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }, 201);

  } catch (error) {
    next(error); // Lempar ke error handler middleware
  }
};

/**
 * POST /api/auth/login
 * Login user dan dapatkan JWT token
 */
const login = async (req, res, next) => {
  try {
    // DEBUG: Log request body
    console.log(req.body);

    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return errorResponse(res, 'Email dan password wajib diisi.', 400);
    }

    // Cari user berdasarkan email
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    // DEBUG: Log user yang ditemukan
    console.log(user);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    // Bandingkan password input dengan hash di database
    // bcrypt.compare otomatis mencocokkan dengan salt yang sama
    const match = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // DEBUG: Log hasil compare password
    console.log(match);

    if (!match) {
      return res.status(400).json({
        message: "Password salah"
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return successResponse(res, 'Login berhasil!', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Ambil data user yang sedang login (dari token)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user sudah diisi oleh auth middleware
    return successResponse(res, 'Data user berhasil diambil.', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
