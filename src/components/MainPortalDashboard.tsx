import React from 'react';
import {
  LayoutDashboard,
  Mail,
  ShieldCheck,
  BookOpen,
  Layers,
  ArrowRightCircle,
  Sparkles,
  FileText,
  Award,
  GraduationCap,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Building2,
  CalendarDays,
  Send,
  Users,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DashboardStats, UserSession } from '../types/letter';

interface MainPortalDashboardProps {
  stats: DashboardStats;
  userSession: UserSession;
  onNavigateModule: (module: 'dashboard-utama' | 'persuratan' | 'spmi' | 'kurikulum' | 'sop') => void;
  onOpenSelfService?: () => void;
}

export const MainPortalDashboard: React.FC<MainPortalDashboardProps> = ({
  stats,
  userSession,
  onNavigateModule,
  onOpenSelfService,
}) => {
  const isMahasiswa = userSession.role === 'mahasiswa';
  const isDosen = userSession.role === 'dosen';
  const isAdmin = userSession.role === 'admin';

  return (
    <div className="space-y-6">
      {/* 1. Grand Welcoming Banner */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white shadow-lg border-l-4 border-amber-400 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/90 text-emerald-950 font-bold text-[10px] tracking-wide uppercase">
                Portal Terpadu Prodi KPI
              </span>
              <span className="text-emerald-200 text-xs">·</span>
              <span className="text-xs text-emerald-100 font-medium">
                Universitas Al-Fithrah (UAF) Surabaya
              </span>
              <span className="text-emerald-200 text-xs">·</span>
              <span className="text-xs text-amber-300 font-mono font-bold">
                TA 2026/2027
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug">
              Selamat Datang di Portal Akademik Terpadu
              <span className="block text-amber-300 text-lg sm:text-xl lg:text-2xl font-bold mt-1">
                Program Studi Komunikasi dan Penyiaran Islam (KPI)
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pusat komando tata kelola tridharma prodi KPI terintegrasi yang menghimpun seluruh layanan{' '}
              <strong className="text-white font-semibold">Persuratan Mahasiswa & Dosen</strong>,{' '}
              <strong className="text-white font-semibold">Penjaminan Mutu Internal (SPMI)</strong>,{' '}
              <strong className="text-white font-semibold">Kurikulum 144 SKS</strong>, serta{' '}
              <strong className="text-white font-semibold">SOP & Panduan Akademik Baku</strong>.
            </p>

            {userSession.name && (
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  Sesi login aktif sebagai <strong className="text-amber-200">{userSession.name}</strong> ({userSession.role.toUpperCase()})
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            {isMahasiswa && onOpenSelfService && (
              <button
                onClick={onOpenSelfService}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>Ajukan Surat Mandiri</span>
              </button>
            )}

            <button
              onClick={() => onNavigateModule('persuratan')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/30 backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Masuk Modul Persuratan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Top 4 Main Metric Stat Cards (Green, Cyan, Yellow, Blue style) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>Indikator Kinerja 4 Pilar Akademik KPI</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Status Data: Real-Time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Persuratan (Green) */}
          <div className="rounded-xl shadow-xs overflow-hidden bg-[#28a745] text-white flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums">
                    {stats.totalLetters}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                    Arsip
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold mt-1">Layanan Persuratan</p>
                <p className="text-[11px] text-emerald-100 mt-0.5">
                  {stats.totalSuratMasuk} Masuk · {stats.totalSuratKeluar} Keluar
                </p>
              </div>
              <div className="p-2.5 bg-black/10 rounded-lg">
                <Mail className="w-7 h-7 opacity-90" />
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('persuratan')}
              className="w-full py-2 px-4 bg-black/15 hover:bg-black/25 flex items-center justify-between text-xs font-medium text-white/95 transition-colors cursor-pointer"
            >
              <span>Buka Modul Persuratan</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Manajemen SPMI (Cyan) */}
          <div className="rounded-xl shadow-xs overflow-hidden bg-[#17a2b8] text-white flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums">
                    24
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                    Standar
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold mt-1">Manajemen SPMI</p>
                <p className="text-[11px] text-cyan-100 mt-0.5">
                  Audit AMI 100% · Skor 3.84 (A)
                </p>
              </div>
              <div className="p-2.5 bg-black/10 rounded-lg">
                <ShieldCheck className="w-7 h-7 opacity-90" />
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('spmi')}
              className="w-full py-2 px-4 bg-black/15 hover:bg-black/25 flex items-center justify-between text-xs font-medium text-white/95 transition-colors cursor-pointer"
            >
              <span>Buka Modul SPMI</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Kurikulum (Yellow / Amber) */}
          <div className="rounded-xl shadow-xs overflow-hidden bg-[#ffc107] text-slate-900 flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                    144
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider text-slate-900">
                    SKS
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold mt-1 text-slate-900">Kurikulum KPI</p>
                <p className="text-[11px] text-slate-800 mt-0.5">
                  48 Mata Kuliah · 8 Semester
                </p>
              </div>
              <div className="p-2.5 bg-black/10 rounded-lg text-slate-900">
                <BookOpen className="w-7 h-7 opacity-90" />
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('kurikulum')}
              className="w-full py-2 px-4 bg-black/15 hover:bg-black/25 flex items-center justify-between text-xs font-bold text-slate-900 transition-colors cursor-pointer"
            >
              <span>Buka Modul Kurikulum</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: SOP & Dokumen (Blue / Primary) */}
          <div className="rounded-xl shadow-xs overflow-hidden bg-[#007bff] text-white flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div className="p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-extrabold font-mono tabular-nums">
                    42
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                    Baku
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold mt-1">SOP & Dokumen Mutu</p>
                <p className="text-[11px] text-blue-100 mt-0.5">
                  14 SOP Akademik · 8 Lab & Studio
                </p>
              </div>
              <div className="p-2.5 bg-black/10 rounded-lg">
                <Layers className="w-7 h-7 opacity-90" />
              </div>
            </div>
            <button
              onClick={() => onNavigateModule('sop')}
              className="w-full py-2 px-4 bg-black/15 hover:bg-black/25 flex items-center justify-between text-xs font-medium text-white/95 transition-colors cursor-pointer"
            >
              <span>Buka Modul SOP</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Module Gateway Grid (Pintu Akses Modul Terpadu) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-800" />
              <span>Gerbang Layanan Terpadu Program Studi KPI</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih modul di bawah ini untuk mengakses fungsionalitas dan dasbor lengkap masing-masing unit kerja
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Module Box 1: Persuratan */}
          <div
            onClick={() => onNavigateModule('persuratan')}
            className="p-5 rounded-xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    1. Modul Persuratan & E-Archive
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    {stats.totalLetters} Dokumen
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Layanan pengajuan surat mandiri mahasiswa (magang PKM, penelitian skripsi, aktif kuliah), disposisi persetujuan dosen, penomoran otomatis, dan pengarsipan Google Drive.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    TTD & Stempel Otomatis
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Unduh PDF Resmi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module Box 2: SPMI */}
          <div
            onClick={() => onNavigateModule('spmi')}
            className="p-5 rounded-xl border-2 border-teal-100 bg-gradient-to-br from-teal-50/50 to-white hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-teal-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    2. Modul Manajemen SPMI
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono">
                    24 Standar Mutu
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pemantauan siklus PPEPP, dokumentasi Audit Mutu Internal (AMI), ketercapaian standar BAN-PT/LAMDIK, dan rekapitulasi indeks kepuasan tridharma civitas akademika.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-teal-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Siklus PPEPP Aktif
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    Indeks Kepuasan 3.84/4.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module Box 3: Kurikulum */}
          <div
            onClick={() => onNavigateModule('kurikulum')}
            className="p-5 rounded-xl border-2 border-amber-100 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    3. Modul Kurikulum & Silabus
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono">
                    144 SKS / 48 MK
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Struktur sebaran mata kuliah teori dan praktikum penyiaran (radio, TV, podcast, sinematografi dakwah), status verifikasi RPS, dan pemetaan Capaian Pembelajaran Lulusan (CPL).
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-amber-900">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    RPS Terverifikasi 96%
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                    Lab Studio Praktikum
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module Box 4: SOP & Dokumen */}
          <div
            onClick={() => onNavigateModule('sop')}
            className="p-5 rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-700 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                    4. Modul SOP & Dokumen Akademik
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    42 SOP Terbit
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Petunjuk operasional standar mengenai alur magang kerja, seminar proposal, ujian munaqasyah skripsi, peminjaman peralatan studio penyiaran, serta dispensasi mahasiswa.
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-blue-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Prosedur Baku Mutu
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Unduh Dokumen PDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Strategic Institutional Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Visi Keilmuan Prodi KPI */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Visi Keilmuan & Distingsi Program Studi KPI
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                UAF Unggul
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Menjadi Program Studi Komunikasi dan Penyiaran Islam yang unggul dalam integrasi keilmuan komunikasi penyiaran dan nilai-nilai dakwah Islamiyyah Ahlussunnah wal Jama'ah berbasis teknologi digital dan kearifan pesantren pada tingkat nasional pada tahun 2030."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-[11px]">Konsentrasi 1:</span>
                <span className="text-emerald-800 font-medium">Penyiaran Televisi & Radio Dakwah</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-950 block text-[11px]">Konsentrasi 2:</span>
                <span className="text-amber-800 font-medium">Jurnalistik Digital & Media Siber</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-950 block text-[11px]">Konsentrasi 3:</span>
                <span className="text-blue-800 font-medium">Public Relations & Manajemen Dakwah</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kaprodi: Muhammad Munir, M.Sos. (NIDN: 2126059505)</span>
            <span className="text-emerald-700 font-bold">Akreditasi BAN-PT</span>
          </div>
        </div>

        {/* Right: Quick Action Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <span>Akses Cepat Layanan</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateModule('persuratan')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Daftar Surat Keluar & Magang</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateModule('spmi')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Laporan Audit Mutu Internal</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateModule('kurikulum')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Daftar Mata Kuliah 144 SKS</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigateModule('sop')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>Panduan & SOP Munaqasyah</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-mono">
              Portal Akademik Terpadu KPI v3.2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
