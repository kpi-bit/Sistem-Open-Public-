export type LetterCategory = 
  | 'Surat Magang / PKM'
  | 'Surat Izin Penelitian'
  | 'Surat Keterangan Aktif'
  | 'Surat Dispensasi'
  | 'Surat Tugas Dosen'
  | 'Surat Keputusan'
  | 'Surat Masuk'
  | 'Surat Keluar'
  | 'Nota Dinas'
  | 'Lainnya';

export type StorageStatus = 'Tersimpan' | 'Belum Tersimpan';

export type DispositionStatus = 'Belum Didisposisi' | 'Proses Disposisi' | 'Selesai';

export type UserRole = 'mahasiswa' | 'dosen' | 'admin';

export interface UserSession {
  isAuthenticated: boolean;
  role: UserRole;
  identifier: string; // NIM, NIDN, or Email
  name: string;
  nim?: string;
  nidn?: string;
  email?: string;
  studyProgram: string;
  faculty: string;
  phone?: string;
  address?: string;
  semester?: number;
  token?: string | null;
}

export interface Letter {
  id: string;
  orderNumber: number;
  letterNumber: string; // e.g. 044/03/KPI-UAF/B/X/2026
  title: string;
  description: string;
  category: LetterCategory;
  letterDate: string; // YYYY-MM-DD
  institutionUnit: string; // Program Studi Komunikasi dan Penyiaran Islam
  sender?: string;
  recipient?: string;
  recipientPerson?: string;
  recipientAddress?: string;
  creator?: string;
  creatorRole?: UserRole;
  creatorIdentifier?: string;
  studentName?: string;
  studentNim?: string;
  studentAddress?: string;
  studentPhone?: string;
  lecturerName?: string;
  lecturerNidn?: string;
  periodOrDuration?: string;
  hasPdf: boolean;
  pdfFileName?: string | null;
  pdfFilePath?: string | null;
  pdfFileSize?: number | null;
  pdfUrl?: string | null;
  storageStatus: StorageStatus;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedAt?: string;
  dispositionStatus?: DispositionStatus;
  dispositionTo?: string;
  dispositionNote?: string;
  driveFileId?: string;
  driveWebViewLink?: string;
  isSyncedToDrive?: boolean;
  driveSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  nim: string;
  name: string;
  studyProgram: string;
  faculty: string;
  semester: number;
  phone: string;
  email: string;
  address: string;
  status: 'Aktif' | 'Cuti' | 'Lulus';
}

export interface Lecturer {
  id: string;
  nidn: string;
  name: string;
  studyProgram: string;
  academicRole: string;
  phone: string;
  email: string;
  status: 'Aktif' | 'Tugas Belajar' | 'Pensiun';
}

export interface StudyProgram {
  id: string;
  code: string;
  name: string;
  faculty: string;
  degreeLevel: 'S1' | 'S2' | 'S3' | 'D3';
  headOfProgram: string;
  headNidn: string;
  accreditedStatus: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Akademik' | 'Seminar & Workshop' | 'Dakwah & Religi' | 'Kemahasiswaan' | 'Ujian & Sidang' | 'Lainnya';
  date: string;
  time?: string;
  location: string;
  organizer: string;
  picName: string;
  description: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai' | 'Dibatalkan';
  isOutsideProdi?: boolean;
  scope?: string;
}

export interface LetterTemplate {
  id: string;
  code: string;
  title: string;
  targetRole: 'mahasiswa' | 'dosen' | 'all';
  category: LetterCategory;
  description: string;
  defaultPerihal: string;
  requiredFields: string[];
}

export interface DashboardStats {
  totalSuratMasuk: number;
  totalSuratKeluar: number;
  totalKlasifikasi: number;
  totalDisposisi: number;
  totalAkunUser: number;
  totalPdfTersimpan: number;
  totalPenerima: number;
  totalPembuat: number;
  totalBidang: number;
  totalLetters: number;
  totalWithoutPdf: number;
  totalMahasiswa?: number;
  totalDosen?: number;
  totalProdi?: number;
  totalEvents?: number;
}
