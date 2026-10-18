import React, { useState } from 'react';
import {
  LayoutDashboard,
  Mail,
  Send,
  FileCheck2,
  CalendarDays,
  FolderTree,
  Users,
  Settings,
  Database,
  ChevronDown,
  ChevronRight,
  Layers,
  FileText,
  User,
  ShieldCheck,
  Building2,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award
} from 'lucide-react';
import { InstitutionalLogo } from './InstitutionalLogo';
import { DashboardStats, UserSession } from '../types/letter';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  stats: DashboardStats;
  userSession: UserSession;
  onBackup: () => void;
  onOpenSelfService: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  stats,
  userSession,
  onBackup,
  onOpenSelfService,
  isOpen,
  onCloseMobile,
}) => {
  const [transaksiOpen, setTransaksiOpen] = useState(true);
  const [masterDataOpen, setMasterDataOpen] = useState(true);
  const [referensiOpen, setReferensiOpen] = useState(false);
  const [rekapOpen, setRekapOpen] = useState(false);

  const handleNav = (tab: string) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const isMahasiswa = userSession.role === 'mahasiswa';
  const isDosen = userSession.role === 'dosen';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Bright & Elegant Sidebar with Warm Gold Nuances */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#fbfaf6] text-slate-700 border-r border-amber-200/80 flex flex-col shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Profile Section at Top (Bright Theme with Gold Accent) */}
        <div className="p-4 border-b border-amber-200/70 flex items-center gap-3 bg-white">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 via-amber-500 to-emerald-800 p-0.5 shadow-xs flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <InstitutionalLogo size="sm" className="w-9 h-9" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-2xs" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
              <span>{userSession.name || 'Pengguna KPI'}</span>
            </h3>
            <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
              {isMahasiswa ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Mahasiswa KPI</span>
                </>
              ) : isDosen ? (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate">Dosen KPI</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Administrator</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-[10px] text-slate-500 font-mono truncate">
                {userSession.nim ? `NIM: ${userSession.nim}` : userSession.nidn ? `NIDN: ${userSession.nidn}` : userSession.identifier}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button: Ajukan / Buat Surat */}
        <div className="p-3 bg-[#f6f4eb]/70 border-b border-amber-200/60 space-y-2">
          <button
            onClick={() => {
              onOpenSelfService();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white shadow-sm border border-amber-400/50 transition-all cursor-pointer group"
            title="Isi formulir dan ajukan surat resmi prodi"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{isMahasiswa ? 'Ajukan Surat Baru' : 'Buat Surat Mandiri'}</span>
          </button>

          {/* Backup Database */}
          <button
            onClick={onBackup}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-[11px] font-semibold rounded-md bg-white hover:bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs transition-all cursor-pointer"
            title="Cadangkan seluruh basis data persuratan ke berkas JSON"
          >
            <Database className="w-3 h-3 text-amber-600" />
            <span>Backup Database</span>
          </button>
        </div>

        {/* Navigation Menus List (Bright Theme) */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs select-none custom-scrollbar">
          {/* Section: Modul Portal Terpadu */}
          <div className="pb-1.5 mb-1 border-b border-amber-200/50">
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-900/70 block">
              Modul Portal Terpadu
            </span>

            {/* 1. Dashboard Utama */}
            <button
              onClick={() => handleNav('dashboard-utama')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'dashboard-utama'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard-utama' ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span className="flex-1 text-left">Dashboard Utama</span>
            </button>

            {/* 2. Persuratan */}
            <button
              onClick={() => handleNav('persuratan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'persuratan' || currentTab === 'dashboard'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <Mail className={`w-4 h-4 ${currentTab === 'persuratan' || currentTab === 'dashboard' ? 'text-amber-300' : 'text-emerald-700'}`} />
              <span className="flex-1 text-left">Persuratan</span>
              <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                currentTab === 'persuratan' || currentTab === 'dashboard'
                  ? 'bg-amber-400 text-emerald-950'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {stats.totalLetters}
              </span>
            </button>

            {/* 3. Manajemen SPMI */}
            <button
              onClick={() => handleNav('spmi')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'spmi'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${currentTab === 'spmi' ? 'text-amber-300' : 'text-teal-700'}`} />
              <span className="flex-1 text-left">Manajemen SPMI</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-teal-100 text-teal-800">
                24 STD
              </span>
            </button>

            {/* 4. Kurikulum */}
            <button
              onClick={() => handleNav('kurikulum')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'kurikulum'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${currentTab === 'kurikulum' ? 'text-amber-300' : 'text-amber-700'}`} />
              <span className="flex-1 text-left">Kurikulum</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-amber-100 text-amber-900">
                144 SKS
              </span>
            </button>

            {/* 5. SOP & Dokumen */}
            <button
              onClick={() => handleNav('sop')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'sop'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <Layers className={`w-4 h-4 ${currentTab === 'sop' ? 'text-amber-300' : 'text-blue-700'}`} />
              <span className="flex-1 text-left">SOP & Dokumen</span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded bg-blue-100 text-blue-800">
                42 SOP
              </span>
            </button>
          </div>

          {/* Section: Layanan Persuratan Digital */}
          <div className="pt-1">
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Menu Persuratan Digital
            </span>

            {/* Tabel Utama Persuratan */}
            <button
              onClick={() => handleNav('tabel-persuratan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                currentTab === 'tabel-persuratan'
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-amber-100/60 hover:text-emerald-900'
              }`}
            >
              <FileText className={`w-4 h-4 ${currentTab === 'tabel-persuratan' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="flex-1 text-left">Tabel Data Persuratan</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                {stats.totalLetters}
              </span>
            </button>
          </div>

          {/* Section: Transaksi Persuratan */}
          <div className="pt-2">
            <button
              onClick={() => setTransaksiOpen(!transaksiOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-800 font-bold tracking-wider text-[11px] uppercase cursor-pointer"
            >
              <div className="flex items-center gap-2 text-slate-600">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Transaksi Persuratan</span>
              </div>
              {transaksiOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {transaksiOpen && (
              <div className="space-y-0.5 mt-0.5 pl-2">
                <button
                  onClick={() => handleNav('surat-magang')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'surat-magang'
                      ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Surat Magang / PKM</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-600 text-white font-mono">
                    {stats.totalSuratMasuk}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('surat-penelitian')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'surat-penelitian'
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-amber-600" />
                    <span>Izin Penelitian Skripsi</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-600 text-white font-mono">
                    {stats.totalSuratKeluar}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('disposisi')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'disposisi'
                      ? 'bg-teal-100 text-teal-950 font-bold border border-teal-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Disposisi & Persetujuan</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-600 text-white font-mono">
                    {stats.totalDisposisi}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Rekap Agenda Surat */}
          <div className="pt-2">
            <button
              onClick={() => setRekapOpen(!rekapOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-800 font-bold tracking-wider text-[11px] uppercase cursor-pointer"
            >
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>Rekap Agenda Surat</span>
              </div>
              {rekapOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {rekapOpen && (
              <div className="space-y-0.5 mt-0.5 pl-2">
                <button
                  onClick={() => handleNav('rekap-masuk')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'rekap-masuk'
                      ? 'bg-emerald-100 text-emerald-950 font-bold'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rekap Surat Masuk</span>
                </button>

                <button
                  onClick={() => handleNav('rekap-keluar')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'rekap-keluar'
                      ? 'bg-rose-100 text-rose-950 font-bold'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-rose-600" />
                  <span>Rekap Surat Keluar</span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Referensi & Mitra KPI */}
          <div className="pt-2">
            <button
              onClick={() => setReferensiOpen(!referensiOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-800 font-bold tracking-wider text-[11px] uppercase cursor-pointer"
            >
              <div className="flex items-center gap-2 text-slate-600">
                <FolderTree className="w-3.5 h-3.5 text-amber-600" />
                <span>Referensi & Mitra KPI</span>
              </div>
              {referensiOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {referensiOpen && (
              <div className="space-y-0.5 mt-0.5 pl-2">
                <button
                  onClick={() => handleNav('referensi-penerima')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-amber-50 hover:text-slate-900 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span>Mitra Media & Instansi</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-100 text-purple-900">
                    {stats.totalPenerima}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('referensi-pembuat')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:bg-amber-50 hover:text-slate-900 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dosen & Mahasiswa</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 text-amber-900">
                    {stats.totalPembuat}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Master Data Super Admin (Mahasiswa, Dosen, Prodi, Kegiatan) */}
          <div className="pt-1">
            <button
              onClick={() => setMasterDataOpen(!masterDataOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-500 hover:text-slate-800 font-bold tracking-wider text-[11px] uppercase cursor-pointer"
            >
              <div className="flex items-center gap-2 text-slate-700">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Master Data Akademik</span>
              </div>
              {masterDataOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {masterDataOpen && (
              <div className="space-y-0.5 mt-0.5 pl-2">
                <button
                  onClick={() => handleNav('kelola-mahasiswa')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'kelola-mahasiswa'
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Data Mahasiswa</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 text-amber-900">
                    {stats.totalMahasiswa || 5}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('kelola-dosen')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'kelola-dosen'
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Data Dosen</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-100 text-emerald-900">
                    {stats.totalDosen || 4}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('kelola-prodi')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'kelola-prodi'
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Program Studi</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-100 text-blue-900">
                    {stats.totalProdi || 5}
                  </span>
                </button>

                <button
                  onClick={() => handleNav('kelola-events')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentTab === 'kelola-events'
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
                    <span>Kegiatan & Event</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-purple-100 text-purple-900">
                    {stats.totalEvents || 5}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Setting Aplikasi */}
          <div className="pt-2">
            <button
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                  : 'text-slate-600 hover:bg-amber-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Setting & Cloud Database</span>
            </button>
          </div>
        </div>

        {/* Footer in Sidebar (Warm Gold Nuance) */}
        <div className="p-3 border-t border-amber-200/70 text-[11px] text-slate-600 bg-white">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Prodi Komunikasi & Penyiaran Islam</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
            Universitas Al-Fithrah Surabaya · v3.1.0
          </p>
        </div>
      </aside>
    </>
  );
};
