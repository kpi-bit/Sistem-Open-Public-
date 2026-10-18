import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Building2,
  CalendarDays,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Filter,
  Users,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  Student,
  Lecturer,
  StudyProgram,
  CampusEvent,
  UserSession
} from '../types/letter';
import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchLecturers,
  createLecturer,
  updateLecturer,
  deleteLecturer,
  fetchStudyPrograms,
  createStudyProgram,
  updateStudyProgram,
  deleteStudyProgram,
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../services/api';

interface MasterDataManagementSectionProps {
  userSession: UserSession;
  activeTab?: 'students' | 'lecturers' | 'prodi' | 'events';
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const MasterDataManagementSection: React.FC<MasterDataManagementSectionProps> = ({
  userSession,
  activeTab = 'students',
  onShowToast,
}) => {
  const [currentSubTab, setCurrentSubTab] = useState<'students' | 'lecturers' | 'prodi' | 'events'>(activeTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'student' | 'lecturer' | 'prodi' | 'event'>('student');
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Delete confirm state
  const [deletingItem, setDeletingItem] = useState<{ type: string; id: string; name: string } | null>(null);

  // Form states for Student
  const [studentNim, setStudentNim] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentProdi, setStudentProdi] = useState('Komunikasi dan Penyiaran Islam');
  const [studentFaculty, setStudentFaculty] = useState('Fakultas Tarbiyah dan Dakwah');
  const [studentSemester, setStudentSemester] = useState(1);
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [studentStatus, setStudentStatus] = useState<'Aktif' | 'Cuti' | 'Lulus'>('Aktif');

  // Form states for Lecturer
  const [lecturerNidn, setLecturerNidn] = useState('');
  const [lecturerName, setLecturerName] = useState('');
  const [lecturerProdi, setLecturerProdi] = useState('Komunikasi dan Penyiaran Islam');
  const [lecturerRole, setLecturerRole] = useState('Dosen Tetap');
  const [lecturerPhone, setLecturerPhone] = useState('');
  const [lecturerEmail, setLecturerEmail] = useState('');
  const [lecturerStatus, setLecturerStatus] = useState<'Aktif' | 'Tugas Belajar' | 'Pensiun'>('Aktif');

  // Form states for Study Program
  const [prodiCode, setProdiCode] = useState('');
  const [prodiName, setProdiName] = useState('');
  const [prodiFaculty, setProdiFaculty] = useState('Fakultas Tarbiyah dan Dakwah');
  const [prodiDegree, setProdiDegree] = useState<'S1' | 'S2' | 'S3' | 'D3'>('S1');
  const [prodiHead, setProdiHead] = useState('');
  const [prodiHeadNidn, setProdiHeadNidn] = useState('');
  const [prodiAccredited, setProdiAccredited] = useState('Unggul');

  // Form states for Campus Event
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<'Akademik' | 'Seminar & Workshop' | 'Dakwah & Religi' | 'Kemahasiswaan' | 'Ujian & Sidang' | 'Lainnya'>('Akademik');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('09:00 WIB');
  const [eventLocation, setEventLocation] = useState('Kampus Universitas Al-Fithrah');
  const [eventOrganizer, setEventOrganizer] = useState('Prodi Komunikasi dan Penyiaran Islam');
  const [eventPic, setEventPic] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStatus, setEventStatus] = useState<'Akan Datang' | 'Sedang Berlangsung' | 'Selesai' | 'Dibatalkan'>('Akan Datang');
  const [eventIsOutsideProdi, setEventIsOutsideProdi] = useState(false);
  const [eventScope, setEventScope] = useState('Internal Prodi KPI');
  const [eventFilterScope, setEventFilterScope] = useState<'all' | 'prodi' | 'outside'>('all');

  useEffect(() => {
    setCurrentSubTab(activeTab);
  }, [activeTab]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [sRes, lRes, pRes, eRes] = await Promise.all([
        fetchStudents(),
        fetchLecturers(),
        fetchStudyPrograms(),
        fetchEvents(),
      ]);
      setStudents(sRes);
      setLecturers(lRes);
      setStudyPrograms(pRes);
      setEvents(eRes);
    } catch (err: any) {
      console.error(err);
      onShowToast('error', 'Gagal memuat master data', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openAddModal = (type: 'student' | 'lecturer' | 'prodi' | 'event') => {
    setModalType(type);
    setEditingItem(null);

    if (type === 'student') {
      setStudentNim('');
      setStudentName('');
      setStudentProdi('Komunikasi dan Penyiaran Islam');
      setStudentFaculty('Fakultas Tarbiyah dan Dakwah');
      setStudentSemester(1);
      setStudentPhone('');
      setStudentEmail('');
      setStudentAddress('');
      setStudentStatus('Aktif');
    } else if (type === 'lecturer') {
      setLecturerNidn('');
      setLecturerName('');
      setLecturerProdi('Komunikasi dan Penyiaran Islam');
      setLecturerRole('Dosen Tetap');
      setLecturerPhone('');
      setLecturerEmail('');
      setLecturerStatus('Aktif');
    } else if (type === 'prodi') {
      setProdiCode('');
      setProdiName('');
      setProdiFaculty('Fakultas Tarbiyah dan Dakwah');
      setProdiDegree('S1');
      setProdiHead('');
      setProdiHeadNidn('');
      setProdiAccredited('Unggul');
    } else if (type === 'event') {
      setEventTitle('');
      setEventCategory('Akademik');
      setEventDate(new Date().toISOString().split('T')[0]);
      setEventTime('09:00 WIB');
      setEventLocation('Auditorium Universitas Al-Fithrah');
      setEventOrganizer('Prodi Komunikasi dan Penyiaran Islam');
      setEventPic('');
      setEventDesc('');
      setEventStatus('Akan Datang');
      setEventIsOutsideProdi(false);
      setEventScope('Internal Prodi KPI');
    }

    setIsModalOpen(true);
  };

  const openEditModal = (type: 'student' | 'lecturer' | 'prodi' | 'event', item: any) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'student') {
      setStudentNim(item.nim);
      setStudentName(item.name);
      setStudentProdi(item.studyProgram);
      setStudentFaculty(item.faculty);
      setStudentSemester(item.semester || 1);
      setStudentPhone(item.phone || '');
      setStudentEmail(item.email || '');
      setStudentAddress(item.address || '');
      setStudentStatus(item.status || 'Aktif');
    } else if (type === 'lecturer') {
      setLecturerNidn(item.nidn);
      setLecturerName(item.name);
      setLecturerProdi(item.studyProgram);
      setLecturerRole(item.academicRole || 'Dosen Tetap');
      setLecturerPhone(item.phone || '');
      setLecturerEmail(item.email || '');
      setLecturerStatus(item.status || 'Aktif');
    } else if (type === 'prodi') {
      setProdiCode(item.code);
      setProdiName(item.name);
      setProdiFaculty(item.faculty);
      setProdiDegree(item.degreeLevel || 'S1');
      setProdiHead(item.headOfProgram || '');
      setProdiHeadNidn(item.headNidn || '');
      setProdiAccredited(item.accreditedStatus || 'Baik Sekali');
    } else if (type === 'event') {
      setEventTitle(item.title);
      setEventCategory(item.category || 'Akademik');
      setEventDate(item.date);
      setEventTime(item.time || '09:00 WIB');
      setEventLocation(item.location || 'Universitas Al-Fithrah');
      setEventOrganizer(item.organizer || 'Prodi KPI');
      setEventPic(item.picName || '');
      setEventDesc(item.description || '');
      setEventStatus(item.status || 'Akan Datang');
      setEventIsOutsideProdi(Boolean(item.isOutsideProdi));
      setEventScope(item.scope || (item.isOutsideProdi ? 'Selain Prodi (Universitas / Eksternal)' : 'Internal Prodi KPI'));
    }

    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === 'student') {
        if (!studentNim || !studentName) {
          onShowToast('error', 'Validasi Gagal', 'NIM dan Nama Mahasiswa wajib diisi.');
          return;
        }
        if (editingItem) {
          await updateStudent(editingItem.id, {
            nim: studentNim,
            name: studentName,
            studyProgram: studentProdi,
            faculty: studentFaculty,
            semester: studentSemester,
            phone: studentPhone,
            email: studentEmail,
            address: studentAddress,
            status: studentStatus,
          });
          onShowToast('success', 'Berhasil Diperbarui', `Data mahasiswa ${studentName} disimpan.`);
        } else {
          await createStudent({
            nim: studentNim,
            name: studentName,
            studyProgram: studentProdi,
            faculty: studentFaculty,
            semester: studentSemester,
            phone: studentPhone,
            email: studentEmail,
            address: studentAddress,
            status: studentStatus,
          });
          onShowToast('success', 'Mahasiswa Ditambahkan', `Mahasiswa ${studentName} (NIM: ${studentNim}) tersimpan.`);
        }
      } else if (modalType === 'lecturer') {
        if (!lecturerNidn || !lecturerName) {
          onShowToast('error', 'Validasi Gagal', 'NIDN dan Nama Dosen wajib diisi.');
          return;
        }
        if (editingItem) {
          await updateLecturer(editingItem.id, {
            nidn: lecturerNidn,
            name: lecturerName,
            studyProgram: lecturerProdi,
            academicRole: lecturerRole,
            phone: lecturerPhone,
            email: lecturerEmail,
            status: lecturerStatus,
          });
          onShowToast('success', 'Berhasil Diperbarui', `Data dosen ${lecturerName} disimpan.`);
        } else {
          await createLecturer({
            nidn: lecturerNidn,
            name: lecturerName,
            studyProgram: lecturerProdi,
            academicRole: lecturerRole,
            phone: lecturerPhone,
            email: lecturerEmail,
            status: lecturerStatus,
          });
          onShowToast('success', 'Dosen Ditambahkan', `Dosen ${lecturerName} (NIDN: ${lecturerNidn}) tersimpan.`);
        }
      } else if (modalType === 'prodi') {
        if (!prodiName) {
          onShowToast('error', 'Validasi Gagal', 'Nama Program Studi wajib diisi.');
          return;
        }
        if (editingItem) {
          await updateStudyProgram(editingItem.id, {
            code: prodiCode,
            name: prodiName,
            faculty: prodiFaculty,
            degreeLevel: prodiDegree,
            headOfProgram: prodiHead,
            headNidn: prodiHeadNidn,
            accreditedStatus: prodiAccredited,
          });
          onShowToast('success', 'Berhasil Diperbarui', `Program Studi ${prodiName} disimpan.`);
        } else {
          await createStudyProgram({
            code: prodiCode,
            name: prodiName,
            faculty: prodiFaculty,
            degreeLevel: prodiDegree,
            headOfProgram: prodiHead,
            headNidn: prodiHeadNidn,
            accreditedStatus: prodiAccredited,
          });
          onShowToast('success', 'Program Studi Ditambahkan', `Prodi ${prodiName} berhasil ditambahkan.`);
        }
      } else if (modalType === 'event') {
        if (!eventTitle) {
          onShowToast('error', 'Validasi Gagal', 'Nama Kegiatan/Event wajib diisi.');
          return;
        }
        if (editingItem) {
          await updateEvent(editingItem.id, {
            title: eventTitle,
            category: eventCategory,
            date: eventDate,
            time: eventTime,
            location: eventLocation,
            organizer: eventOrganizer,
            picName: eventPic,
            description: eventDesc,
            status: eventStatus,
            isOutsideProdi: eventIsOutsideProdi,
            scope: eventScope,
          });
          onShowToast('success', 'Berhasil Diperbarui', `Kegiatan ${eventTitle} diperbarui.`);
        } else {
          await createEvent({
            title: eventTitle,
            category: eventCategory,
            date: eventDate,
            time: eventTime,
            location: eventLocation,
            organizer: eventOrganizer,
            picName: eventPic,
            description: eventDesc,
            status: eventStatus,
            isOutsideProdi: eventIsOutsideProdi,
            scope: eventScope,
          });
          onShowToast('success', 'Kegiatan Ditambahkan', `Acara ${eventTitle} tersimpan.`);
        }
      }

      setIsModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      onShowToast('error', 'Gagal Menyimpan', err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      if (deletingItem.type === 'student') {
        await deleteStudent(deletingItem.id);
        onShowToast('success', 'Data Dihapus', `Mahasiswa ${deletingItem.name} telah dihapus.`);
      } else if (deletingItem.type === 'lecturer') {
        await deleteLecturer(deletingItem.id);
        onShowToast('success', 'Data Dihapus', `Dosen ${deletingItem.name} telah dihapus.`);
      } else if (deletingItem.type === 'prodi') {
        await deleteStudyProgram(deletingItem.id);
        onShowToast('success', 'Data Dihapus', `Program Studi ${deletingItem.name} telah dihapus.`);
      } else if (deletingItem.type === 'event') {
        await deleteEvent(deletingItem.id);
        onShowToast('success', 'Data Dihapus', `Kegiatan ${deletingItem.name} telah dihapus.`);
      }
      setDeletingItem(null);
      await loadAllData();
    } catch (err: any) {
      onShowToast('error', 'Gagal Menghapus', err.message);
    }
  };

  // Filtered lists
  const q = searchQuery.toLowerCase();
  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q) || s.studyProgram.toLowerCase().includes(q)
  );
  const filteredLecturers = lecturers.filter(
    (l) => l.name.toLowerCase().includes(q) || l.nidn.toLowerCase().includes(q) || l.studyProgram.toLowerCase().includes(q)
  );
  const filteredProdis = studyPrograms.filter(
    (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.faculty.toLowerCase().includes(q)
  );
  const filteredEvents = events.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q) ||
      (e.scope && e.scope.toLowerCase().includes(q));
    if (!matchesQuery) return false;
    if (eventFilterScope === 'prodi') {
      return !e.isOutsideProdi;
    }
    if (eventFilterScope === 'outside') {
      return Boolean(e.isOutsideProdi);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner for Super Admin Master Data */}
      <div className="bg-white rounded-xl p-5 border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Hak Akses Super Admin
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-emerald-800">
              Universitas Al-Fithrah Surabaya
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Manajemen Master Data Sivitas Akademika & Kampus</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
            Kelola data terpusat mahasiswa, dosen pengampu, daftar program studi aktif, serta agenda kegiatan acara Universitas Al-Fithrah.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#fbfaf6] p-1.5 rounded-lg border border-amber-200/80">
          <button
            onClick={() => setCurrentSubTab('students')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentSubTab === 'students'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mahasiswa ({students.length})</span>
          </button>

          <button
            onClick={() => setCurrentSubTab('lecturers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentSubTab === 'lecturers'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dosen ({lecturers.length})</span>
          </button>

          <button
            onClick={() => setCurrentSubTab('prodi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentSubTab === 'prodi'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Program Studi ({studyPrograms.length})</span>
          </button>

          <button
            onClick={() => setCurrentSubTab('events')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentSubTab === 'events'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Kegiatan / Event ({events.length})</span>
          </button>
        </div>
      </div>

      {/* Action Bar: Search & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari di ${
              currentSubTab === 'students'
                ? 'data mahasiswa (nama, NIM, prodi)...'
                : currentSubTab === 'lecturers'
                ? 'data dosen (nama, NIDN)...'
                : currentSubTab === 'prodi'
                ? 'program studi...'
                : 'kegiatan event...'
            }`}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-700 font-medium"
          />
        </div>

        <div>
          {currentSubTab === 'students' && (
            <button
              onClick={() => openAddModal('student')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span>Tambah Mahasiswa</span>
            </button>
          )}

          {currentSubTab === 'lecturers' && (
            <button
              onClick={() => openAddModal('lecturer')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span>Tambah Dosen</span>
            </button>
          )}

          {currentSubTab === 'prodi' && (
            <button
              onClick={() => openAddModal('prodi')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span>Tambah Program Studi</span>
            </button>
          )}

          {currentSubTab === 'events' && (
            <button
              onClick={() => openAddModal('event')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span>Tambah Kegiatan / Acara</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* SUBTAB 1: DATA MAHASISWA */}
        {currentSubTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbfaf6] text-slate-700 font-bold uppercase text-[11px] border-b border-amber-200/80">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">NIM</th>
                  <th className="py-3.5 px-4">Nama Mahasiswa</th>
                  <th className="py-3.5 px-4">Program Studi & Semester</th>
                  <th className="py-3.5 px-4">Kontak & Alamat</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada data mahasiswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((mhs, idx) => (
                    <tr key={mhs.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                        {mhs.nim}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {mhs.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {mhs.studyProgram}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Semester {mhs.semester} · {mhs.faculty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <span className="font-mono text-slate-700 block">
                          {mhs.phone || '-'}
                        </span>
                        <span className="text-slate-500 truncate block max-w-xs" title={mhs.address}>
                          {mhs.address || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            mhs.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : mhs.status === 'Cuti'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {mhs.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal('student', mhs)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-amber-800 cursor-pointer"
                            title="Edit Data Mahasiswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'student', id: mhs.id, name: mhs.name })}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Hapus Mahasiswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 2: DATA DOSEN */}
        {currentSubTab === 'lecturers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbfaf6] text-slate-700 font-bold uppercase text-[11px] border-b border-amber-200/80">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">NIDN</th>
                  <th className="py-3.5 px-4">Nama Dosen & Gelar</th>
                  <th className="py-3.5 px-4">Jabatan Akademik</th>
                  <th className="py-3.5 px-4">Program Studi</th>
                  <th className="py-3.5 px-4">Kontak / Email</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredLecturers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada data dosen yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredLecturers.map((dsn, idx) => (
                    <tr key={dsn.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                        {dsn.nidn}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {dsn.name}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {dsn.academicRole}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {dsn.studyProgram}
                      </td>
                      <td className="py-3 px-4 text-[11px]">
                        <span className="font-mono text-slate-700 block">{dsn.phone || '-'}</span>
                        <span className="text-slate-500 block truncate">{dsn.email || '-'}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dsn.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {dsn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal('lecturer', dsn)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-amber-800 cursor-pointer"
                            title="Edit Data Dosen"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'lecturer', id: dsn.id, name: dsn.name })}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Hapus Dosen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 3: DATA PROGRAM STUDI */}
        {currentSubTab === 'prodi' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fbfaf6] text-slate-700 font-bold uppercase text-[11px] border-b border-amber-200/80">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Kode</th>
                  <th className="py-3.5 px-4">Nama Program Studi</th>
                  <th className="py-3.5 px-4">Fakultas</th>
                  <th className="py-3.5 px-4 text-center">Jenjang</th>
                  <th className="py-3.5 px-4">Ketua Program Studi (Kaprodi)</th>
                  <th className="py-3.5 px-4 text-center">Akreditasi</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredProdis.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                      Tidak ada program studi yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredProdis.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-800">
                        {p.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {p.faculty}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-900">
                        {p.degreeLevel}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{p.headOfProgram || '-'}</span>
                        {p.headNidn && <span className="font-mono text-[11px] text-slate-500 block">NIDN: {p.headNidn}</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                          {p.accreditedStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal('prodi', p)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-amber-800 cursor-pointer"
                            title="Edit Program Studi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'prodi', id: p.id, name: p.name })}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Hapus Program Studi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 4: DATA KEGIATAN EVENT / ACARA */}
        {currentSubTab === 'events' && (
          <div>
            <div className="p-3 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-700 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-amber-600" />
                  <span>Filter Lingkup:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setEventFilterScope('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    eventFilterScope === 'all'
                      ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Semua ({events.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilterScope('prodi')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    eventFilterScope === 'prodi'
                      ? 'bg-emerald-800 text-white shadow-2xs font-bold'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Internal Prodi KPI ({events.filter((e) => !e.isOutsideProdi).length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilterScope('outside')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    eventFilterScope === 'outside'
                      ? 'bg-amber-600 text-white shadow-2xs font-bold'
                      : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
                  }`}
                >
                  Selain Prodi / Luar Kampus ({events.filter((e) => e.isOutsideProdi).length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fbfaf6] text-slate-700 font-bold uppercase text-[11px] border-b border-amber-200/80">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">Nama Kegiatan / Acara</th>
                    <th className="py-3.5 px-4">Kategori & Tanggal</th>
                    <th className="py-3.5 px-4">Lokasi Pelaksanaan</th>
                    <th className="py-3.5 px-4">Penyelenggara & Lingkup</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                        Tidak ada kegiatan/acara yang cocok dengan filter atau pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((evt, idx) => (
                      <tr key={evt.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-bold text-slate-900 block">{evt.title}</span>
                          {evt.description && (
                            <span className="text-[11px] text-slate-500 block truncate" title={evt.description}>
                              {evt.description}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold mb-0.5">
                            {evt.category}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-emerald-900 font-mono font-semibold">
                            <CalendarDays className="w-3 h-3 text-amber-600" />
                            <span>{evt.date}</span>
                            {evt.time && <span>· {evt.time}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{evt.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-800">{evt.organizer}</span>
                            {evt.isOutsideProdi ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                Selain Prodi
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Prodi KPI
                              </span>
                            )}
                          </div>
                          {evt.scope && (
                            <span className="text-[10px] text-slate-500 block font-medium mt-0.5">
                              {evt.scope}
                            </span>
                          )}
                          {evt.picName && <span className="text-[11px] text-slate-500 block">PIC: {evt.picName}</span>}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              evt.status === 'Akan Datang'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : evt.status === 'Sedang Berlangsung'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {evt.status}
                          </span>
                        </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditModal('event', evt)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-amber-800 cursor-pointer"
                            title="Edit Kegiatan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ type: 'event', id: evt.id, name: evt.title })}
                            className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Hapus Kegiatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

      {/* MODAL FORM: CREATE / EDIT MASTER DATA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-amber-300 w-full max-w-lg overflow-hidden my-auto">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white flex items-center justify-between border-b-2 border-amber-400">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                {modalType === 'student' && <GraduationCap className="w-4 h-4 text-amber-300" />}
                {modalType === 'lecturer' && <BookOpen className="w-4 h-4 text-amber-300" />}
                {modalType === 'prodi' && <Building2 className="w-4 h-4 text-amber-300" />}
                {modalType === 'event' && <CalendarDays className="w-4 h-4 text-amber-300" />}
                <span>
                  {editingItem ? 'Edit' : 'Tambah'}{' '}
                  {modalType === 'student'
                    ? 'Data Mahasiswa'
                    : modalType === 'lecturer'
                    ? 'Data Dosen'
                    : modalType === 'prodi'
                    ? 'Program Studi'
                    : 'Kegiatan / Event'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              {/* FORM MAHASISWA */}
              {modalType === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIM *</label>
                      <input
                        type="text"
                        required
                        value={studentNim}
                        onChange={(e) => setStudentNim(e.target.value)}
                        placeholder="Contoh: 202470233012"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Semester *</label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        required
                        value={studentSemester}
                        onChange={(e) => setStudentSemester(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Mahasiswa Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Nama lengkap mahasiswa..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                      <input
                        type="text"
                        value={studentProdi}
                        onChange={(e) => setStudentProdi(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Mahasiswa</label>
                      <select
                        value={studentStatus}
                        onChange={(e: any) => setStudentStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Cuti">Cuti</option>
                        <option value="Lulus">Lulus</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. HP / WA</label>
                      <input
                        type="text"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="08..."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="email@alfithrah.ac.id"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Asal / Tinggal</label>
                    <textarea
                      rows={2}
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      placeholder="Alamat domisili mahasiswa..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* FORM DOSEN */}
              {modalType === 'lecturer' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIDN *</label>
                      <input
                        type="text"
                        required
                        value={lecturerNidn}
                        onChange={(e) => setLecturerNidn(e.target.value)}
                        placeholder="Contoh: 2126059505"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Dosen</label>
                      <select
                        value={lecturerStatus}
                        onChange={(e: any) => setLecturerStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Tugas Belajar">Tugas Belajar</option>
                        <option value="Pensiun">Pensiun</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                    <input
                      type="text"
                      required
                      value={lecturerName}
                      onChange={(e) => setLecturerName(e.target.value)}
                      placeholder="Contoh: Muhammad Munir, M.Sos."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jabatan Akademik / Tugas</label>
                      <input
                        type="text"
                        value={lecturerRole}
                        onChange={(e) => setLecturerRole(e.target.value)}
                        placeholder="Contoh: Kaprodi KPI / Lektor"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                      <input
                        type="text"
                        value={lecturerProdi}
                        onChange={(e) => setLecturerProdi(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                      <input
                        type="text"
                        value={lecturerPhone}
                        onChange={(e) => setLecturerPhone(e.target.value)}
                        placeholder="08..."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                      <input
                        type="email"
                        value={lecturerEmail}
                        onChange={(e) => setLecturerEmail(e.target.value)}
                        placeholder="dosen@alfithrah.ac.id"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FORM PROGRAM STUDI */}
              {modalType === 'prodi' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kode Prodi</label>
                      <input
                        type="text"
                        value={prodiCode}
                        onChange={(e) => setProdiCode(e.target.value)}
                        placeholder="KPI / PAI / MD"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-xs uppercase focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jenjang</label>
                      <select
                        value={prodiDegree}
                        onChange={(e: any) => setProdiDegree(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                      >
                        <option value="S1">S1 (Sarjana)</option>
                        <option value="S2">S2 (Magister)</option>
                        <option value="S3">S3 (Doktor)</option>
                        <option value="D3">D3 (Diploma)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Akreditasi</label>
                      <select
                        value={prodiAccredited}
                        onChange={(e) => setProdiAccredited(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Unggul">Unggul</option>
                        <option value="Baik Sekali">Baik Sekali</option>
                        <option value="Baik">Baik</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Program Studi *</label>
                    <input
                      type="text"
                      required
                      value={prodiName}
                      onChange={(e) => setProdiName(e.target.value)}
                      placeholder="Contoh: Komunikasi dan Penyiaran Islam"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fakultas</label>
                    <input
                      type="text"
                      value={prodiFaculty}
                      onChange={(e) => setProdiFaculty(e.target.value)}
                      placeholder="Fakultas Tarbiyah dan Dakwah"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Kaprodi</label>
                      <input
                        type="text"
                        value={prodiHead}
                        onChange={(e) => setProdiHead(e.target.value)}
                        placeholder="Muhammad Munir, M.Sos."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIDN Kaprodi</label>
                      <input
                        type="text"
                        value={prodiHeadNidn}
                        onChange={(e) => setProdiHeadNidn(e.target.value)}
                        placeholder="2126059505"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FORM KEGIATAN EVENT */}
              {modalType === 'event' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Kegiatan / Event *</label>
                    <input
                      type="text"
                      required
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Contoh: Festival Penyiaran & Podcast Dakwah Nasional"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kategori Acara</label>
                      <select
                        value={eventCategory}
                        onChange={(e: any) => setEventCategory(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Akademik">Akademik</option>
                        <option value="Seminar & Workshop">Seminar & Workshop</option>
                        <option value="Dakwah & Religi">Dakwah & Religi</option>
                        <option value="Kemahasiswaan">Kemahasiswaan</option>
                        <option value="Ujian & Sidang">Ujian & Sidang</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Kegiatan</label>
                      <select
                        value={eventStatus}
                        onChange={(e: any) => setEventStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Akan Datang">Akan Datang</option>
                        <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal Acara</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Waktu / Pukul</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        placeholder="09:00 WIB"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lokasi Pelaksanaan</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Auditorium Universitas Al-Fithrah"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>
                  {/* Lingkup & Kegiatan Selain Prodi Toggle */}
                  <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-300 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={eventIsOutsideProdi}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEventIsOutsideProdi(checked);
                            if (checked && eventScope === 'Internal Prodi KPI') {
                              setEventScope('Tingkat Universitas Al-Fithrah');
                              setEventOrganizer('Universitas Al-Fithrah');
                            } else if (!checked) {
                              setEventScope('Internal Prodi KPI');
                              setEventOrganizer('Prodi Komunikasi dan Penyiaran Islam');
                            }
                          }}
                          className="w-4 h-4 text-emerald-700 rounded border-amber-300 focus:ring-emerald-600"
                        />
                        <span className="font-bold text-slate-800 text-xs">
                          Kegiatan Selain Prodi (Fakultas / Universitas / Ormawa / Mitra Eksternal)
                        </span>
                      </label>
                      {eventIsOutsideProdi && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                          Selain Prodi
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Lingkup Kegiatan</label>
                        <select
                          value={eventScope}
                          onChange={(e) => {
                            setEventScope(e.target.value);
                            if (e.target.value !== 'Internal Prodi KPI') {
                              setEventIsOutsideProdi(true);
                            }
                          }}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none font-medium"
                        >
                          <option value="Internal Prodi KPI">Internal Prodi KPI</option>
                          <option value="Tingkat Fakultas Tarbiyah dan Dakwah">Tingkat Fakultas Tarbiyah dan Dakwah</option>
                          <option value="Tingkat Universitas Al-Fithrah">Tingkat Universitas Al-Fithrah (Rektorat)</option>
                          <option value="Ormawa & Lembaga Kampus (BEM/DEMA/UKM)">Ormawa & Lembaga Kampus (BEM/DEMA/UKM)</option>
                          <option value="Kerjasama Mitra Eksternal / Industri / Media">Kerjasama Mitra Eksternal / Industri / Media</option>
                          <option value="Kegiatan Nasional / Internasional">Kegiatan Nasional / Internasional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Penyelenggara Resmi</label>
                        <input
                          type="text"
                          value={eventOrganizer}
                          onChange={(e) => setEventOrganizer(e.target.value)}
                          placeholder="Contoh: Rektorat UAF / BEM Fakultas / TVRI Jatim"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Penanggung Jawab (PIC)</label>
                    <input
                      type="text"
                      value={eventPic}
                      onChange={(e) => setEventPic(e.target.value)}
                      placeholder="Nama dosen / pengurus acara..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat Acara</label>
                    <textarea
                      rows={2}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      placeholder="Penjelasan ringkas kegiatan..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-700 outline-none resize-none"
                    />
                  </div>
                </>
              )}

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-red-200 p-5 w-full max-w-sm">
            <h4 className="font-bold text-slate-900 text-sm">Konfirmasi Penghapusan Data</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus data{' '}
              <strong className="text-red-700">{deletingItem.name}</strong> dari sistem? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
