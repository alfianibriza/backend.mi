/**
 * =============================================================
 * ADMIN SEEDER
 * =============================================================
 * 
 * Membuat akun admin default saat pertama kali setup.
 * Jalankan: node src/seeders/adminSeeder.js
 */

const bcrypt = require('bcryptjs');
const { User, Profile } = require('../models');
const sequelize = require('../config/database');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync semua tabel
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced');

    // Buat admin default
    const existingAdmin = await User.findOne({ where: { email: 'admin@mialghazali.sch.id' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Administrator',
        email: 'admin@mialghazali.sch.id',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@mialghazali.sch.id / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Seed profile sections
    const profileSections = [
      { section_key: 'sejarah', title: 'Sejarah Sekolah', content: 'MI Al-Ghazali didirikan pada tahun 2005 dengan semangat memajukan pendidikan Islam yang berkualitas. Bermula dari sebuah rumah sederhana, kini MI Al-Ghazali telah berkembang menjadi lembaga pendidikan yang dipercaya masyarakat.', sort_order: 1 },
      { section_key: 'visi_misi', title: 'Visi & Misi', content: '<h3>Visi</h3><p>Terwujudnya generasi Islam yang berakhlak mulia, cerdas, dan berprestasi.</p><h3>Misi</h3><ul><li>Menyelenggarakan pendidikan Islam yang berkualitas</li><li>Membina akhlak mulia peserta didik</li><li>Mengembangkan potensi akademik dan non-akademik</li><li>Menciptakan lingkungan belajar yang kondusif</li></ul>', sort_order: 2 },
      { section_key: 'program_kerja', title: 'Program Kerja', content: 'Program kerja MI Al-Ghazali mencakup peningkatan mutu pendidikan, pengembangan kurikulum, pembinaan karakter, dan peningkatan sarana prasarana.', sort_order: 3 },
      { section_key: 'filosofi_logo', title: 'Filosofi Logo', content: 'Logo MI Al-Ghazali melambangkan semangat pendidikan Islam yang berdasarkan Al-Quran dan As-Sunnah, dengan warna hijau melambangkan keislaman dan biru melambangkan ilmu pengetahuan.', sort_order: 4 },
      { section_key: 'sambutan', title: 'Sambutan Kepala Sekolah', content: 'Assalamualaikum Wr. Wb. Puji syukur kehadirat Allah SWT atas segala nikmat dan karunia-Nya. MI Al-Ghazali terus berkomitmen untuk memberikan pendidikan terbaik bagi putra-putri bangsa. Kami percaya bahwa setiap anak memiliki potensi yang luar biasa.', sort_order: 5 },
    ];

    for (const section of profileSections) {
      const existing = await Profile.findOne({ where: { section_key: section.section_key } });
      if (!existing) {
        await Profile.create(section);
      }
    }
    console.log('✅ Profile sections seeded');

    console.log('\n🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
