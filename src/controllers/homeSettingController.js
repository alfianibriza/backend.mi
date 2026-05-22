/**
 * =============================================================
 * CONTROLLER: HOME SETTINGS
 * =============================================================
 * 
 * PENJELASAN:
 * Controller untuk mengelola semua pengaturan tampilan beranda.
 * Admin bisa mengubah hero slides, statistik, program, dan CTA.
 * 
 * Endpoint:
 * GET    /api/home-settings          → Ambil semua setting (public)
 * GET    /api/home-settings/:key     → Ambil setting by section_key (public)
 * PUT    /api/home-settings/:key     → Update setting by section_key (admin)
 * POST   /api/home-settings/init     → Inisialisasi default data (admin)
 * POST   /api/home-settings/upload-image → Upload gambar hero (admin)
 */

const HomeSetting = require('../models/HomeSetting');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// Data default untuk inisialisasi beranda
const defaultHomeData = {
  hero_slides: {
    title: 'Hero Slides',
    content: [
      {
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
        title: 'Membangun Generasi Rabbani',
        subtitle: 'MI Al-Ghazali berkomitmen mencetak generasi yang cerdas dan berakhlakul karimah.'
      },
      {
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop',
        title: 'Lingkungan Belajar Nyaman',
        subtitle: 'Fasilitas modern yang mendukung kreativitas dan kenyamanan siswa dalam belajar.'
      },
      {
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
        title: 'Eksplorasi Bakat & Minat',
        subtitle: 'Berbagai kegiatan ekstrakurikuler untuk mengembangkan potensi setiap anak.'
      }
    ]
  },
  stats: {
    title: 'Statistik',
    content: [
      { label: 'Siswa Aktif', value: '320+', icon: 'GraduationCap', color: 'bg-blue-500' },
      { label: 'Tenaga Pengajar', value: '25+', icon: 'Users', color: 'bg-green-500' },
      { label: 'Tahun Berdiri', value: '20+', icon: 'Calendar', color: 'bg-amber-500' },
      { label: 'Prestasi Siswa', value: '50+', icon: 'Trophy', color: 'bg-purple-500' }
    ]
  },
  programs: {
    title: 'Program Unggulan',
    content: {
      section_title: 'Program Unggulan Kami',
      section_subtitle: 'Menyediakan berbagai program inovatif untuk mendukung perkembangan akademik dan spiritual siswa.',
      items: [
        {
          title: "Tahfidz Al-Qur'an",
          desc: "Program hafalan Al-Qur'an dengan metode yang menyenangkan bagi anak-anak.",
          icon: 'BookOpen',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50'
        },
        {
          title: 'Karakter Islami',
          desc: 'Pembentukan adab dan akhlak mulia berlandaskan nilai-nilai Al-Ghazali.',
          icon: 'Heart',
          color: 'text-rose-600',
          bg: 'bg-rose-50'
        },
        {
          title: 'Kurikulum Merdeka',
          desc: 'Penerapan kurikulum terbaru yang fokus pada pengembangan potensi minat bakat.',
          icon: 'ShieldCheck',
          color: 'text-sky-600',
          bg: 'bg-sky-50'
        }
      ]
    }
  },
  cta: {
    title: 'Call to Action',
    content: {
      title: 'Mulai Perjalanan Pendidikan Terbaik Putra-Putri Anda',
      subtitle: 'Bergabunglah bersama keluarga besar MI Al-Ghazali dan berikan fondasi pendidikan yang kuat berbasis nilai Islam dan karakter unggul.',
      primary_button: { text: 'Daftar Sekarang', link: '/pmb' },
      secondary_button: { text: 'Lihat Fasilitas', link: '/fasilitas' }
    }
  },
  logo: {
    title: 'Logo Madrasah',
    content: {
      logo_url: '',
      favicon_url: '',
      school_name: 'MI Al-Ghazali',
      school_subtitle: 'Madrasah Ibtidaiyah'
    }
  },
  announcement: {
    title: 'Pengumuman Banner',
    content: {
      text: 'Pendaftaran Siswa Baru TA 2024/2025 Telah Dibuka!',
      is_visible: true
    }
  },
  school_info: {
    title: 'Identitas Madrasah',
    content: {
      school_name: 'MI Al-Ghazali',
      school_subtitle: 'Madrasah Ibtidaiyah',
      address: 'Jl. Pendidikan No. 1, Indonesia',
      phone: '(021) 1234-5678',
      email: 'info@mialghazali.sch.id',
      motto: 'Terwujudnya generasi Islam yang berakhlak mulia, cerdas, dan berprestasi.'
    }
  },
  headmaster_greeting: {
    title: 'Sambutan Kepala Sekolah',
    content: {
      title: 'Membentuk Karakter Unggul & Beradab',
      text: 'Assalamualaikum Wr. Wb. MI Al-Ghazali terus berkomitmen untuk memberikan pendidikan terbaik bagi putra-putri bangsa dengan mengintegrasikan nilai-nilai keislaman dan kurikulum modern.',
      name: 'Ust. H. Ahmad Fauzi, M.Pd',
      role: 'Kepala Madrasah',
      image_url: 'https://images.unsplash.com/photo-1577896851231-70ef1469759e?q=80&w=2070&auto=format&fit=crop',
      experience: '20+',
      experience_label: 'Tahun Pengalaman'
    }
  }
};

const homeSettingController = {
  /**
   * GET /api/home-settings
   * Ambil semua pengaturan beranda (public)
   */
  getAll: async (req, res, next) => {
    try {
      const settings = await HomeSetting.findAll({
        order: [['id', 'ASC']]
      });

      // Transform ke object dengan section_key sebagai key
      const result = {};
      settings.forEach(s => {
        // Parse content jika masih berupa string (MySQL JSON behavior)
        let parsedContent = s.content;
        if (typeof parsedContent === 'string') {
          try { parsedContent = JSON.parse(parsedContent); } catch { /* keep as-is */ }
        }
        result[s.section_key] = {
          id: s.id,
          title: s.title,
          content: parsedContent,
          is_active: s.is_active
        };
      });

      return successResponse(res, 'Pengaturan beranda berhasil diambil.', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/home-settings/:key
   * Ambil satu setting berdasarkan section_key (public)
   */
  getByKey: async (req, res, next) => {
    try {
      const setting = await HomeSetting.findOne({
        where: { section_key: req.params.key }
      });
      if (!setting) return errorResponse(res, 'Section tidak ditemukan.', 404);
      // Parse content jika masih berupa string
      const data = setting.toJSON();
      if (typeof data.content === 'string') {
        try { data.content = JSON.parse(data.content); } catch { /* keep as-is */ }
      }
      return successResponse(res, 'Data section berhasil diambil.', data);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/home-settings/:key
   * Update pengaturan section tertentu (admin only)
   */
  update: async (req, res, next) => {
    try {
      const setting = await HomeSetting.findOne({
        where: { section_key: req.params.key }
      });
      if (!setting) return errorResponse(res, 'Section tidak ditemukan.', 404);

      const { content, is_active } = req.body;
      const updateData = {};
      
      if (content !== undefined) updateData.content = content;
      if (is_active !== undefined) updateData.is_active = is_active;

      await setting.update(updateData);
      return successResponse(res, 'Pengaturan beranda berhasil diupdate.', setting);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/home-settings/upload-image
   * Upload gambar untuk hero slide (admin only)
   * Returns path gambar yang bisa dipakai di hero slide
   */
  uploadImage: async (req, res, next) => {
    try {
      if (!req.file) return errorResponse(res, 'File gambar wajib diupload.', 400);
      const imagePath = `/uploads/${req.file.filename}`;
      return successResponse(res, 'Gambar berhasil diupload.', { path: imagePath });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/home-settings/init
   * Inisialisasi data default beranda (admin only)
   * Hanya membuat data jika belum ada (tidak overwrite)
   */
  init: async (req, res, next) => {
    try {
      let created = 0;
      
      for (const [key, data] of Object.entries(defaultHomeData)) {
        const exists = await HomeSetting.findOne({ where: { section_key: key } });
        if (!exists) {
          await HomeSetting.create({
            section_key: key,
            title: data.title,
            content: data.content,
            is_active: true
          });
          created++;
        }
      }

      return successResponse(res, `Inisialisasi beranda selesai. ${created} section baru dibuat.`);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = homeSettingController;
