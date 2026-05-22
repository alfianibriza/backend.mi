/**
 * =============================================================
 * SERVER ENTRY POINT
 * =============================================================
 * 
 * PENJELASAN KONSEP:
 * File ini adalah entry point - file pertama yang dijalankan.
 * Tugasnya:
 * 1. Connect ke database
 * 2. Sync tabel (buat tabel jika belum ada)
 * 3. Start HTTP server
 * 
 * CARA JALANKAN:
 * - Development: npm run dev (menggunakan nodemon, auto-restart)
 * - Production: npm start
 */

const os = require('os');
const app = require('./app');
const sequelize = require('./config/database');
const config = require('./config/config');

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // family can be 'IPv4' or 4 depending on Node version
      if ((iface.family === 'IPv4' || iface.family === 4) && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const localIp = getLocalIp();

const startServer = async () => {
  try {
    // 1. Test koneksi database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // 2. Sync models ke database (buat tabel jika belum ada)
    // alter: true → update tabel jika ada perubahan di model (HANYA untuk development)
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('✅ Database tables synced');

    // 3. Start HTTP server
    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🕌  MI Al-Ghazali API Server                   ║
║                                                  ║
║   🌐  Local:   http://localhost:${config.port}             ║
║   🌐  Network: http://${localIp}:${config.port}       ║
║   📦  Environment: ${config.nodeEnv}              ║
║   🗄️  Database: Connected                        ║
║                                                  ║
║   📚  Health:  http://${localIp}:${config.port}/api/health ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
