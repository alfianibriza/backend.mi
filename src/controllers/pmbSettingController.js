/**
 * =============================================================
 * CONTROLLER: PMB SETTINGS
 * =============================================================
 * 
 * Mengelola konten halaman PMB yang dikelola admin:
 * - Informasi PMB
 * - File unduh pendaftaran  
 * - Pengumuman nama-nama yang diterima
 */

const { PmbSetting, PmbRegistration } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHelper');

/**
 * GET /api/pmb-settings - Get semua PMB settings (public)
 */
const getAll = async (req, res, next) => {
  try {
    const settings = await PmbSetting.findAll({
      where: { is_active: true },
      order: [['section_key', 'ASC'], ['sort_order', 'ASC']]
    });
    return successResponse(res, 'Data PMB settings berhasil diambil.', settings);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pmb-settings/by-section/:key - Get by section_key (public)
 */
const getBySection = async (req, res, next) => {
  try {
    const settings = await PmbSetting.findAll({
      where: { section_key: req.params.key, is_active: true },
      order: [['sort_order', 'ASC']]
    });
    return successResponse(res, 'Data section berhasil diambil.', settings);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pmb-settings/admin - Get semua (admin, termasuk non-aktif)
 */
const getAllAdmin = async (req, res, next) => {
  try {
    const settings = await PmbSetting.findAll({
      order: [['section_key', 'ASC'], ['sort_order', 'ASC']]
    });
    return successResponse(res, 'Data PMB settings berhasil diambil.', settings);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pmb-settings - Create setting (admin)
 */
const create = async (req, res, next) => {
  try {
    const { section_key, title, content, file_url, file_name, academic_year, is_active, sort_order } = req.body;

    if (!section_key || !title) {
      return errorResponse(res, 'Section key dan judul wajib diisi.', 400);
    }

    const setting = await PmbSetting.create({
      section_key,
      title,
      content: content || null,
      file_url: file_url || null,
      file_name: file_name || null,
      academic_year: academic_year || null,
      is_active: is_active !== undefined ? is_active : true,
      sort_order: sort_order || 0
    });

    return successResponse(res, 'PMB setting berhasil dibuat.', setting, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/pmb-settings/:id - Update setting (admin)
 */
const update = async (req, res, next) => {
  try {
    const setting = await PmbSetting.findByPk(req.params.id);
    if (!setting) return errorResponse(res, 'Data tidak ditemukan.', 404);

    const { title, content, file_url, file_name, academic_year, is_active, sort_order, section_key } = req.body;

    await setting.update({
      ...(section_key !== undefined && { section_key }),
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(file_url !== undefined && { file_url }),
      ...(file_name !== undefined && { file_name }),
      ...(academic_year !== undefined && { academic_year }),
      ...(is_active !== undefined && { is_active }),
      ...(sort_order !== undefined && { sort_order })
    });

    return successResponse(res, 'PMB setting berhasil diperbarui.', setting);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/pmb-settings/:id - Hapus setting (admin)
 */
const remove = async (req, res, next) => {
  try {
    const setting = await PmbSetting.findByPk(req.params.id);
    if (!setting) return errorResponse(res, 'Data tidak ditemukan.', 404);

    await setting.destroy();
    return successResponse(res, 'PMB setting berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pmb-settings/accepted - Daftar siswa diterima (public)
 */
const getAcceptedStudents = async (req, res, next) => {
  try {
    const students = await PmbRegistration.findAll({
      where: { status: 'accepted' },
      attributes: ['id', 'registration_number', 'student_name', 'gender', 'previous_school', 'created_at'],
      order: [['student_name', 'ASC']]
    });
    return successResponse(res, 'Daftar siswa diterima.', students);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pmb-settings/init - Initialize default sections (admin)
 */
const initDefaults = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const academicYear = `${year}/${year + 1}`;

    const defaults = [
      {
        section_key: 'informasi',
        title: 'Informasi Pendaftaran',
        content: `<h3>Persyaratan Pendaftaran</h3>
<ul>
<li>Fotokopi Akta Kelahiran (2 lembar)</li>
<li>Fotokopi Kartu Keluarga (2 lembar)</li>
<li>Pas Foto 3x4 (4 lembar)</li>
<li>Fotokopi KTP Orang Tua (2 lembar)</li>
<li>Surat Keterangan dari TK/RA (jika ada)</li>
</ul>

<h3>Jadwal Pendaftaran</h3>
<ul>
<li><strong>Pendaftaran:</strong> 1 Januari - 30 Juni ${year}</li>
<li><strong>Pengumuman:</strong> 15 Juli ${year}</li>
<li><strong>Daftar Ulang:</strong> 16 - 25 Juli ${year}</li>
</ul>

<h3>Biaya Pendaftaran</h3>
<p>Informasi biaya pendaftaran dapat ditanyakan langsung ke sekolah atau melalui kontak yang tersedia.</p>`,
        academic_year: academicYear,
        is_active: true,
        sort_order: 0
      },
      {
        section_key: 'unduh_pendaftaran',
        title: 'Formulir Pendaftaran',
        content: 'Unduh formulir pendaftaran berikut, isi dengan lengkap, dan serahkan ke sekolah bersama berkas persyaratan.',
        file_url: null,
        file_name: null,
        academic_year: academicYear,
        is_active: true,
        sort_order: 0
      },
      {
        section_key: 'pengumuman',
        title: 'Pengumuman Penerimaan Siswa Baru',
        content: `<p>Berikut adalah daftar nama calon peserta didik baru yang dinyatakan <strong>DITERIMA</strong> di MI Al-Ghazali untuk Tahun Ajaran ${academicYear}.</p>
<p>Bagi yang namanya tercantum dalam daftar, diharapkan segera melakukan <strong>daftar ulang</strong> sesuai jadwal yang telah ditentukan.</p>`,
        academic_year: academicYear,
        is_active: true,
        sort_order: 0
      }
    ];

    for (const item of defaults) {
      const exists = await PmbSetting.findOne({ where: { section_key: item.section_key } });
      if (!exists) {
        await PmbSetting.create(item);
      }
    }

    const settings = await PmbSetting.findAll({ order: [['section_key', 'ASC'], ['sort_order', 'ASC']] });
    return successResponse(res, 'Default PMB settings berhasil dibuat.', settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getBySection, getAllAdmin, create, update, remove, getAcceptedStudents, initDefaults };
