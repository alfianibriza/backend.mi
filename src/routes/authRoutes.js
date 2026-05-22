/**
 * =============================================================
 * ROUTES: AUTHENTICATION
 * =============================================================
 * 
 * PENJELASAN KONSEP ROUTING:
 * Route mendefinisikan URL endpoint dan method HTTP yang diterima.
 * Setiap route dihubungkan ke controller function yang menangani logicnya.
 * 
 * Contoh: POST /api/auth/login → authController.login
 * Artinya: Saat client mengirim POST request ke /api/auth/login,
 *          Express akan menjalankan fungsi login di authController.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Route publik (tidak perlu login)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route protected (perlu login / token valid)
router.get('/me', authenticate, authController.getMe);

module.exports = router;
