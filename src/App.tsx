import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview, YearlyStat } from './components/DashboardOverview';
import { MainPortalDashboard } from './components/MainPortalDashboard';
import { SpmiDashboard } from './components/SpmiDashboard';
import { KurikulumDashboard } from './components/KurikulumDashboard';
import { SopDashboard } from './components/SopDashboard';
import { LetterTableSection } from './components/LetterTableSection';
import { AddEditLetterModal } from './components/AddEditLetterModal';
import { DetailLetterModal } from './components/DetailLetterModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { DispositionModal } from './components/DispositionModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { LoginModal } from './components/LoginModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { SelfServiceLetterModal } from './components/SelfServiceLetterModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  Letter,
  DashboardStats,
  UserSession,
  UserRole
} from './types/letter';
import {
  fetchLetters,
  fetchStats,
  createLetter,
  updateLetter,
  deleteLetter,
  updateDisposition,
  approveLetter,
  loginUser,
  generateSelfServiceLetter,
  getBackupDownloadUrl,
  getPdfUrl
} from './services/api';
import { MasterDataManagementSection } from './components/MasterDataManagementSection';
import {
  initGoogleAuth,
  signInWithGoogle,
  getGoogleAccessToken,
  syncLetterToDrive
} from './services/googleDrive';
import { Sparkles, GraduationCap, BookOpen, ShieldCheck, Cloud, RefreshCw, Layers, LayoutDashboard, Mail } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard-utama');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Data states
  const [letters, setLetters] = useState<Letter[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSuratMasuk: 157,
    totalSuratKeluar: 62,
    totalKlasifikasi: 298,
    totalDisposisi: 71,
    totalAkunUser: 6,
    totalPdfTersimpan: 160,
    totalPenerima: 88,
    totalPembuat: 30,
    totalBidang: 7,
    totalLetters: 10,
    totalWithoutPdf: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Google Drive & Cloud Integration states
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(false);
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [isSyncingDrive, setIsSyncingDrive] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [storageFilter, setStorageFilter] = useState<string>('Semua');
  const [dispositionFilter, setDispositionFilter] = useState<string>('Semua');
  const [creatorFilter, setCreatorFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('orderNumberDesc');

  // User session: Default logged in as Super Admin Universitas Al-Fithrah (Single Role Akses Penuh)
  const [userSession, setUserSession] = useState<UserSession>({
    isAuthenticated: true,
    role: 'admin',
    identifier: 'admin',
    name: 'Super Admin Universitas Al-Fithrah',
    email: 'admin@alfithrah.ac.id',
    studyProgram: 'Komunikasi dan Penyiaran Islam',
    faculty: 'Fakultas Tarbiyah dan Dakwah',
    phone: '031-51502422',
    address: 'Gedung Rektorat Lt. 2, Kampus UAF Surabaya',
  });

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [selfServiceModalOpen, setSelfServiceModalOpen] = useState<boolean>(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const [detailLetter, setDetailLetter] = useState<Letter | null>(null);
  const [viewingPdfLetter, setViewingPdfLetter] = useState<Letter | null>(null);
  const [dispositionLetter, setDispositionLetter] = useState<Letter | null>(null);
  const [deletingLetter, setDeletingLetter] = useState<Letter | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load letters from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [lettersRes, statsRes] = await Promise.all([
        fetchLetters({
          search: searchQuery,
          category: categoryFilter,
          storageStatus: storageFilter,
          dispositionStatus: dispositionFilter,
          creatorIdentifier: creatorFilter,
          sortBy,
        }),
        fetchStats(),
      ]);

      setLetters(lettersRes.data);
      setStats(statsRes);
    } catch (err: unknown) {
      console.error('Error fetching data:', err);
      showToast('error', 'Gagal memuat data', 'Pastikan koneksi server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, categoryFilter, storageFilter, dispositionFilter, creatorFilter, sortBy]);

  // Google Auth Listener
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user) => {
        setGoogleUser(user);
        setIsDriveConnected(true);
      },
      () => {
        setGoogleUser(null);
        setIsDriveConnected(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const syncedDriveCount = useMemo(() => {
    return letters.filter((l) => l.isSyncedToDrive || l.driveFileId).length;
  }, [letters]);

  // Connect Google Drive
  const handleConnectGoogleDrive = async () => {
    try {
      showToast('info', 'Menghubungkan ke Google Drive...', 'Membuka popup otorisasi Google.');
      const result = await signInWithGoogle();
      setGoogleUser(result.user);
      setIsDriveConnected(true);
      showToast(
        'success',
        'Google Drive Terhubung!',
        `Akun ${result.user.email} tersambung. Seluruh surat otomatis dicadangkan ke Google Drive.`
      );
    } catch (err: any) {
      console.error('Connect drive error:', err);
      showToast('error', 'Gagal Terhubung ke Drive', err.message || 'Otorisasi Google Drive dibatalkan.');
    }
  };

  // Sync All Letters to Google Drive
  const handleSyncAllLettersToDrive = async () => {
    let token = await getGoogleAccessToken();
    if (!token) {
      await handleConnectGoogleDrive();
      token = await getGoogleAccessToken();
      if (!token) return;
    }

    try {
      setIsSyncingDrive(true);
      showToast('info', 'Memulai Sinkronisasi', `Menyelaraskan ${letters.length} berkas surat ke Google Drive...`);
      let successCount = 0;
      for (const l of letters) {
        try {
          await syncLetterToDrive(token, l);
          successCount++;
        } catch (e) {
          console.error(`Gagal sync surat ${l.letterNumber}:`, e);
        }
      }
      await loadData();
      showToast(
        'success',
        'Sinkronisasi Drive Selesai!',
        `Berhasil menyinkronkan ${successCount} surat ke folder "Arsip Persuratan Digital KPI - Universitas Al-Fithrah".`
      );
    } catch (err: any) {
      showToast('error', 'Sinkronisasi Gagal', err.message);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Sync Single Letter to Google Drive
  const handleSyncSingleLetter = async (letter: Letter) => {
    let token = await getGoogleAccessToken();
    if (!token) {
      try {
        const res = await signInWithGoogle();
        token = res.accessToken;
        setGoogleUser(res.user);
        setIsDriveConnected(true);
      } catch (err: any) {
        showToast('error', 'Gagal Otorisasi Google Drive', err.message);
        return;
      }
    }

    try {
      showToast('info', 'Mengunggah ke Drive...', `Surat nomor ${letter.letterNumber}`);
      const uploaded = await syncLetterToDrive(token, letter);
      await loadData();
      showToast('success', 'Tersimpan di Google Drive!', `Berkas "${uploaded.name}" siap diakses.`);
    } catch (err: any) {
      showToast('error', 'Gagal Unggah ke Drive', err.message);
    }
  };

  // Google Login as Super Admin
  const handleLoginWithGoogle = async () => {
    const result = await signInWithGoogle();
    setGoogleUser(result.user);
    setIsDriveConnected(true);
    setUserSession({
      isAuthenticated: true,
      role: 'admin',
      identifier: result.user.email || 'admin@alfithrah.ac.id',
      name: result.user.displayName ? `${result.user.displayName} (Super Admin)` : 'Super Admin Universitas Al-Fithrah',
      email: result.user.email || 'admin@alfithrah.ac.id',
      studyProgram: 'Komunikasi dan Penyiaran Islam',
      faculty: 'Fakultas Tarbiyah dan Dakwah',
      phone: '031-51502422',
      address: 'Gedung Rektorat Lt. 2, Kampus UAF Surabaya',
    });
    showToast(
      'success',
      'Login Google Berhasil!',
      `Selamat datang, ${result.user.displayName || result.user.email}. Hak akses penuh Super Admin & Google Drive aktif!`
    );
  };

  // Tab navigation handler
  const handleSelectTab = (tab: string) => {
    if (tab === 'dashboard') {
      setCurrentTab('persuratan');
      setCategoryFilter('Semua');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else {
      setCurrentTab(tab);
    }

    if (tab === 'dashboard-utama') {
      // Main integrated dashboard
    } else if (tab === 'persuratan' || tab === 'dashboard') {
      setCategoryFilter('Semua');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'spmi' || tab === 'kurikulum' || tab === 'sop') {
      // Modular dashboards
    } else if (
      tab === 'kelola-mahasiswa' ||
      tab === 'kelola-dosen' ||
      tab === 'kelola-prodi' ||
      tab === 'kelola-events' ||
      tab === 'master-data'
    ) {
      // Direct rendering of MasterDataManagementSection
    } else if (tab === 'surat-magang') {
      setCategoryFilter('Surat Magang / PKM');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'surat-penelitian') {
      setCategoryFilter('Surat Izin Penelitian');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'surat-saya') {
      setCategoryFilter('Semua');
      setCreatorFilter(userSession.identifier);
      setDispositionFilter('Semua');
    } else if (tab === 'disposisi') {
      setCategoryFilter('Semua');
      setCreatorFilter('');
      setDispositionFilter('Proses Disposisi');
    } else if (tab === 'tabel-persuratan') {
      setCategoryFilter('Semua');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'rekap-masuk') {
      setCategoryFilter('Surat Masuk');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'rekap-keluar') {
      setCategoryFilter('Surat Keluar');
      setCreatorFilter('');
      setDispositionFilter('Semua');
    } else if (tab === 'referensi-penerima') {
      setCurrentTab('tabel-persuratan');
      setCategoryFilter('Semua');
    } else if (tab === 'referensi-pembuat') {
      setCurrentTab('kelola-dosen');
    } else if (tab === 'settings') {
      setFirebaseModalOpen(true);
    }
  };

  // Create or Edit letter manually
  const handleSubmitLetter = async (formData: FormData, isEdit: boolean, letterId?: string) => {
    if (isEdit && letterId) {
      const updated = await updateLetter(letterId, formData);
      showToast('success', 'Surat Berhasil Diperbarui', `Surat nomor ${updated.letterNumber} telah disimpan.`);
    } else {
      const created = await createLetter(formData);
      showToast('success', 'Surat Berhasil Ditambahkan', `Surat resmi ${created.letterNumber} tersimpan di arsip.`);

      // Auto-sync to Google Drive if connected
      const token = await getGoogleAccessToken();
      if (token) {
        try {
          await syncLetterToDrive(token, created);
          showToast('success', 'Google Drive Auto-Sync', `Surat ${created.letterNumber} otomatis dicadangkan ke Google Drive.`);
        } catch (e) {
          console.warn('Auto sync warning:', e);
        }
      }
    }
    await loadData();
  };

  // Generate self-service letter (Mahasiswa NIM / Dosen NIDN)
  const handleGenerateSelfService = async (payload: any) => {
    const generated = await generateSelfServiceLetter(payload);
    showToast(
      'success',
      'Surat Resmi Berhasil Diterbitkan!',
      `Nomor surat ${generated.letterNumber} telah dibuat & berkas PDF siap diunduh.`
    );

    // Auto-sync to Google Drive if connected
    const token = await getGoogleAccessToken();
    if (token) {
      try {
        await syncLetterToDrive(token, generated);
        showToast('success', 'Google Drive Auto-Sync', `Surat ${generated.letterNumber} otomatis dicadangkan ke Google Drive.`);
      } catch (e) {
        console.warn('Auto sync warning:', e);
      }
    }

    await loadData();

    // Automatically trigger PDF download or view
    const downloadLink = document.createElement('a');
    downloadLink.href = getPdfUrl(generated.id, true);
    downloadLink.setAttribute('download', generated.pdfFileName || 'Surat_Resmi_KPI.pdf');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Delete letter
  const handleDeleteLetter = async (letterId: string) => {
    await deleteLetter(letterId);
    showToast('success', 'Surat Berhasil Dihapus', 'Data dokumen dan berkas PDF telah dihapus dari sistem.');
    await loadData();
  };

  // Save Disposition
  const handleSaveDisposition = async (
    id: string,
    payload: { dispositionTo: string; dispositionNote: string; dispositionStatus: string }
  ) => {
    await updateDisposition(id, payload);
    showToast('success', 'Disposisi Tersimpan', `Instruksi disposisi diteruskan ke ${payload.dispositionTo}.`);
    await loadData();
  };

  // Multi-role Login handler for Mahasiswa, Dosen KPI, and Admin
  const handleLogin = async (role: UserRole, identifier: string, pass: string) => {
    const res = await loginUser(role, identifier, pass);
    setUserSession({
      ...res.user,
      isAuthenticated: true,
    });
    showToast(
      'success',
      `Login Berhasil (${res.user.role.toUpperCase()})`,
      `Selamat datang, ${res.user.name}. Portal persuratan KPI aktif.`
    );
  };

  // Approval handler for Dosen KPI & Admin
  const handleApproveLetter = async (letterId: string) => {
    try {
      const approverName = userSession.name || 'Dosen KPI';
      const updated = await approveLetter(letterId, approverName);
      showToast(
        'success',
        'Surat Berhasil Disetujui!',
        `Surat resmi nomor ${updated.letterNumber} telah disetujui oleh ${approverName}.`
      );
      await loadData();
    } catch (err: any) {
      showToast('error', 'Gagal Menyetujui Surat', err.message);
    }
  };

  const handleLogout = () => {
    setUserSession({
      isAuthenticated: false,
      role: 'mahasiswa',
      identifier: '',
      name: '',
      email: '',
      studyProgram: 'Komunikasi dan Penyiaran Islam',
      faculty: 'Fakultas Tarbiyah dan Dakwah',
    });
    setLoginModalOpen(true);
    showToast('info', 'Sesi Berakhir', 'Anda telah keluar. Silakan masuk kembali.');
  };

  // Backup database download
  const handleBackupDatabase = () => {
    const link = document.createElement('a');
    link.href = getBackupDownloadUrl();
    link.setAttribute('download', `backup_persuratan_kpi_iaf_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Cadangan Database Diunduh', 'Berkas backup arsip persuratan JSON berhasil diunduh.');
  };

  const yearlyStats = useMemo<YearlyStat[]>(() => {
    const currentYear = new Date().getFullYear();
    const map: Record<string, YearlyStat> = {
      [String(currentYear)]: { year: String(currentYear), disposisi: 0, masuk: 0, keluar: 0 },
    };

    letters.forEach((l) => {
      const year = (l.letterDate || l.createdAt || '').slice(0, 4) || String(currentYear);
      if (!map[year]) {
        map[year] = { year, disposisi: 0, masuk: 0, keluar: 0 };
      }
      if (l.category === 'Surat Masuk') {
        map[year].masuk += 1;
      } else {
        map[year].keluar += 1;
      }
      if (l.dispositionStatus && l.dispositionStatus !== 'Belum Didisposisi') {
        map[year].disposisi += 1;
      }
    });

    return Object.values(map).sort((a, b) => a.year.localeCompare(b.year));
  }, [letters]);

  const activeModule = useMemo(() => {
    if (currentTab === 'dashboard-utama') return 'dashboard-utama';
    if (currentTab === 'spmi') return 'spmi';
    if (currentTab === 'kurikulum') return 'kurikulum';
    if (currentTab === 'sop') return 'sop';
    return 'persuratan';
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col font-sans text-slate-800 antialiased">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        stats={stats}
        userSession={userSession}
        onBackup={handleBackupDatabase}
        onOpenSelfService={() => setSelfServiceModalOpen(true)}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all">
        {/* Header Navigation with Welcome Greeting & Modular Top Navigation Menu */}
        <Header
          userSession={userSession}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddModal={() => {
            setEditingLetter(null);
            setAddModalOpen(true);
          }}
          onOpenSelfService={() => setSelfServiceModalOpen(true)}
          onOpenLoginModal={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDriveConnected={isDriveConnected}
          onConnectDrive={handleConnectGoogleDrive}
          onSyncAllDrive={handleSyncAllLettersToDrive}
          isSyncingDrive={isSyncingDrive}
          syncedDriveCount={syncedDriveCount}
          totalDriveCount={letters.length}
          activeModule={activeModule}
          onSelectModule={(mod) => handleSelectTab(mod)}
        />

        {/* Viewport Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Quick Role-Aware Banner */}
          {userSession.role === 'admin' && (
            <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-900 via-[#065f46] to-emerald-950 text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
                  <Sparkles className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                      Administrator Persuratan
                    </span>
                    <span className="text-xs text-amber-300">·</span>
                    <span className="text-xs text-amber-200 font-mono font-bold">
                      {userSession.email || 'admin@alfithrah.ac.id'}
                    </span>
                    <span className="text-xs text-emerald-300">·</span>
                    <span className="text-xs text-emerald-100 font-medium">
                      Kaprodi: Muhammad Munir, M.Sos. (NIDN: 2126059505)
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                    Penerbitan Surat Resmi Mahasiswa & Dosen (Kop, TTD & Stempel Otomatis)
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed max-w-3xl">
                    Sistem persuratan mandiri prodi KPI terintegrasi dengan Google Drive dan verifikasi Dosen KPI.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelfServiceModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Buat Surat Mandiri</span>
                </button>
              </div>
            </div>
          )}

          {/* Institutional Title Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  {currentTab === 'dashboard-utama'
                    ? 'PORTAL AKADEMIK TERPADU PRODI KPI'
                    : currentTab === 'spmi'
                    ? 'MANAJEMEN MUTU SPMI'
                    : currentTab === 'kurikulum'
                    ? 'STRUKTUR KURIKULUM & SILABUS'
                    : currentTab === 'sop'
                    ? 'STANDAR OPERASIONAL PROSEDUR (SOP)'
                    : 'PERSURATAN DIGITAL PRODI KPI'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 border border-amber-300/60 px-2 py-0.5 rounded uppercase tracking-wider">
                  {currentTab === 'dashboard-utama'
                    ? '4 PILAR TERINTEGRASI'
                    : currentTab === 'spmi'
                    ? 'SIKLUS PPEPP 2026/2027'
                    : currentTab === 'kurikulum'
                    ? '144 SKS / OBE'
                    : currentTab === 'sop'
                    ? '42 SOP RESMI'
                    : 'V.1 SIAP PAKAI'}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentTab === 'dashboard-utama'
                    ? 'Pusat Tata Kelola Tridharma Terpadu'
                    : currentTab === 'spmi'
                    ? 'Audit Mutu Internal & Akreditasi BAN-PT'
                    : currentTab === 'kurikulum'
                    ? 'Struktur Mata Kuliah & RPS Studio Penyiaran'
                    : currentTab === 'sop'
                    ? 'Panduan Pelayanan Akademik Baku'
                    : currentTab === 'persuratan' || currentTab === 'dashboard'
                    ? 'Dashboard Administrasi Persuratan'
                    : currentTab === 'kelola-mahasiswa'
                    ? 'Kelola Master Data Mahasiswa'
                    : currentTab === 'kelola-dosen'
                    ? 'Kelola Master Data Dosen KPI'
                    : currentTab === 'kelola-prodi'
                    ? 'Kelola Program Studi'
                    : currentTab === 'kelola-events'
                    ? 'Kelola Kegiatan & Event'
                    : currentTab === 'surat-magang'
                    ? 'Arsip Surat Magang / PKM'
                    : currentTab === 'surat-penelitian'
                    ? 'Arsip Izin Penelitian Skripsi'
                    : currentTab === 'surat-saya'
                    ? `Arsip Dokumen Milik ${userSession.name}`
                    : 'Tabel Data Persuratan Resmi'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentTab === 'dashboard-utama'
                  ? 'Portal Akademik Terpadu Prodi Komunikasi dan Penyiaran Islam'
                  : currentTab === 'spmi'
                  ? 'Manajemen SPMI & Akreditasi Prodi KPI'
                  : currentTab === 'kurikulum'
                  ? 'Struktur Kurikulum 144 SKS & RPS Penyiaran Islam'
                  : currentTab === 'sop'
                  ? 'Pusat Dokumen & SOP Pelayanan Akademik Terpadu'
                  : currentTab === 'persuratan' || currentTab === 'dashboard'
                  ? 'Sistem Informasi Persuratan Digital KPI Universitas Al-Fithrah'
                  : currentTab === 'kelola-mahasiswa'
                  ? 'Master Data Mahasiswa Universitas Al-Fithrah'
                  : currentTab === 'kelola-dosen'
                  ? 'Master Data Dosen & Tenaga Pengajar KPI'
                  : currentTab === 'kelola-prodi'
                  ? 'Daftar Program Studi Universitas Al-Fithrah'
                  : currentTab === 'kelola-events'
                  ? 'Agenda Kegiatan & Event (Internal & Selain Prodi)'
                  : currentTab === 'surat-saya'
                  ? `Daftar Surat Mandiri ${userSession.name}`
                  : 'Arsip Dokumen Surat Resmi Prodi KPI'}
              </h1>
            </div>

            {/* View Switcher: Navigasi 5 Modul Utama */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 rounded-lg self-start sm:self-auto text-xs">
              <button
                onClick={() => handleSelectTab('dashboard-utama')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'dashboard-utama'
                    ? 'bg-white text-emerald-950 shadow-xs font-bold border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span>Dashboard Utama</span>
              </button>

              <button
                onClick={() => handleSelectTab('persuratan')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'persuratan' || currentTab === 'dashboard'
                    ? 'bg-white text-emerald-950 shadow-xs font-bold border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>Persuratan</span>
              </button>

              <button
                onClick={() => handleSelectTab('spmi')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'spmi'
                    ? 'bg-white text-teal-950 shadow-xs font-bold border border-teal-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>SPMI</span>
              </button>

              <button
                onClick={() => handleSelectTab('kurikulum')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'kurikulum'
                    ? 'bg-white text-amber-950 shadow-xs font-bold border border-amber-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Kurikulum</span>
              </button>

              <button
                onClick={() => handleSelectTab('sop')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'sop'
                    ? 'bg-white text-blue-950 shadow-xs font-bold border border-blue-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>SOP</span>
              </button>
            </div>
          </div>

          {/* Conditional View Rendering */}
          {currentTab === 'dashboard-utama' ? (
            <MainPortalDashboard
              stats={stats}
              userSession={userSession}
              onNavigateModule={(mod) => handleSelectTab(mod)}
              onOpenSelfService={() => setSelfServiceModalOpen(true)}
            />
          ) : currentTab === 'spmi' ? (
            <SpmiDashboard
              userSession={userSession}
              onNavigateModule={(mod) => handleSelectTab(mod)}
            />
          ) : currentTab === 'kurikulum' ? (
            <KurikulumDashboard
              userSession={userSession}
              onNavigateModule={(mod) => handleSelectTab(mod)}
            />
          ) : currentTab === 'sop' ? (
            <SopDashboard
              userSession={userSession}
            />
          ) : currentTab === 'persuratan' || currentTab === 'dashboard' ? (
            <div className="space-y-8">
              <DashboardOverview
                stats={stats}
                yearlyStats={yearlyStats}
                userSession={userSession}
                letters={letters}
                onNavigateTo={(tab) => handleSelectTab(tab)}
                onOpenSettings={() => setFirebaseModalOpen(true)}
                onOpenSelfService={() => setSelfServiceModalOpen(true)}
                onApproveLetter={handleApproveLetter}
                onOpenDetailModal={(l) => setDetailLetter(l)}
                onOpenPdfViewer={(l) => setViewingPdfLetter(l)}
              />

              <div className="pt-2">
                <LetterTableSection
                  letters={letters}
                  isLoading={isLoading}
                  onOpenAddModal={() => {
                    setEditingLetter(null);
                    setAddModalOpen(true);
                  }}
                  onOpenEditModal={(l) => {
                    setEditingLetter(l);
                    setAddModalOpen(true);
                  }}
                  onOpenDetailModal={(l) => setDetailLetter(l)}
                  onOpenDeleteModal={(l) => setDeletingLetter(l)}
                  onOpenPdfViewer={(l) => setViewingPdfLetter(l)}
                  onOpenDispositionModal={(l) => setDispositionLetter(l)}
                  userSession={userSession}
                  activeCategoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  activeStorageFilter={storageFilter}
                  onStorageFilterChange={setStorageFilter}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  isDriveConnected={isDriveConnected}
                  onSyncToDrive={handleSyncSingleLetter}
                />
              </div>
            </div>
          ) : currentTab.startsWith('kelola-') || currentTab === 'master-data' ? (
            <MasterDataManagementSection
              userSession={userSession}
              activeTab={
                currentTab === 'kelola-dosen'
                  ? 'lecturers'
                  : currentTab === 'kelola-prodi'
                  ? 'prodi'
                  : currentTab === 'kelola-events'
                  ? 'events'
                  : 'students'
              }
              onShowToast={showToast}
            />
          ) : (
            <div>
              <LetterTableSection
                letters={letters}
                isLoading={isLoading}
                onOpenAddModal={() => {
                  setEditingLetter(null);
                  setAddModalOpen(true);
                }}
                onOpenEditModal={(l) => {
                  setEditingLetter(l);
                  setAddModalOpen(true);
                }}
                onOpenDetailModal={(l) => setDetailLetter(l)}
                onOpenDeleteModal={(l) => setDeletingLetter(l)}
                onOpenPdfViewer={(l) => setViewingPdfLetter(l)}
                onOpenDispositionModal={(l) => setDispositionLetter(l)}
                userSession={userSession}
                activeCategoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                activeStorageFilter={storageFilter}
                onStorageFilterChange={setStorageFilter}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                isDriveConnected={isDriveConnected}
                onSyncToDrive={handleSyncSingleLetter}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-4 px-6 border-t border-slate-200 bg-white text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <span>Copyright © 2016-2026 | Program Studi Komunikasi dan Penyiaran Islam </span>
              <strong className="text-slate-800">UNIVERSITAS AL-FITHRAH SURABAYA</strong>
              <span>. Kaprodi: Muhammad Munir, M.Sos. (NIDN. 2126059505).</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              Versi 1.0 (V.1 Siap Pakai) · UAF E-Archive
            </div>
          </div>
        </footer>
      </div>

      {/* --- MODALS --- */}
      {/* 1. Self Service Letter Generator Modal (Mahasiswa & Dosen) */}
      <SelfServiceLetterModal
        isOpen={selfServiceModalOpen}
        onClose={() => setSelfServiceModalOpen(false)}
        userSession={userSession}
        onGenerate={handleGenerateSelfService}
      />

      {/* 2. Add / Edit Letter Modal */}
      <AddEditLetterModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingLetter(null);
        }}
        onSubmit={handleSubmitLetter}
        letterToEdit={editingLetter}
      />

      {/* 3. Detail Letter Modal */}
      <DetailLetterModal
        isOpen={!!detailLetter}
        onClose={() => setDetailLetter(null)}
        letter={detailLetter}
        onOpenPdfViewer={(l) => {
          setDetailLetter(null);
          setViewingPdfLetter(l);
        }}
        onSyncToDrive={handleSyncSingleLetter}
        isDriveConnected={isDriveConnected}
      />

      {/* 4. In-App PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={!!viewingPdfLetter}
        onClose={() => setViewingPdfLetter(null)}
        letter={viewingPdfLetter}
      />

      {/* 5. Disposition Modal */}
      <DispositionModal
        isOpen={!!dispositionLetter}
        onClose={() => setDispositionLetter(null)}
        letter={dispositionLetter}
        onSubmit={handleSaveDisposition}
      />

      {/* 6. Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingLetter}
        onClose={() => setDeletingLetter(null)}
        letter={deletingLetter}
        onConfirm={handleDeleteLetter}
      />

      {/* 7. Super Admin Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
        onLoginWithGoogle={handleLoginWithGoogle}
      />

      {/* 8. Firebase & Cloud Guide Modal */}
      <FirebaseGuideModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
      />
    </div>
  );
}
