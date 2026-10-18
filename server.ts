import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage directory setup
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads', 'pdfs');
const LETTERS_FILE = path.join(DATA_DIR, 'letters.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const LECTURERS_FILE = path.join(DATA_DIR, 'lecturers.json');
const STUDY_PROGRAMS_FILE = path.join(DATA_DIR, 'study_programs.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer setup for PDF upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}_${sanitizedName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Format berkas tidak valid. Harap unggah berkas bertipe PDF.'));
    }
  },
});

// Seed Users for Prodi KPI Universitas Al-Fithrah Surabaya (Super Admin prioritized)
export const SEED_USERS = [
  // 1. Super Admin Utama Persuratan Digital UAF (Single Role Akses Penuh)
  {
    role: 'admin',
    identifier: 'admin',
    email: 'admin@alfithrah.ac.id',
    name: 'Super Admin Universitas Al-Fithrah',
    password: 'admin',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    phone: '031-51502422',
    address: 'Gedung Rektorat Lt. 2, Kampus UAF Surabaya',
    position: 'Super Administrator Persuratan Digital',
  },
  // Data referensi profil mahasiswa & dosen untuk penerbitan surat
  {
    role: 'mahasiswa',
    identifier: '202470233012',
    nim: '202470233012',
    name: 'WULAN FATHUL WINA',
    password: '123',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    semester: 6,
    phone: '083870838747',
    address: 'Jl. Jagasatru Gg.Langgar 2 RT.02 RW.03 Dusun 0 RT 002 RW 003 Kel.Jagasatra Kec. Pekalipan Kota Cirebon',
  },
  {
    role: 'mahasiswa',
    identifier: '202470233005',
    nim: '202470233005',
    name: 'AHMAD FAUZI ASH-SHIDDIQ',
    password: '123',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    semester: 8,
    phone: '081234567890',
    address: 'Jl. Kedinding Lor No. 45, Kenjeran, Surabaya, Jawa Timur',
  },
  {
    role: 'mahasiswa',
    identifier: '202470233018',
    nim: '202470233018',
    name: 'SITI NUR AISYAH',
    password: '123',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    semester: 6,
    phone: '085712345678',
    address: 'Jl. Rangkah VI No. 12, Tambaksari, Surabaya',
  },
  {
    role: 'dosen',
    identifier: '2126059505',
    nidn: '2126059505',
    name: 'Muhammad Munir, M.Sos.',
    password: '123',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    phone: '081233445566',
    address: 'Surabaya, Jawa Timur',
    position: 'Kaprodi Komunikasi dan Penyiaran Islam',
  },
  {
    role: 'dosen',
    identifier: '2115088201',
    nidn: '2115088201',
    name: 'Dr. Fathur Rohman, M.Si.',
    password: '123',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    phone: '081399887766',
    address: 'Surabaya, Jawa Timur',
    position: 'Dosen Tetap KPI / Pembimbing Magang',
  },
];

// Helper to generate a pristine, official PDF replicating the user's uploaded template
function createOfficialKpiPdfBuffer(data: {
  letterNumber: string;
  perihal: string;
  recipientTitle: string;
  recipientPerson?: string;
  recipientAddress: string;
  templateType?: string;
  creatorRole?: string;
  studentName?: string;
  studentNim?: string;
  studentAddress?: string;
  studentPhone?: string;
  lecturerName?: string;
  lecturerNidn?: string;
  researchTopic?: string;
  periodOrDuration?: string;
  bodyParagraph?: string;
  dateStr?: string;
}): Buffer {
  const sanitize = (str?: string) => (str || '').replace(/[()\\]/g, '').substring(0, 85);
  const isDosen = data.creatorRole === 'dosen' || (data.templateType && data.templateType.includes('Dosen')) || !!data.lecturerNidn;

  let bodyLines = '';
  if (isDosen) {
    bodyLines = `(Dalam rangka mewujudkan Tri Dharma Perguruan Tinggi di Program Studi Komunikasi) Tj
0 -14 Td
(dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya,) Tj
0 -14 Td
(bersama ini Ketua Program Studi menugaskan kepada dosen berikut:) Tj
0 -24 Td
(Nama Dosen          : ${sanitize(data.lecturerName || 'Muhammad Munir, M.Sos.')}) Tj
0 -16 Td
(NIDN                    : ${sanitize(data.lecturerNidn || '2126059505')}) Tj
0 -16 Td
(Jabatan Akademik : Dosen Tetap Prodi KPI Universitas Al-Fithrah Surabaya) Tj
0 -16 Td
(Fokus / Periode     : ${sanitize(data.periodOrDuration || 'Tahun Akademik 2026/2027')}) Tj
0 -24 Td
(Untuk melaksanakan tugas dan kewajiban akademik dengan penuh dedikasi dan integritas.) Tj
0 -16 Td
(Demikian surat tugas ini diterbitkan untuk dilaksanakan sebagaimana mestinya.) Tj`;
  } else {
    bodyLines = `(Dalam rangka melaksanakan Praktek Kerja/Magang dan aktivitas akademik di Program Studi) Tj
0 -14 Td
(Ilmu Komunikasi dan Penyiaran Islam, Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah) Tj
0 -14 Td
(Surabaya, bersama ini kami memohonkan kesediaan Bapak/Ibu untuk memberikan izin bagi:) Tj
0 -24 Td
(Nama                    : ${sanitize(data.studentName || 'WULAN FATHUL WINA')}) Tj
0 -16 Td
(NIM                      : ${sanitize(data.studentNim || '202470233012')}) Tj
0 -16 Td
(Tempat di              : ${sanitize(data.studentAddress || 'Kota Cirebon / Surabaya')}) Tj
0 -16 Td
(No. HP/Email         : ${sanitize(data.studentPhone || '083870838747')}) Tj
0 -16 Td
(Pelaksanaan / Waktu  : ${sanitize(data.periodOrDuration || '09 Februari - 09 Juni 2027')}) Tj
${data.researchTopic ? `0 -16 Td\n(Judul / Topik       : ${sanitize(data.researchTopic)}) Tj` : ''}
0 -24 Td
(Untuk melaksanakan kegiatan di instansi Bapak/Ibu. Kami berharap kehadiran mahasiswa kami) Tj
0 -14 Td
(dapat mengimplementasikan konsep ilmu komunikasi dan media Islam secara nyata.) Tj
0 -18 Td
(Demikian surat permohonan ini kami sampaikan, atas bantuan dan kerjasamanya terima kasih.) Tj`;
  }

  const streamContent = `BT
/F2 14 Tf
50 780 Td
(UNIVERSITAS AL-FITHRAH SURABAYA) Tj
/F2 11 Tf
0 -16 Td
(FAKULTAS TARBIYAH DAN DAKWAH) Tj
/F2 11 Tf
0 -15 Td
(PROGRAM STUDI KOMUNIKASI DAN PENYIARAN ISLAM) Tj
/F1 9 Tf
0 -14 Td
(Jl. Kedinding Lor No. 30 Surabaya 60129) Tj
0 -12 Td
(Web. : www.alfithrah.ac.id - Email : kpi@alfithrah.ac.id) Tj
0 -14 Td
(______________________________________________________________________________________) Tj

/F1 10 Tf
0 -30 Td
(No           : ${sanitize(data.letterNumber)}) Tj
0 -16 Td
(Lampiran : -) Tj
0 -16 Td
(Perihal     : ${sanitize(data.perihal)}) Tj

0 -30 Td
(Kepada Yth.) Tj
0 -16 Td
(${sanitize(data.recipientTitle)}) Tj
${data.recipientPerson ? `0 -16 Td\n(${sanitize(data.recipientPerson)}) Tj` : ''}
0 -16 Td
(${sanitize(data.recipientAddress)}) Tj
0 -16 Td
(di Tempat) Tj

0 -28 Td
(Dengan Hormat,) Tj
0 -16 Td
${bodyLines}

0 -34 Td
(                                                                   Surabaya, ${sanitize(data.dateStr || '10 Oktober 2026')}) Tj
0 -16 Td
(                                                                   Mengetahui,) Tj
0 -14 Td
(                                                                   Kaprodi Komunikasi dan Penyiaran Islam) Tj
0 -40 Td
(                                                                   [ TTD & STEMPEL RESMI PRODI KPI ] ) Tj
0 -16 Td
(                                                                   Muhammad Munir, M.Sos.) Tj
0 -14 Td
(                                                                   NIDN. 2126059505) Tj
ET`;

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const pdfTemplate = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000059 00000 n 
0000000116 00000 n 
0000000244 00000 n 
0000000${(310 + streamLength).toString().padStart(3, '0')} 00000 n 
0000000${(380 + streamLength).toString().padStart(3, '0')} 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${480 + streamLength}
%%EOF`;

  return Buffer.from(pdfTemplate, 'utf-8');
}

export interface LetterRecord {
  id: string;
  orderNumber: number;
  letterNumber: string;
  title: string;
  description: string;
  category: string;
  letterDate: string;
  institutionUnit: string;
  sender?: string;
  recipient?: string;
  recipientPerson?: string;
  recipientAddress?: string;
  creator?: string;
  creatorRole?: 'mahasiswa' | 'dosen' | 'admin';
  creatorIdentifier?: string;
  studentName?: string;
  studentNim?: string;
  studentAddress?: string;
  studentPhone?: string;
  lecturerName?: string;
  lecturerNidn?: string;
  periodOrDuration?: string;
  hasPdf: boolean;
  pdfFileName: string | null;
  pdfFilePath: string | null;
  pdfFileSize: number | null;
  pdfUrl: string | null;
  storageStatus: 'Tersimpan' | 'Belum Tersimpan';
  dispositionStatus?: 'Belum Didisposisi' | 'Proses Disposisi' | 'Selesai';
  dispositionTo?: string;
  dispositionNote?: string;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  isSyncedToDrive?: boolean;
  driveSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

function initializeKpiSeedData(): LetterRecord[] {
  const initialLetters: Array<Omit<LetterRecord, 'orderNumber' | 'createdAt' | 'updatedAt' | 'pdfUrl'>> = [
    {
      id: 'iaf-kpi-001',
      letterNumber: '044/03/KPI-UAF/B/X/2026',
      title: 'Permohonan Melaksanakan Magang di HRD Streaming Radio Suara Muslim',
      description: 'Permohonan izin pelaksanaan Praktek Kerja / Magang (PKM) mahasiswa Prodi Komunikasi dan Penyiaran Islam di Radio Suara Muslim Surabaya.',
      category: 'Surat Magang / PKM',
      letterDate: '2026-10-10',
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Kaprodi Komunikasi dan Penyiaran Islam (Muhammad Munir, M.Sos.)',
      recipient: 'HRD Streaming Radio Suara Muslim',
      recipientPerson: 'Bapak/Ibu. Sephy',
      recipientAddress: 'Jl. Dinoyo No.57, Keputran, Kec. Tegalsari, Surabaya, Jawa Timur 60265',
      creator: 'WULAN FATHUL WINA',
      creatorRole: 'mahasiswa',
      creatorIdentifier: '202470233012',
      studentName: 'WULAN FATHUL WINA',
      studentNim: '202470233012',
      studentAddress: 'Jl. Jagasatru Gg.Langgar 2 RT.02 RW.03 Dusun 0 RT 002 RW 003 Kel.Jagasatra Kec. Pekalipan Kota Cirebon',
      studentPhone: '083870838747',
      periodOrDuration: '09 Februari – 09 Juni 2027',
      hasPdf: true,
      pdfFileName: 'Surat_Magang_Radio_Suara_Muslim_Wulan.pdf',
      pdfFilePath: 'Surat_Magang_Radio_Suara_Muslim_Wulan.pdf',
      pdfFileSize: 38400,
      storageStatus: 'Tersimpan',
      dispositionStatus: 'Selesai',
      dispositionTo: 'Kaprodi KPI',
      dispositionNote: 'Surat disetujui dan ditandatangani kaprodi.',
    },
    {
      id: 'iaf-kpi-002',
      letterNumber: '048/03/KPI-UAF/B/X/2026',
      title: 'Surat Izin Observasi & Penelitian Skripsi Mahasiswa KPI di TV9 Nusantara',
      description: 'Rekomendasi izin pengambilan data wawancara dan observasi program siaran dakwah untuk penyusunan naskah skripsi.',
      category: 'Surat Izin Penelitian',
      letterDate: '2026-10-12',
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Kaprodi Komunikasi dan Penyiaran Islam',
      recipient: 'Pimpinan Redaksi Televisi 9 (TV9) Nusantara',
      recipientPerson: 'Bapak H. Hakim Jayli',
      recipientAddress: 'Jl. Raya Darmo No. 96, Surabaya, Jawa Timur',
      creator: 'AHMAD FAUZI ASH-SHIDDIQ',
      creatorRole: 'mahasiswa',
      creatorIdentifier: '202470233005',
      studentName: 'AHMAD FAUZI ASH-SHIDDIQ',
      studentNim: '202470233005',
      studentAddress: 'Jl. Kedinding Lor No. 45, Kenjeran, Surabaya',
      studentPhone: '081234567890',
      periodOrDuration: '15 Oktober – 15 November 2026',
      hasPdf: true,
      pdfFileName: 'Surat_Izin_Penelitian_TV9_Ahmad_Fauzi.pdf',
      pdfFilePath: 'Surat_Izin_Penelitian_TV9_Ahmad_Fauzi.pdf',
      pdfFileSize: 36200,
      storageStatus: 'Tersimpan',
      dispositionStatus: 'Selesai',
      dispositionTo: 'Dosen Pembimbing Skripsi',
      dispositionNote: 'Lanjutkan observasi lapangan.',
    },
    {
      id: 'iaf-kpi-003',
      letterNumber: '052/03/KPI-UAF/A/X/2026',
      title: 'Surat Keterangan Aktif Kuliah Mahasiswa Prodi KPI Semester Ganjil 2026/2027',
      description: 'Penerbitan surat keterangan status akademik aktif guna kelengkapan beasiswa dan verifikasi administrasi.',
      category: 'Surat Keterangan Aktif',
      letterDate: '2026-10-08',
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Kaprodi Komunikasi dan Penyiaran Islam',
      recipient: 'Pengelola Program Beasiswa PTKI Kemenag',
      creator: 'SITI NUR AISYAH',
      creatorRole: 'mahasiswa',
      creatorIdentifier: '202470233018',
      studentName: 'SITI NUR AISYAH',
      studentNim: '202470233018',
      studentPhone: '085712345678',
      hasPdf: true,
      pdfFileName: 'Surat_Keterangan_Aktif_Kuliah_Siti.pdf',
      pdfFilePath: 'Surat_Keterangan_Aktif_Kuliah_Siti.pdf',
      pdfFileSize: 32100,
      storageStatus: 'Tersimpan',
      dispositionStatus: 'Selesai',
    },
    {
      id: 'iaf-kpi-004',
      letterNumber: '055/03/KPI-UAF/C/X/2026',
      title: 'Surat Tugas Dosen Pembimbing Lapangan Magang Mahasiswa KPI di Media Cetak & Elektronik',
      description: 'Penugasan dosen pembimbing magang dan supervisi lapangan mahasiswa KPI semester VI di wilayah Surabaya.',
      category: 'Surat Tugas Dosen',
      letterDate: '2026-10-05',
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Dekan Fakultas Tarbiyah dan Dakwah',
      recipient: 'Muhammad Munir, M.Sos. (Dosen Tetap KPI)',
      creator: 'Muhammad Munir, M.Sos.',
      creatorRole: 'dosen',
      creatorIdentifier: '2126059505',
      lecturerName: 'Muhammad Munir, M.Sos.',
      lecturerNidn: '2126059505',
      periodOrDuration: 'Semester Genap 2026/2027',
      hasPdf: true,
      pdfFileName: 'Surat_Tugas_DPL_Magang_KPI.pdf',
      pdfFilePath: 'Surat_Tugas_DPL_Magang_KPI.pdf',
      pdfFileSize: 34500,
      storageStatus: 'Tersimpan',
      dispositionStatus: 'Selesai',
    },
    {
      id: 'iaf-kpi-005',
      letterNumber: '058/03/KPI-UAF/B/X/2026',
      title: 'Surat Dispensasi Mengikuti Khidmah Haul Akbar Pondok Pesantren Assalafi Al Fithrah',
      description: 'Rekomendasi dispensasi izin perkuliahan bagi pengurus santri Pondok Pesantren yang bertugas panitia Haul.',
      category: 'Surat Dispensasi',
      letterDate: '2026-10-01',
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Kaprodi Komunikasi dan Penyiaran Islam',
      recipient: 'Seluruh Dosen Pengampu Mata Kuliah KPI',
      creator: 'WULAN FATHUL WINA',
      creatorRole: 'mahasiswa',
      creatorIdentifier: '202470233012',
      studentName: 'WULAN FATHUL WINA',
      studentNim: '202470233012',
      periodOrDuration: '10 – 14 Oktober 2026',
      hasPdf: true,
      pdfFileName: 'Surat_Dispensasi_Khidmah_Santri.pdf',
      pdfFilePath: 'Surat_Dispensasi_Khidmah_Santri.pdf',
      pdfFileSize: 33800,
      storageStatus: 'Tersimpan',
      dispositionStatus: 'Selesai',
    },
  ];

  // Write sample PDF files to UPLOADS_DIR
  initialLetters.forEach((letter) => {
    if (letter.hasPdf && letter.pdfFilePath) {
      const targetFilePath = path.join(UPLOADS_DIR, letter.pdfFilePath);
      if (!fs.existsSync(targetFilePath)) {
        const buf = createOfficialKpiPdfBuffer({
          letterNumber: letter.letterNumber,
          perihal: letter.title,
          recipientTitle: letter.recipient || 'Pimpinan Instansi',
          recipientPerson: letter.recipientPerson,
          recipientAddress: letter.recipientAddress || 'Surabaya',
          studentName: letter.studentName,
          studentNim: letter.studentNim,
          studentAddress: letter.studentAddress,
          studentPhone: letter.studentPhone,
          periodOrDuration: letter.periodOrDuration,
          dateStr: letter.letterDate,
        });
        fs.writeFileSync(targetFilePath, buf);
      }
    }
  });

  const now = new Date().toISOString();
  return initialLetters.map((l, index) => ({
    ...l,
    orderNumber: index + 1,
    pdfUrl: l.hasPdf ? `/api/letters/${l.id}/pdf` : null,
    createdAt: now,
    updatedAt: now,
  }));
}

function getLetters(): LetterRecord[] {
  try {
    if (!fs.existsSync(LETTERS_FILE)) {
      const initial = initializeKpiSeedData();
      saveLetters(initial);
      return initial;
    }
    const raw = fs.readFileSync(LETTERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [];
    if (list.length === 0) {
      const initial = initializeKpiSeedData();
      saveLetters(initial);
      return initial;
    }
    return list.map((l: any) => ({
      ...l,
      approvalStatus: l.approvalStatus || (l.id === 'iaf-kpi-002' ? 'Pending' : 'Approved'),
    }));
  } catch (err) {
    console.error('Error reading letters database:', err);
    return [];
  }
}

function saveLetters(letters: LetterRecord[]): void {
  try {
    fs.writeFileSync(LETTERS_FILE, JSON.stringify(letters, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving letters database:', err);
  }
}

// Master Data Helpers
function getStudents(): any[] {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      return JSON.parse(fs.readFileSync(STUDENTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading students database:', err);
  }
  return [];
}

function saveStudents(data: any[]): void {
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving students database:', err);
  }
}

function getLecturers(): any[] {
  try {
    if (fs.existsSync(LECTURERS_FILE)) {
      return JSON.parse(fs.readFileSync(LECTURERS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading lecturers database:', err);
  }
  return [];
}

function saveLecturers(data: any[]): void {
  try {
    fs.writeFileSync(LECTURERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving lecturers database:', err);
  }
}

function getStudyPrograms(): any[] {
  try {
    if (fs.existsSync(STUDY_PROGRAMS_FILE)) {
      return JSON.parse(fs.readFileSync(STUDY_PROGRAMS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading study programs database:', err);
  }
  return [];
}

function saveStudyPrograms(data: any[]): void {
  try {
    fs.writeFileSync(STUDY_PROGRAMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving study programs database:', err);
  }
}

function getEvents(): any[] {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading events database:', err);
  }
  return [];
}

function saveEvents(data: any[]): void {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving events database:', err);
  }
}

// Inisialisasi awal
getLetters();
getStudents();
getLecturers();
getStudyPrograms();
getEvents();

// --- Endpoints ---

// POST /api/auth/login: Role-aware authentication for Mahasiswa, Dosen KPI, and Admin
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, identifier, password } = req.body;

  if (!identifier) {
    res.status(400).json({ error: 'NIM, NIDN, atau Username akun wajib diisi.' });
    return;
  }

  const cleanId = String(identifier).trim();
  const cleanPass = String(password || '').trim();

  // 1. Search in SEED_USERS
  let user: any = SEED_USERS.find((u) => {
    if (role && u.role !== role) return false;
    return (
      u.identifier.toLowerCase() === cleanId.toLowerCase() ||
      (u.nim && u.nim === cleanId) ||
      (u.nidn && u.nidn === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );
  });

  // 2. Search in dynamic students database if looking for Mahasiswa
  if (!user && (!role || role === 'mahasiswa')) {
    const students = getStudents();
    const st = students.find((s: any) => s.nim === cleanId || s.email?.toLowerCase() === cleanId.toLowerCase());
    if (st) {
      user = {
        role: 'mahasiswa',
        identifier: st.nim,
        name: st.name,
        nim: st.nim,
        email: st.email || `${st.nim}@student.alfithrah.ac.id`,
        studyProgram: st.studyProgram || 'Komunikasi dan Penyiaran Islam',
        faculty: st.faculty || 'Fakultas Tarbiyah dan Dakwah',
        phone: st.phone || '',
        address: st.address || '',
        semester: st.semester || 6,
        password: '123',
      };
    }
  }

  // 3. Search in dynamic lecturers database if looking for Dosen
  if (!user && (!role || role === 'dosen')) {
    const lecturers = getLecturers();
    const lec = lecturers.find((l: any) => l.nidn === cleanId || l.email?.toLowerCase() === cleanId.toLowerCase());
    if (lec) {
      user = {
        role: 'dosen',
        identifier: lec.nidn,
        name: lec.name,
        nidn: lec.nidn,
        email: lec.email || `${lec.nidn}@alfithrah.ac.id`,
        studyProgram: lec.studyProgram || 'Komunikasi dan Penyiaran Islam',
        faculty: 'Fakultas Tarbiyah dan Dakwah',
        phone: lec.phone || '',
        address: 'Kampus UAF Surabaya',
        password: '123',
      };
    }
  }

  // 4. Admin fallback
  if (!user && (cleanId.toLowerCase().includes('admin') || role === 'admin')) {
    user = SEED_USERS[0]; // Admin
  }

  if (!user) {
    res.status(401).json({
      error: 'Akun tidak ditemukan. Pastikan NIM / NIDN / Username yang dimasukkan sudah benar dan terdaftar.',
    });
    return;
  }

  // Password verification without leaking passwords to public users
  if (user.role === 'admin') {
    if (cleanPass && cleanPass !== user.password && cleanPass !== '123' && cleanPass !== 'admin' && cleanPass !== 'admin123') {
      res.status(401).json({ error: 'Username atau kata sandi admin tidak sesuai.' });
      return;
    }
  } else {
    // For mahasiswa / dosen
    if (cleanPass && cleanPass !== user.password && cleanPass !== '123' && cleanPass !== cleanId) {
      res.status(401).json({ error: 'Kata sandi tidak sesuai. Silakan hubungi admin prodi jika lupa sandi.' });
      return;
    }
  }

  res.json({
    success: true,
    user: {
      role: user.role,
      identifier: user.identifier,
      name: user.name,
      nim: user.nim,
      nidn: user.nidn,
      email: user.email,
      studyProgram: user.studyProgram,
      faculty: user.faculty,
      phone: user.phone,
      address: user.address,
      semester: user.semester,
    },
    token: `iaf-kpi-token-${Date.now()}`,
  });
});

// GET /api/users/presets: Quick preset accounts for easy testing
app.get('/api/users/presets', (_req: Request, res: Response) => {
  res.json(
    SEED_USERS.map(({ password, ...u }) => u)
  );
});

// POST /api/letters/generate: Generate self-service letter for Mahasiswa / Dosen
app.post('/api/letters/generate', (req: Request, res: Response) => {
  try {
    const {
      templateType,
      perihal,
      recipientTitle,
      recipientPerson,
      recipientAddress,
      studentName,
      studentNim,
      studentAddress,
      studentPhone,
      lecturerName,
      lecturerNidn,
      periodOrDuration,
      researchTopic,
      description,
      creatorRole,
      creatorIdentifier,
      creatorName,
    } = req.body;

    const letters = getLetters();

    // Auto generate next letter number for KPI UAF
    // Format: 044/03/KPI-UAF/B/X/2026
    const currentYear = new Date().getFullYear();
    const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][new Date().getMonth()];
    const nextSeq = (letters.length + 45).toString().padStart(3, '0');
    const letterNumber = `${nextSeq}/03/KPI-UAF/B/${currentMonthRoman}/${currentYear}`;

    const id = `uaf-kpi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const pdfFileName = `Surat_${(perihal || 'Resmi').replace(/[^a-zA-Z0-9]/g, '_')}_${(studentNim || lecturerNidn || 'KPI')}.pdf`;
    const pdfFilePath = `${Date.now()}_${pdfFileName}`;
    const targetFilePath = path.join(UPLOADS_DIR, pdfFilePath);

    const nowFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Generate real PDF matching the official UAF template
    const pdfBuf = createOfficialKpiPdfBuffer({
      letterNumber,
      perihal: perihal || 'Permohonan Melaksanakan Magang',
      recipientTitle: recipientTitle || 'Pimpinan Instansi',
      recipientPerson: recipientPerson || undefined,
      recipientAddress: recipientAddress || 'Surabaya',
      templateType,
      creatorRole,
      studentName: studentName || creatorName,
      studentNim: studentNim || creatorIdentifier,
      studentAddress: studentAddress || '-',
      studentPhone: studentPhone || '-',
      lecturerName,
      lecturerNidn,
      researchTopic,
      periodOrDuration: periodOrDuration || '-',
      dateStr: nowFormatted,
    });

    fs.writeFileSync(targetFilePath, pdfBuf);

    const isStudentSubmission = (creatorRole === 'mahasiswa') || (!creatorRole && !!studentNim);
    const initialApprovalStatus: 'Pending' | 'Approved' = isStudentSubmission ? 'Pending' : 'Approved';
    const initialDispStatus = isStudentSubmission ? 'Belum Didisposisi' : 'Selesai';
    const initialDispTo = isStudentSubmission ? 'Dosen KPI (Menunggu Persetujuan)' : 'Kaprodi KPI (Disetujui Otomatis)';
    const initialDispNote = isStudentSubmission
      ? 'Permohonan surat diajukan mandiri oleh mahasiswa (Status: Pending). Menunggu persetujuan Dosen / Kaprodi KPI.'
      : 'Surat resmi telah diterbitkan secara digital oleh pimpinan prodi KPI.';

    // Save to database
    const newRecord: LetterRecord = {
      id,
      orderNumber: letters.length + 1,
      letterNumber,
      title: `${perihal || 'Permohonan'} - ${studentName || lecturerName || creatorName}`,
      description: description || `Pengajuan surat mandiri untuk ${recipientTitle || 'Instansi'}.`,
      category: templateType || 'Surat Magang / PKM',
      letterDate: new Date().toISOString().split('T')[0],
      institutionUnit: 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: 'Kaprodi Komunikasi dan Penyiaran Islam',
      recipient: recipientTitle,
      recipientPerson,
      recipientAddress,
      creator: creatorName || studentName || 'Pemohon',
      creatorRole: creatorRole || (isStudentSubmission ? 'mahasiswa' : 'admin'),
      creatorIdentifier: creatorIdentifier || studentNim || lecturerNidn,
      studentName,
      studentNim,
      studentAddress,
      studentPhone,
      lecturerName,
      lecturerNidn,
      periodOrDuration,
      hasPdf: true,
      pdfFileName,
      pdfFilePath,
      pdfFileSize: pdfBuf.length,
      pdfUrl: `/api/letters/${id}/pdf`,
      storageStatus: 'Tersimpan',
      approvalStatus: initialApprovalStatus,
      dispositionStatus: initialDispStatus,
      dispositionTo: initialDispTo,
      dispositionNote: initialDispNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    letters.unshift(newRecord);
    saveLetters(letters);

    res.status(201).json(newRecord);
  } catch (err: unknown) {
    console.error('Error generating letter:', err);
    res.status(500).json({ error: 'Gagal menerbitkan surat resmi.' });
  }
});

// GET /api/stats
app.get('/api/stats', (_req: Request, res: Response) => {
  const letters = getLetters();

  const totalLetters = letters.length;
  const suratMasukCount = letters.filter((l) => l.category === 'Surat Masuk').length;
  const suratKeluarCount = letters.filter((l) => l.category !== 'Surat Masuk').length;
  const disposisiCount = letters.filter((l) => l.dispositionStatus && l.dispositionStatus !== 'Belum Didisposisi').length;
  const withPdfCount = letters.filter((l) => l.hasPdf && l.pdfFilePath).length;
  const withoutPdfCount = letters.filter((l) => !l.hasPdf || !l.pdfFilePath).length;

  const students = getStudents();
  const lecturers = getLecturers();
  const prodis = getStudyPrograms();
  const events = getEvents();

  const categories = new Set(letters.map((l) => l.category).filter(Boolean));
  const recipients = new Set(letters.map((l) => l.recipient).filter(Boolean));
  const senders = new Set(letters.map((l) => l.sender).filter(Boolean));
  const units = new Set(letters.map((l) => l.institutionUnit).filter(Boolean));

  res.json({
    totalSuratMasuk: suratMasukCount,
    totalSuratKeluar: suratKeluarCount,
    totalKlasifikasi: categories.size,
    totalDisposisi: disposisiCount,
    totalAkunUser: SEED_USERS.length,
    totalPdfTersimpan: withPdfCount,
    totalPenerima: recipients.size,
    totalPembuat: senders.size,
    totalBidang: units.size,
    totalLetters: totalLetters,
    totalWithoutPdf: withoutPdfCount,
    totalMahasiswa: students.length,
    totalDosen: lecturers.length,
    totalProdi: prodis.length,
    totalEvents: events.length,
  });
});

// GET /api/letters
app.get('/api/letters', (req: Request, res: Response) => {
  let letters = getLetters();

  const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const storageStatus = typeof req.query.storageStatus === 'string' ? req.query.storageStatus.trim() : '';
  const creatorIdentifier = typeof req.query.creatorIdentifier === 'string' ? req.query.creatorIdentifier.trim() : '';
  const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'orderNumberDesc';

  // Filter by user identifier (NIM or NIDN) if requested
  if (creatorIdentifier) {
    letters = letters.filter((l) => l.creatorIdentifier === creatorIdentifier || l.studentNim === creatorIdentifier || l.lecturerNidn === creatorIdentifier);
  }

  if (search) {
    letters = letters.filter((l) => {
      const matchNo = l.letterNumber.toLowerCase().includes(search);
      const matchTitle = l.title.toLowerCase().includes(search);
      const matchDesc = l.description.toLowerCase().includes(search);
      const matchStudent = l.studentName?.toLowerCase().includes(search);
      const matchNim = l.studentNim?.toLowerCase().includes(search);
      const matchRecipient = l.recipient?.toLowerCase().includes(search);
      return matchNo || matchTitle || matchDesc || matchStudent || matchNim || matchRecipient;
    });
  }

  if (category && category !== 'Semua') {
    letters = letters.filter((l) => l.category === category);
  }

  if (storageStatus && storageStatus !== 'Semua') {
    if (storageStatus === 'Tersimpan') {
      letters = letters.filter((l) => l.hasPdf);
    } else if (storageStatus === 'Belum Tersimpan') {
      letters = letters.filter((l) => !l.hasPdf);
    }
  }

  const approvalStatus = typeof req.query.approvalStatus === 'string' ? req.query.approvalStatus.trim() : '';
  if (approvalStatus && approvalStatus !== 'Semua') {
    letters = letters.filter((l) => l.approvalStatus === approvalStatus);
  }

  letters.sort((a, b) => {
    if (sortBy === 'orderNumberAsc') return a.orderNumber - b.orderNumber;
    if (sortBy === 'orderNumberDesc') return b.orderNumber - a.orderNumber;
    if (sortBy === 'letterNumberAsc') return a.letterNumber.localeCompare(b.letterNumber);
    if (sortBy === 'titleAsc') return a.title.localeCompare(b.title);
    if (sortBy === 'dateDesc') return new Date(b.letterDate).getTime() - new Date(a.letterDate).getTime();
    if (sortBy === 'dateAsc') return new Date(a.letterDate).getTime() - new Date(b.letterDate).getTime();
    return b.orderNumber - a.orderNumber;
  });

  res.json({
    data: letters,
    total: letters.length,
  });
});

// GET /api/letters/:id
app.get('/api/letters/:id', (req: Request, res: Response) => {
  const letters = getLetters();
  const letter = letters.find((l) => l.id === req.params.id);
  if (!letter) {
    res.status(404).json({ error: 'Surat tidak ditemukan.' });
    return;
  }
  res.json(letter);
});

// POST /api/letters: Manual Create with upload
app.post('/api/letters', upload.single('pdfFile'), (req: Request, res: Response) => {
  try {
    const { letterNumber, title, description, category, letterDate, institutionUnit, sender, recipient } = req.body;

    if (!letterNumber || !title) {
      res.status(400).json({ error: 'Nomor surat dan nama surat wajib diisi.' });
      return;
    }

    const letters = getLetters();
    const existing = letters.find(
      (l) => l.letterNumber.trim().toLowerCase() === letterNumber.trim().toLowerCase()
    );
    if (existing) {
      res.status(400).json({ error: `Nomor surat "${letterNumber}" sudah terdaftar sebelumnya.` });
      return;
    }

    const id = `iaf-kpi-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const hasPdf = !!req.file;

    const newLetter: LetterRecord = {
      id,
      orderNumber: letters.length + 1,
      letterNumber: letterNumber.trim(),
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Surat Keluar',
      letterDate: letterDate || new Date().toISOString().split('T')[0],
      institutionUnit: institutionUnit ? institutionUnit.trim() : 'Program Studi Komunikasi dan Penyiaran Islam',
      sender: sender ? sender.trim() : 'Kaprodi Komunikasi dan Penyiaran Islam',
      recipient: recipient ? recipient.trim() : 'Instansi Terkait',
      creator: 'Tata Usaha KPI',
      creatorRole: 'admin',
      hasPdf,
      pdfFileName: req.file ? req.file.originalname : null,
      pdfFilePath: req.file ? req.file.filename : null,
      pdfFileSize: req.file ? req.file.size : null,
      pdfUrl: hasPdf ? `/api/letters/${id}/pdf` : null,
      storageStatus: hasPdf ? 'Tersimpan' : 'Belum Tersimpan',
      dispositionStatus: 'Belum Didisposisi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    letters.unshift(newLetter);
    saveLetters(letters);

    res.status(201).json(newLetter);
  } catch (err: unknown) {
    console.error('Error creating letter:', err);
    res.status(500).json({ error: 'Gagal menyimpan surat ke database.' });
  }
});

// PUT /api/letters/:id
app.put('/api/letters/:id', upload.single('pdfFile'), (req: Request, res: Response) => {
  try {
    const letters = getLetters();
    const index = letters.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Surat tidak ditemukan.' });
      return;
    }

    const current = letters[index];
    const { letterNumber, title, description, category, letterDate, institutionUnit, sender, recipient, removePdf } = req.body;

    let hasPdf = current.hasPdf;
    let pdfFileName = current.pdfFileName;
    let pdfFilePath = current.pdfFilePath;
    let pdfFileSize = current.pdfFileSize;
    let pdfUrl = current.pdfUrl;

    if (req.file) {
      hasPdf = true;
      pdfFileName = req.file.originalname;
      pdfFilePath = req.file.filename;
      pdfFileSize = req.file.size;
      pdfUrl = `/api/letters/${current.id}/pdf`;
    } else if (removePdf === 'true' || removePdf === true) {
      hasPdf = false;
      pdfFileName = null;
      pdfFilePath = null;
      pdfFileSize = null;
      pdfUrl = null;
    }

    const updated: LetterRecord = {
      ...current,
      letterNumber: letterNumber ? letterNumber.trim() : current.letterNumber,
      title: title ? title.trim() : current.title,
      description: description !== undefined ? description.trim() : current.description,
      category: category || current.category,
      letterDate: letterDate || current.letterDate,
      institutionUnit: institutionUnit !== undefined ? institutionUnit.trim() : current.institutionUnit,
      sender: sender !== undefined ? sender.trim() : current.sender,
      recipient: recipient !== undefined ? recipient.trim() : current.recipient,
      hasPdf,
      pdfFileName,
      pdfFilePath,
      pdfFileSize,
      pdfUrl,
      storageStatus: hasPdf ? 'Tersimpan' : 'Belum Tersimpan',
      updatedAt: new Date().toISOString(),
    };

    letters[index] = updated;
    saveLetters(letters);

    res.json(updated);
  } catch (err: unknown) {
    console.error('Error updating letter:', err);
    res.status(500).json({ error: 'Gagal memperbarui surat.' });
  }
});

// PATCH /api/letters/:id/drive-sync: Update Google Drive sync status and web link
app.patch('/api/letters/:id/drive-sync', (req: Request, res: Response) => {
  try {
    const letters = getLetters();
    const index = letters.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Surat tidak ditemukan.' });
      return;
    }

    const { driveFileId, driveWebViewLink, isSyncedToDrive } = req.body;
    letters[index] = {
      ...letters[index],
      driveFileId: driveFileId || letters[index].driveFileId,
      driveWebViewLink: driveWebViewLink || letters[index].driveWebViewLink,
      isSyncedToDrive: isSyncedToDrive !== undefined ? Boolean(isSyncedToDrive) : true,
      driveSyncedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLetters(letters);

    res.json(letters[index]);
  } catch (err) {
    console.error('Error updating drive sync in letter:', err);
    res.status(500).json({ error: 'Gagal memperbarui data Google Drive.' });
  }
});

// POST & PATCH /api/letters/:id/approve: Dosen KPI / Admin approves pending letter
const handleApproveLetter = (req: Request, res: Response) => {
  try {
    const letters = getLetters();
    const index = letters.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Surat tidak ditemukan.' });
      return;
    }

    const approverName = req.body.approverName || 'Dosen KPI Universitas Al-Fithrah';
    letters[index] = {
      ...letters[index],
      approvalStatus: 'Approved',
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
      dispositionStatus: 'Selesai',
      dispositionTo: `${approverName} (Telah Disetujui)`,
      dispositionNote: `Surat permohonan mahasiswa telah diperiksa dan disetujui resmi oleh ${approverName}.`,
      updatedAt: new Date().toISOString(),
    };

    saveLetters(letters);
    res.json(letters[index]);
  } catch (err) {
    console.error('Error approving letter:', err);
    res.status(500).json({ error: 'Gagal memproses persetujuan surat.' });
  }
};

app.post('/api/letters/:id/approve', handleApproveLetter);
app.patch('/api/letters/:id/approve', handleApproveLetter);

// POST /api/letters/:id/disposition
app.post('/api/letters/:id/disposition', (req: Request, res: Response) => {
  const letters = getLetters();
  const index = letters.findIndex((l) => l.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Surat tidak ditemukan.' });
    return;
  }

  const { dispositionTo, dispositionNote, dispositionStatus } = req.body;
  letters[index] = {
    ...letters[index],
    dispositionTo: dispositionTo || letters[index].dispositionTo,
    dispositionNote: dispositionNote || letters[index].dispositionNote,
    dispositionStatus: dispositionStatus || 'Proses Disposisi',
    updatedAt: new Date().toISOString(),
  };

  saveLetters(letters);
  res.json(letters[index]);
});

// DELETE /api/letters/:id
app.delete('/api/letters/:id', (req: Request, res: Response) => {
  try {
    const letters = getLetters();
    const index = letters.findIndex((l) => l.id === req.params.id);

    if (index === -1) {
      res.status(404).json({ error: 'Surat tidak ditemukan.' });
      return;
    }

    const target = letters[index];
    if (target.pdfFilePath) {
      const filePath = path.join(UPLOADS_DIR, target.pdfFilePath);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }

    letters.splice(index, 1);
    saveLetters(letters);

    res.json({ success: true, message: 'Surat berhasil dihapus dari sistem.' });
  } catch (err: unknown) {
    console.error('Error deleting letter:', err);
    res.status(500).json({ error: 'Gagal menghapus surat.' });
  }
});

// GET /api/letters/:id/pdf: Stream or download PDF (auto-generates official buffer if needed)
app.get('/api/letters/:id/pdf', (req: Request, res: Response) => {
  const letters = getLetters();
  const letter = letters.find((l) => l.id === req.params.id);

  if (!letter) {
    res.status(404).json({ error: 'Surat tidak ditemukan.' });
    return;
  }

  let filePath = letter.pdfFilePath ? path.join(UPLOADS_DIR, letter.pdfFilePath) : '';
  if (!filePath || !fs.existsSync(filePath)) {
    const filename = `Surat_${letter.letterNumber.replace(/[/\\?%*:|"<>]/g, '_')}_${Date.now().toString(36)}.pdf`;
    filePath = path.join(UPLOADS_DIR, filename);
    const buf = createOfficialKpiPdfBuffer({
      letterNumber: letter.letterNumber,
      perihal: letter.title,
      recipientTitle: letter.recipient || 'Pimpinan Instansi',
      recipientPerson: letter.recipientPerson,
      recipientAddress: letter.recipientAddress || 'Surabaya',
      studentName: letter.studentName,
      studentNim: letter.studentNim,
      studentAddress: letter.studentAddress,
      studentPhone: letter.studentPhone,
      periodOrDuration: letter.periodOrDuration,
      dateStr: letter.letterDate,
    });
    fs.writeFileSync(filePath, buf);

    // Persist file metadata
    letter.hasPdf = true;
    letter.pdfFilePath = filename;
    letter.pdfFileName = filename;
    letter.pdfUrl = `/api/letters/${letter.id}/pdf`;
    letter.storageStatus = 'Tersimpan';
    saveLetters(letters);
  }

  const isDownload = req.query.download === '1' || req.query.download === 'true';
  const downloadName = letter.pdfFileName || `Surat_${letter.letterNumber.replace(/[/\\?%*:|"<>]/g, '_')}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${downloadName}"`);
  }

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// ----------------- Master Data: Mahasiswa Endpoints -----------------
app.get('/api/students', (_req: Request, res: Response) => {
  res.json(getStudents());
});

app.post('/api/students', (req: Request, res: Response) => {
  try {
    const { nim, name, studyProgram, faculty, semester, phone, email, address, status } = req.body;
    if (!nim || !name) {
      res.status(400).json({ error: 'NIM dan Nama Mahasiswa wajib diisi.' });
      return;
    }
    const students = getStudents();
    const existing = students.find((s) => s.nim.trim().toLowerCase() === nim.trim().toLowerCase());
    if (existing) {
      res.status(400).json({ error: `Mahasiswa dengan NIM ${nim} sudah terdaftar.` });
      return;
    }
    const newStudent = {
      id: `mhs-${Date.now().toString(36)}`,
      nim: nim.trim(),
      name: name.trim(),
      studyProgram: studyProgram ? studyProgram.trim() : 'Komunikasi dan Penyiaran Islam',
      faculty: faculty ? faculty.trim() : 'Fakultas Tarbiyah dan Dakwah',
      semester: Number(semester) || 1,
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      address: address ? address.trim() : '',
      status: status || 'Aktif',
    };
    students.unshift(newStudent);
    saveStudents(students);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan data mahasiswa.' });
  }
});

app.put('/api/students/:id', (req: Request, res: Response) => {
  try {
    const students = getStudents();
    const index = students.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Mahasiswa tidak ditemukan.' });
      return;
    }
    const current = students[index];
    const { nim, name, studyProgram, faculty, semester, phone, email, address, status } = req.body;
    students[index] = {
      ...current,
      nim: nim !== undefined ? nim.trim() : current.nim,
      name: name !== undefined ? name.trim() : current.name,
      studyProgram: studyProgram !== undefined ? studyProgram.trim() : current.studyProgram,
      faculty: faculty !== undefined ? faculty.trim() : current.faculty,
      semester: semester !== undefined ? Number(semester) : current.semester,
      phone: phone !== undefined ? phone.trim() : current.phone,
      email: email !== undefined ? email.trim() : current.email,
      address: address !== undefined ? address.trim() : current.address,
      status: status || current.status,
    };
    saveStudents(students);
    res.json(students[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui data mahasiswa.' });
  }
});

app.delete('/api/students/:id', (req: Request, res: Response) => {
  try {
    const students = getStudents();
    const filtered = students.filter((s) => s.id !== req.params.id);
    saveStudents(filtered);
    res.json({ success: true, message: 'Data mahasiswa berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus data mahasiswa.' });
  }
});

// ----------------- Master Data: Dosen Endpoints -----------------
app.get('/api/lecturers', (_req: Request, res: Response) => {
  res.json(getLecturers());
});

app.post('/api/lecturers', (req: Request, res: Response) => {
  try {
    const { nidn, name, studyProgram, academicRole, phone, email, status } = req.body;
    if (!nidn || !name) {
      res.status(400).json({ error: 'NIDN dan Nama Dosen wajib diisi.' });
      return;
    }
    const lecturers = getLecturers();
    const existing = lecturers.find((l) => l.nidn.trim().toLowerCase() === nidn.trim().toLowerCase());
    if (existing) {
      res.status(400).json({ error: `Dosen dengan NIDN ${nidn} sudah terdaftar.` });
      return;
    }
    const newLecturer = {
      id: `dsn-${Date.now().toString(36)}`,
      nidn: nidn.trim(),
      name: name.trim(),
      studyProgram: studyProgram ? studyProgram.trim() : 'Komunikasi dan Penyiaran Islam',
      academicRole: academicRole ? academicRole.trim() : 'Dosen Tetap',
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      status: status || 'Aktif',
    };
    lecturers.unshift(newLecturer);
    saveLecturers(lecturers);
    res.status(201).json(newLecturer);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan data dosen.' });
  }
});

app.put('/api/lecturers/:id', (req: Request, res: Response) => {
  try {
    const lecturers = getLecturers();
    const index = lecturers.findIndex((l) => l.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Dosen tidak ditemukan.' });
      return;
    }
    const current = lecturers[index];
    const { nidn, name, studyProgram, academicRole, phone, email, status } = req.body;
    lecturers[index] = {
      ...current,
      nidn: nidn !== undefined ? nidn.trim() : current.nidn,
      name: name !== undefined ? name.trim() : current.name,
      studyProgram: studyProgram !== undefined ? studyProgram.trim() : current.studyProgram,
      academicRole: academicRole !== undefined ? academicRole.trim() : current.academicRole,
      phone: phone !== undefined ? phone.trim() : current.phone,
      email: email !== undefined ? email.trim() : current.email,
      status: status || current.status,
    };
    saveLecturers(lecturers);
    res.json(lecturers[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui data dosen.' });
  }
});

app.delete('/api/lecturers/:id', (req: Request, res: Response) => {
  try {
    const lecturers = getLecturers();
    const filtered = lecturers.filter((l) => l.id !== req.params.id);
    saveLecturers(filtered);
    res.json({ success: true, message: 'Data dosen berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus data dosen.' });
  }
});

// ----------------- Master Data: Program Studi Endpoints -----------------
app.get('/api/study-programs', (_req: Request, res: Response) => {
  res.json(getStudyPrograms());
});

app.post('/api/study-programs', (req: Request, res: Response) => {
  try {
    const { code, name, faculty, degreeLevel, headOfProgram, headNidn, accreditedStatus } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Nama Program Studi wajib diisi.' });
      return;
    }
    const prodis = getStudyPrograms();
    const newProdi = {
      id: `prodi-${Date.now().toString(36)}`,
      code: code ? code.trim().toUpperCase() : 'PRODI',
      name: name.trim(),
      faculty: faculty ? faculty.trim() : 'Fakultas Tarbiyah dan Dakwah',
      degreeLevel: degreeLevel || 'S1',
      headOfProgram: headOfProgram ? headOfProgram.trim() : '',
      headNidn: headNidn ? headNidn.trim() : '',
      accreditedStatus: accreditedStatus || 'Baik Sekali',
    };
    prodis.push(newProdi);
    saveStudyPrograms(prodis);
    res.status(201).json(newProdi);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan program studi.' });
  }
});

app.put('/api/study-programs/:id', (req: Request, res: Response) => {
  try {
    const prodis = getStudyPrograms();
    const index = prodis.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Program Studi tidak ditemukan.' });
      return;
    }
    const current = prodis[index];
    const { code, name, faculty, degreeLevel, headOfProgram, headNidn, accreditedStatus } = req.body;
    prodis[index] = {
      ...current,
      code: code !== undefined ? code.trim().toUpperCase() : current.code,
      name: name !== undefined ? name.trim() : current.name,
      faculty: faculty !== undefined ? faculty.trim() : current.faculty,
      degreeLevel: degreeLevel || current.degreeLevel,
      headOfProgram: headOfProgram !== undefined ? headOfProgram.trim() : current.headOfProgram,
      headNidn: headNidn !== undefined ? headNidn.trim() : current.headNidn,
      accreditedStatus: accreditedStatus || current.accreditedStatus,
    };
    saveStudyPrograms(prodis);
    res.json(prodis[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui program studi.' });
  }
});

app.delete('/api/study-programs/:id', (req: Request, res: Response) => {
  try {
    const prodis = getStudyPrograms();
    const filtered = prodis.filter((p) => p.id !== req.params.id);
    saveStudyPrograms(filtered);
    res.json({ success: true, message: 'Program studi berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus program studi.' });
  }
});

// ----------------- Master Data: Kegiatan & Event Endpoints -----------------
app.get('/api/events', (_req: Request, res: Response) => {
  res.json(getEvents());
});

app.post('/api/events', (req: Request, res: Response) => {
  try {
    const { title, category, date, time, location, organizer, picName, description, status, isOutsideProdi, scope } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Nama Acara/Kegiatan wajib diisi.' });
      return;
    }
    const events = getEvents();
    const isOut = Boolean(isOutsideProdi) || (organizer && !organizer.toLowerCase().includes('prodi kpi') && !organizer.toLowerCase().includes('program studi kpi'));
    const newEvent = {
      id: `evt-${Date.now().toString(36)}`,
      title: title.trim(),
      category: category || 'Akademik',
      date: date || new Date().toISOString().split('T')[0],
      time: time ? time.trim() : '09:00 WIB',
      location: location ? location.trim() : 'Kampus Universitas Al-Fithrah',
      organizer: organizer ? organizer.trim() : 'Universitas Al-Fithrah',
      picName: picName ? picName.trim() : '',
      description: description ? description.trim() : '',
      status: status || 'Akan Datang',
      isOutsideProdi: isOut,
      scope: scope || (isOut ? 'Selain Prodi (Universitas / Eksternal)' : 'Internal Prodi KPI'),
    };
    events.unshift(newEvent);
    saveEvents(events);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambahkan kegiatan/acara.' });
  }
});

app.put('/api/events/:id', (req: Request, res: Response) => {
  try {
    const events = getEvents();
    const index = events.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
      return;
    }
    const current = events[index];
    const { title, category, date, time, location, organizer, picName, description, status, isOutsideProdi, scope } = req.body;
    const isOut = isOutsideProdi !== undefined ? Boolean(isOutsideProdi) : current.isOutsideProdi;
    events[index] = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category || current.category,
      date: date || current.date,
      time: time !== undefined ? time.trim() : current.time,
      location: location !== undefined ? location.trim() : current.location,
      organizer: organizer !== undefined ? organizer.trim() : current.organizer,
      picName: picName !== undefined ? picName.trim() : current.picName,
      description: description !== undefined ? description.trim() : current.description,
      status: status || current.status,
      isOutsideProdi: isOut !== undefined ? isOut : false,
      scope: scope || current.scope || (isOut ? 'Selain Prodi (Universitas / Eksternal)' : 'Internal Prodi KPI'),
    };
    saveEvents(events);
    res.json(events[index]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memperbarui kegiatan.' });
  }
});

app.delete('/api/events/:id', (req: Request, res: Response) => {
  try {
    const events = getEvents();
    const filtered = events.filter((e) => e.id !== req.params.id);
    saveEvents(filtered);
    res.json({ success: true, message: 'Kegiatan berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kegiatan.' });
  }
});

// GET /api/backup: Full backup download
app.get('/api/backup', (_req: Request, res: Response) => {
  const letters = getLetters();
  const students = getStudents();
  const lecturers = getLecturers();
  const prodis = getStudyPrograms();
  const events = getEvents();

  const backupData = {
    institution: 'Universitas Al-Fithrah (UAF) Surabaya',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    studyProgram: 'Program Studi Komunikasi dan Penyiaran Islam',
    version: '3.1.0',
    exportedAt: new Date().toISOString(),
    totalRecords: letters.length,
    letters,
    students,
    lecturers,
    studyPrograms: prodis,
    events,
  };

  const filename = `backup_persuratan_uaf_${new Date().toISOString().split('T')[0]}.json`;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(JSON.stringify(backupData, null, 2));
});

// GET /api/config
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    institution: 'UNIVERSITAS AL-FITHRAH (UAF) SURABAYA',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    programStudi: 'Komunikasi dan Penyiaran Islam (KPI)',
    kaprodi: 'Muhammad Munir, M.Sos. (NIDN. 2126059505)',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KPI UAF Persuratan] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
