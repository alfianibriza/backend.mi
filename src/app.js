/**
 * =============================================================
 * EXPRESS APP CONFIGURATION
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * File ini adalah "jantung" dari backend. Di sini kita:
 * 1. Membuat Express application
 * 2. Memasang middleware (CORS, body parser, logger)
 * 3. Mendaftarkan semua route/endpoint API
 * 4. Memasang error handler di paling akhir
 * 
 * ALUR REQUEST:
 * Client Request → CORS → Body Parser → Logger → Route → Controller → Response
 *                                                    ↓ (jika error)
 *                                              Error Handler → Error Response
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const profileRoutes = require('./routes/profileRoutes');
const pmbRoutes = require('./routes/pmbRoutes');
const userRoutes = require('./routes/userRoutes');
const homeSettingRoutes = require('./routes/homeSettingRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const pmbSettingRoutes = require('./routes/pmbSettingRoutes');
const createCrudRoutes = require('./routes/resourceRoutes');

// Import seeder routes || hapus setelah seeder berjalan > lanjut ke baris 108
// const seederRoutes = require('./routes/seederRoutes');

// Import models untuk resource routes
const { Teacher, Achievement, Extracurricular, Facility, Alumni, Schedule } = require('./models');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// ==================== CREATE APP ====================
const app = express();

// ==================== MIDDLEWARE ====================

/**
 * CORS (Cross-Origin Resource Sharing)
 * Karena frontend (port 5173) dan backend (port 5000) berjalan di domain berbeda,
 * browser akan memblokir request secara default (Same-Origin Policy).
 * CORS middleware mengizinkan frontend mengakses API backend.
 */
app.use(cors({
  origin: config.nodeEnv === 'development' ? true : config.frontendUrl,    // Dinamis untuk development di jaringan lokal (LAN)
  credentials: true,              // Izinkan kirim cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body Parser
 * Mengubah raw request body menjadi JavaScript object.
 * Tanpa ini, req.body akan undefined.
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * Morgan Logger
 * Mencatat setiap request yang masuk ke console.
 * Contoh output: POST /api/auth/login 200 15ms
 */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

/**
 * Static Files
 * Membuat folder uploads/ bisa diakses langsung via URL.
 * Contoh: http://localhost:5000/uploads/gambar.jpg
 */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==================== ROUTES ====================

/**
 * Mendaftarkan semua API routes.
 * Setiap route group diberikan prefix /api/...
 * 
 * Contoh lengkap endpoint yang tersedia:
 * POST   /api/auth/login         → Login
 * POST   /api/auth/register      → Register
 * GET    /api/auth/me             → Get current user
 * GET    /api/news                → List berita
 * GET    /api/news/:slug          → Detail berita
 * POST   /api/news                → Buat berita (admin)
 * PUT    /api/news/:id            → Update berita (admin)
 * DELETE /api/news/:id            → Hapus berita (admin)
 * ... dan seterusnya
 */
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/pmb', pmbRoutes);
app.use('/api/users', userRoutes);
app.use('/api/home-settings', homeSettingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pmb-settings', pmbSettingRoutes);

// Import seeder routes || hapus setelah seeder berjalan
// app.use('/api/seeder', seederRoutes);

// Resource routes (menggunakan factory pattern)
app.use('/api/teachers', createCrudRoutes(Teacher, 'Guru', 'photo'));
app.use('/api/achievements', createCrudRoutes(Achievement, 'Prestasi'));
app.use('/api/extracurriculars', createCrudRoutes(Extracurricular, 'Ekstrakurikuler'));
app.use('/api/facilities', createCrudRoutes(Facility, 'Fasilitas'));
app.use('/api/alumni', createCrudRoutes(Alumni, 'Alumni', 'photo'));
app.use('/api/schedules', createCrudRoutes(Schedule, 'Jadwal'));

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'MI Al-Ghazali API is running! 🚀', timestamp: new Date() });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan.`
  });
});

// ==================== ERROR HANDLER (harus paling akhir) ====================
app.use(errorHandler);

module.exports = app;
