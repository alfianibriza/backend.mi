const fs = require('fs');
const path = require('path');

/**
 * Controller for managing Media Library (Pustaka Media)
 */

exports.getAllMedia = (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Check if directory exists
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(uploadDir);
    
    // Filter only image/media files (optional)
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'].includes(ext);
    }).map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    });

    // Sort by newest first
    mediaFiles.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      data: mediaFiles
    });
  } catch (error) {
    console.error('Error reading media library:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pustaka media',
      error: error.message
    });
  }
};

exports.deleteMedia = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({
        success: true,
        message: 'File berhasil dihapus dari pustaka media'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus file',
      error: error.message
    });
  }
};

exports.uploadMedia = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file yang diupload'
      });
    }

    res.status(201).json({
      success: true,
      message: 'File berhasil diupload',
      data: {
        name: req.file.filename,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupload file',
      error: error.message
    });
  }
};
