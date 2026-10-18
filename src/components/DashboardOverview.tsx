import React, { useMemo, useState } from 'react';
import {
  Mail,
  Send,
  GitFork,
  FileCheck2,
  Users,
  FileText,
  User,
  Building2,
  Settings,
  ArrowRightCircle,
  BarChart3,
  PieChart as PieIcon,
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Check,
  FileClock,
  Printer,
  ChevronRight
} from 'lucide-react';
import { DashboardStats, Letter, UserSession } from '../types/letter';
import { getPdfUrl } from '../services/api';

export interface YearlyStat {
  year: string;
  disposisi: number;
  masuk: number;
  keluar: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  onNavigateTo: (filterType: string) => void;
  onOpenSettings: () => void;
  yearlyStats?: YearlyStat[];
  userSession: UserSession;
  letters?: Letter[];
  onOpenSelfService?: () => void;
  onApproveLetter?: (letterId: string) => void;
  onOpenDetailModal?: (letter: Letter) => void;
  onOpenPdfViewer?: (letter: Letter) => void;
}

const START_YEAR = 2026;
const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#1f2937', '#a855f7', '#ec4899'];
const CIRCUMFERENCE = 2 * Math.PI * 36;

interface StatCardProps {
  bg: string;
  textColor?: string;
  value: number;
  badge?: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  bg,
  textColor = 'text-white',
  value,
  badge,
  label,
  icon,
  onClick,
}) => (
  <div
    className={`rounded-xl shadow-xs overflow-hidden ${bg} ${textColor} flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
  >
    <div className="p-4 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
            {value}
          </span>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm font-semibold mt-1">{label}</p>
      </div>
      <div className="p-3 bg-black/10 rounded-lg">{icon}</div>
    </div>
    <button
      onClick={onClick}
      className={`w-full py-1.5 px-4 bg-black/15 hover:bg-black/25 flex items-center justify-center gap-1.5 text-xs font-medium ${
        textColor === 'text-white' ? 'text-white/95' : textColor
      } transition-colors cursor-pointer`}
    >
      <span>Lihat Selengkapnya</span>
      <ArrowRightCircle className="w-3.5 h-3.5" />
    </button>
  </div>
);

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  onNavigateTo,
  onOpenSettings,
  yearlyStats = [],
  userSession,
  letters = [],
  onOpenSelfService,
  onApproveLetter,
  onOpenDetailModal,
  onOpenPdfViewer,
}) => {
  const [activePieHover, setActivePieHover] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const isMahasiswa = userSession.role === 'mahasiswa';
  const isDosen = userSession.role === 'dosen';
  const isAdmin = userSession.role === 'admin';

  // Letters belonging specifically to the logged in student
  const studentLetters = useMemo(() => {
    if (!isMahasiswa) return [];
    return letters.filter((l) => {
      const matchNim = userSession.nim && l.studentNim === userSession.nim;
      const matchIdentifier = l.creatorIdentifier === userSession.identifier;
      const matchCreatorRole = l.creatorRole === 'mahasiswa';
      return matchNim || matchIdentifier || matchCreatorRole;
    });
  }, [letters, isMahasiswa, userSession]);

  // Letters from students pending approval (for Dosen KPI & Admin)
  const pendingLetters = useMemo(() => {
    return letters.filter((l) => {
      const isPending = l.approvalStatus === 'Pending' || l.dispositionStatus === 'Belum Didisposisi';
      const isFromStudent = l.creatorRole === 'mahasiswa' || !!l.studentNim;
      return isPending && isFromStudent;
    });
  }, [letters]);

  // Approved letters count
  const approvedLetters = useMemo(() => {
    return letters.filter((l) => l.approvalStatus === 'Approved');
  }, [letters]);

  const handleApprove = async (id: string) => {
    if (!onApproveLetter) return;
    try {
      setApprovingId(id);
      await onApproveLetter(id);
    } finally {
      setApprovingId(null);
    }
  };

  // Yearly data calculations for admin overview
  const barData: YearlyStat[] = useMemo(() => {
    const currentYear = Math.max(new Date().getFullYear(), START_YEAR);
    const years: YearlyStat[] = [];
    for (let y = START_YEAR; y <= currentYear; y++) {
      const found = yearlyStats.find((d) => d.year === String(y));
      years.push({
        year: String(y),
        disposisi: found?.disposisi ?? 0,
        masuk: found?.masuk ?? 0,
        keluar: found?.keluar ?? 0,
      });
    }
    return years;
  }, [yearlyStats]);

  const pieData = barData.map((d, i) => ({
    label: d.year,
    value: d.disposisi,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0);
  const totalDisposisi = barData.reduce((a, d) => a + d.disposisi, 0);
  const totalMasuk = barData.reduce((a, d) => a + d.masuk, 0);
  const totalKeluar = barData.reduce((a, d) => a + d.keluar, 0);

  const maxBarValue = Math.max(
    1,
    ...barData.flatMap((d) => [d.disposisi, d.masuk, d.keluar])
  );

  let accumulated = 0;
  const pieSlices = pieData.map((item) => {
    const fraction = totalPie > 0 ? item.value / totalPie : 0;
    const length = fraction * CIRCUMFERENCE;
    const slice = { ...item, length, offset: -accumulated };
    accumulated += length;
    return slice;
  });

  const barStyle = (value: number): React.CSSProperties =>
    value > 0
      ? { height: `${Math.max((value / maxBarValue) * 100, 4)}%` }
      : { height: '2px', opacity: 0.35 };

  // ----------------------------------------------------
  // 1. DASBOR KHUSUS MAHASISWA
  // ----------------------------------------------------
  if (isMahasiswa) {
    const myPending = studentLetters.filter((l) => l.approvalStatus === 'Pending');
    const myApproved = studentLetters.filter((l) => l.approvalStatus !== 'Pending');

    return (
      <div className="space-y-6">
        {/* Welcome & Action Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-[#065f46] to-emerald-950 text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                  Portal Mahasiswa KPI
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  NIM: {userSession.nim || userSession.identifier}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                Layanan Persuratan Mandiri — {userSession.name}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Anda dapat mengajukan surat permohonan magang, surat izin penelitian skripsi, surat keterangan aktif kuliah, atau surat dispensasi secara online. Berkas pengajuan akan berstatus <strong>Pending</strong> sampai disetujui Dosen KPI.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSelfService}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Ajukan Surat Baru</span>
          </button>
        </div>

        {/* Mahasiswa Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Surat Saya</span>
              <FileText className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-slate-900 mt-2">{studentLetters.length}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Seluruh riwayat pengajuan mandiri</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Menunggu Persetujuan (Pending)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-amber-900 mt-2">{myPending.length}</p>
            <span className="text-[11px] text-amber-800/80 mt-0.5 block">Sedang ditinjau oleh Dosen KPI</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Sudah Disetujui (Approved)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-2">{myApproved.length}</p>
            <span className="text-[11px] text-emerald-800/80 mt-0.5 block">Siap diunduh dengan TTD digital</span>
          </div>
        </div>

        {/* Mahasiswa Letter List */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#fcfbf7]">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>Daftar Surat Milik Saya ({studentLetters.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Surat yang Anda ajukan mandiri untuk keperluan akademik dan kegiatan mahasiswa KPI
              </p>
            </div>

            <button
              onClick={onOpenSelfService}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ajukan Surat</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nomor & Tanggal Surat</th>
                  <th className="py-3 px-4">Nama Surat / Perihal</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tujuan / Instansi</th>
                  <th className="py-3 px-4 text-center">Status Surat</th>
                  <th className="py-3 px-4 text-center w-28">Berkas PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentLetters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileClock className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="font-semibold text-slate-700">Belum ada surat yang Anda ajukan.</p>
                        <p className="text-[11px] text-slate-500">
                          Klik tombol "Ajukan Surat Baru" untuk mengajukan surat magang, izin penelitian, atau aktif kuliah.
                        </p>
                        <button
                          onClick={onOpenSelfService}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Mulai Pengajuan Surat</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  studentLetters.map((l, idx) => {
                    const isPending = l.approvalStatus === 'Pending';
                    return (
                      <tr key={l.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{l.letterNumber}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{l.letterDate}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{l.title}</span>
                          {l.description && (
                            <span className="text-[11px] text-slate-500 block truncate max-w-xs">{l.description}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                            {l.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {l.recipient || l.recipientPerson || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Approved</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {onOpenPdfViewer && (
                              <button
                                onClick={() => onOpenPdfViewer(l)}
                                className="p-1.5 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                title="Lihat Pratinjau PDF"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <a
                              href={getPdfUrl(l.id, true)}
                              download={l.pdfFileName || `Surat_${l.letterNumber}.pdf`}
                              className="p-1.5 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                              title="Unduh Berkas PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. DASBOR KHUSUS DOSEN KPI
  // ----------------------------------------------------
  if (isDosen) {
    return (
      <div className="space-y-6">
        {/* Dosen Welcome Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1e3a5f] via-[#0f4c81] to-[#0d3b66] text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  Portal Dosen KPI
                </span>
                <span className="text-xs text-sky-200 font-mono">
                  NIDN: {userSession.nidn || userSession.identifier}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                Panel Verifikasi & Persetujuan Surat — {userSession.name}
              </h2>
              <p className="text-xs text-sky-100/90 mt-1 max-w-2xl leading-relaxed">
                Tinjau dan berikan persetujuan resmi (<strong>Approve</strong>) pada surat permohonan mandiri mahasiswa KPI yang berstatus <strong>Pending</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Dosen Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">Menunggu Persetujuan</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-amber-950 mt-2">{pendingLetters.length}</p>
            <span className="text-[11px] text-amber-900 mt-0.5 block">Surat mahasiswa berstatus Pending</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-300 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Telah Disetujui (Approved)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-emerald-950 mt-2">{approvedLetters.length}</p>
            <span className="text-[11px] text-emerald-900 mt-0.5 block">Surat aktif dan siap pakai</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Arsip Surat KPI</span>
              <FileText className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-3xl font-extrabold font-mono text-slate-900 mt-2">{letters.length}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Database persuratan prodi</span>
          </div>
        </div>

        {/* PROMINENT SECTION: DAFTAR SURAT MAHASISWA BERSTATUS PENDING DENGAN TOMBOL 'SETUJUI' (APPROVE) */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-300 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-amber-200 bg-gradient-to-r from-amber-50 via-amber-50/60 to-white flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-200 text-amber-950">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Permohonan Surat Mahasiswa Menunggu Persetujuan ({pendingLetters.length})
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Daftar surat yang diajukan mahasiswa KPI yang memerlukan persetujuan dosen sebelum diterbitkan resmi
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fcfbf7] text-slate-700 font-bold uppercase text-[11px] border-b border-amber-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Mahasiswa & NIM</th>
                  <th className="py-3 px-4">Nomor & Tanggal Surat</th>
                  <th className="py-3 px-4">Nama Surat / Perihal</th>
                  <th className="py-3 px-4">Kategori & Tujuan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center w-36">Aksi Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingLetters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
                        <p className="font-bold text-slate-800 text-sm">Semua Permohonan Telah Disetujui!</p>
                        <p className="text-xs text-slate-500">
                          Tidak ada surat mahasiswa yang berstatus Pending saat ini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingLetters.map((l, idx) => (
                    <tr key={l.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{l.studentName || l.creator}</span>
                        <span className="font-mono text-emerald-800 font-semibold text-[11px] block">
                          NIM: {l.studentNim || l.creatorIdentifier || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-900 block">{l.letterNumber}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{l.letterDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{l.title}</span>
                        {l.description && (
                          <span className="text-[11px] text-slate-500 block truncate max-w-xs">{l.description}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold block w-fit mb-1">
                          {l.category}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium block">
                          Ke: {l.recipient || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(l.id)}
                            disabled={approvingId === l.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                            title="Setujui permohonan surat ini"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{approvingId === l.id ? 'Memproses...' : 'Setujui'}</span>
                          </button>
                          {onOpenDetailModal && (
                            <button
                              onClick={() => onOpenDetailModal(l)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                              title="Lihat Rincian Surat"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Secondary Section: Surat Mahasiswa yang Sudah Disetujui */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Surat yang Telah Disetujui ({approvedLetters.length})</span>
            </h3>
            <button
              onClick={() => onNavigateTo('tabel-persuratan')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Arsip</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 text-xs text-slate-600">
            Seluruh surat yang disetujui telah terbit resmi dengan nomor arsip otomatis dan tersimpan di database serta Google Drive.
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. DASBOR ADMINISTRATOR (DEFAULT / FULL OVERVIEW)
  // ----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Pending Letters Alert Callout if any */}
      {pendingLetters.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-200 text-amber-950 shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Ada {pendingLetters.length} Permohonan Surat Mahasiswa Berstatus Pending
              </h4>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Surat mandiri dari mahasiswa memerlukan verifikasi dan persetujuan (Approve) untuk pengesahan.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTo('tabel-persuratan')}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            Tinjau Permohonan
          </button>
        </div>
      )}

      {/* 1. TOP 6 MAIN STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          bg="bg-[#28a745]"
          value={stats.totalSuratMasuk}
          badge="Masuk"
          label="Surat Masuk"
          icon={<Mail className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('surat-masuk')}
        />

        <StatCard
          bg="bg-[#17a2b8]"
          value={stats.totalSuratKeluar}
          badge="Keluar"
          label="Surat Keluar"
          icon={<Send className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('surat-keluar')}
        />

        <StatCard
          bg="bg-[#ffc107]"
          textColor="text-slate-900"
          value={stats.totalDisposisi}
          badge="Proses"
          label="Lembar Disposisi"
          icon={<GitFork className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('disposisi')}
        />

        <StatCard
          bg="bg-[#1e7e34]"
          value={stats.totalKlasifikasi}
          label="Klasifikasi Surat"
          icon={<FileCheck2 className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('klasifikasi')}
        />

        <StatCard
          bg="bg-[#117a8b]"
          value={stats.totalAkunUser}
          label="Pengguna Sistem"
          icon={<Users className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('pengguna')}
        />

        <StatCard
          bg="bg-[#d39e00]"
          textColor="text-slate-900"
          value={stats.totalLetters}
          label="Total Arsip Surat"
          icon={<FileText className="w-8 h-8 opacity-80" />}
          onClick={() => onNavigateTo('tabel-persuratan')}
        />
      </div>

      {/* 2. REKAP MASTER DATA AKADEMIK */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTo('kelola-mahasiswa')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 shadow-2xs cursor-pointer transition-all hover:bg-emerald-50/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mahasiswa</span>
            <GraduationCap className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-1">{stats.totalMahasiswa || 3}</p>
          <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">Kelola Mahasiswa →</span>
        </div>

        <div
          onClick={() => onNavigateTo('kelola-dosen')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-amber-500 shadow-2xs cursor-pointer transition-all hover:bg-amber-50/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dosen KPI</span>
            <BookOpen className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-1">{stats.totalDosen || 2}</p>
          <span className="text-[10px] text-amber-900 font-semibold mt-0.5 block">Kelola Dosen KPI →</span>
        </div>

        <div
          onClick={() => onNavigateTo('kelola-prodi')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 shadow-2xs cursor-pointer transition-all hover:bg-teal-50/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program Studi</span>
            <Building2 className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-1">{stats.totalProdi || 5}</p>
          <span className="text-[10px] text-teal-800 font-semibold mt-0.5 block">Kelola Prodi →</span>
        </div>

        <div
          onClick={() => onNavigateTo('kelola-events')}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 shadow-2xs cursor-pointer transition-all hover:bg-blue-50/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kegiatan & Acara</span>
            <Sparkles className="w-4 h-4 text-blue-700 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 mt-1">{stats.totalEvents || 4}</p>
          <span className="text-[10px] text-blue-800 font-semibold mt-0.5 block">Internal & Selain Prodi →</span>
        </div>
      </div>

      {/* 3. CHARTS: DISPOSISI & PERKEMBANGAN TAHUNAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart Disposisi */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-700" />
                <span>Statistik Disposisi Per Tahun</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Total: {totalDisposisi}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  {totalPie > 0 &&
                    pieSlices.map((slice, i) => (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="36"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth={activePieHover === i ? '17' : '14'}
                        strokeDasharray={`${slice.length} ${CIRCUMFERENCE}`}
                        strokeDashoffset={slice.offset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActivePieHover(i)}
                        onMouseLeave={() => setActivePieHover(null)}
                      />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-800 font-mono">
                    {totalDisposisi}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    Disposisi
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.label}:</span>
                    <span className="font-mono font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart Tahunan */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-800" />
                <span>Grafik Perkembangan Surat & Disposisi</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {START_YEAR} - {Math.max(new Date().getFullYear(), START_YEAR)}
              </span>
            </div>

            <div className="h-48 pt-6 flex items-end justify-around gap-4 border-b border-slate-200 pb-2">
              {barData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Disposisi */}
                    <div
                      className="w-2.5 sm:w-4 bg-teal-500 rounded-t-xs transition-all relative group"
                      style={barStyle(d.disposisi)}
                      title={`Disposisi ${d.year}: ${d.disposisi}`}
                    />
                    {/* Surat Masuk */}
                    <div
                      className="w-2.5 sm:w-4 bg-emerald-600 rounded-t-xs transition-all relative group"
                      style={barStyle(d.masuk)}
                      title={`Surat Masuk ${d.year}: ${d.masuk}`}
                    />
                    {/* Surat Keluar */}
                    <div
                      className="w-2.5 sm:w-4 bg-rose-600 rounded-t-xs transition-all relative group"
                      style={barStyle(d.keluar)}
                      title={`Surat Keluar ${d.year}: ${d.keluar}`}
                    />
                  </div>
                  <span className="mt-2 text-xs font-semibold text-slate-600 font-mono">
                    {d.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-teal-500 rounded-xs" />
                <span>Disposisi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-600 rounded-xs" />
                <span>Surat Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rose-600 rounded-xs" />
                <span>Surat Keluar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};