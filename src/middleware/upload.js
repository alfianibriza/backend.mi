/**
 * =============================================================
 * MIDDLEWARE: FILE UPLOAD (Multer)
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * Multer adalah middleware untuk menangani multipart/form-data
 * (format yang digunakan saat upload file dari browser).
 * 
 * ALUR UPLOAD:
 * 1. Client kirim file via form dengan enctype="multipart/form-data"
 * 2. Multer menerima file dan menyimpannya ke folder uploads/
 * 3. Info file (nama, path, ukuran) tersedia di req.file
 * 4. Controller menyimpan path file ke database
 */

const multer = require('multer');
const path = require('path');

// Konfigurasi storage: tentukan DIMANA dan DENGAN NAMA APA file disimpan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Simpan ke folder uploads/
  },
  filename: (req, file, cb) => {
    // Buat nama unik: timestamp-random-namaasli.ext
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filter: hanya izinkan tipe file tertentu
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // File diterima
  } else {
    cb(new Error('Tipe file tidak didukung. Gunakan JPG, PNG, GIF, WEBP, atau PDF.'), false);
  }
};

// Buat multer instance dengan konfigurasi
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // Maksimal 5MB
  }
});

module.exports = upload;
