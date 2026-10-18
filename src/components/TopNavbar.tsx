import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Plus,
  Globe,
  LogIn,
  LogOut,
  Search,
  UserCheck,
  GraduationCap,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Settings,
  Mail,
  Phone,
  Building,
  FileCheck2,
  ExternalLink,
  Cloud,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { UserSession } from '../types/letter';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  onOpenAddModal: () => void;
  onOpenSelfService: () => void;
  onOpenLoginModal: () => void;
  onOpenSettings?: () => void;
  onViewMyLetters?: () => void;
  onLogout: () => void;
  userSession: UserSession;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSwitchToPublic: () => void;
  isDriveConnected?: boolean;
  onConnectDrive?: () => void;
  onSyncAllDrive?: () => void;
  isSyncingDrive?: boolean;
  syncedDriveCount?: number;
  totalDriveCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  onOpenAddModal,
  onOpenSelfService,
  onOpenLoginModal,
  onOpenSettings,
  onViewMyLetters,
  onLogout,
  userSession,
  searchQuery,
  onSearchChange,
  onSwitchToPublic,
  isDriveConnected = false,
  onConnectDrive,
  onSyncAllDrive,
  isSyncingDrive = false,
  syncedDriveCount = 0,
  totalDriveCount = 0,
}) => {
  const isMahasiswa = userSession.role === 'mahasiswa';
  const isDosen = userSession.role === 'dosen';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Institutional Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-emerald-900">
              ApPer
            </span>
            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono text-[10px] font-extrabold">
              V.1
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                KOMUNIKASI & PENYIARAN ISLAM (KPI)
              </span>
              <span className="block text-[11px] text-emerald-800 font-medium -mt-0.5">
                Universitas Al-Fithrah (UAF) Surabaya
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari surat, NIM, NIDN, perihal, atau instansi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Drive Status / Connect Button */}
          {isDriveConnected ? (
            <button
              onClick={onSyncAllDrive}
              disabled={isSyncingDrive}
              title="Google Drive Terhubung - Klik untuk menyelaraskan semua arsip surat ke Drive"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold rounded-md shadow-2xs transition-all cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden md:inline font-bold">Drive:</span>
              <span className="text-[11px] font-mono font-bold text-blue-700">
                {syncedDriveCount}/{totalDriveCount}
              </span>
              {isSyncingDrive ? (
                <RefreshCw className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              )}
            </button>
          ) : (
            <button
              onClick={onConnectDrive}
              title="Hubungkan ke Google Drive untuk mengarsipkan surat otomatis"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md shadow-2xs transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span className="hidden sm:inline">Hubungkan Drive</span>
            </button>
          )}

          {/* Action: Buat Surat Mandiri */}
          <button
            onClick={onOpenSelfService}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-md shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">Buat Surat Mandiri</span>
            <span className="sm:hidden">Buat Surat</span>
          </button>

          {/* User Auth (Mahasiswa NIM / Dosen NIDN) with Interactive Dropdown */}
          {userSession.isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* Interactive User Indicator Trigger */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer group text-left ${
                  isDropdownOpen
                    ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/15'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 hover:border-slate-300'
                }`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <div className="p-1 rounded-md bg-white border border-slate-200 shadow-2xs text-emerald-700 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                </div>

                <div className="text-left text-xs leading-tight">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-800 truncate block max-w-[135px] sm:max-w-[160px] transition-colors">
                    {userSession.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Super Admin Persuratan
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ml-0.5 ${
                    isDropdownOpen ? 'rotate-180 text-emerald-700' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu on Click */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown Header: User Info Summary */}
                  <div className="p-4 bg-gradient-to-br from-emerald-900 to-[#064e3b] text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-emerald-800/80 border-2 border-amber-400/60 p-1 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-amber-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950 inline-block">
                            Super Admin Persuratan
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 leading-snug break-words">
                          {userSession.name}
                        </h4>
                        <p className="text-[11px] text-emerald-200/90 font-mono mt-0.5">
                          admin@alfithrah.ac.id
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Program & Institutional Details */}
                  <div className="p-3.5 bg-slate-50/80 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                        Program Studi
                      </span>
                      <span className="font-bold text-slate-800 block text-xs">
                        {userSession.studyProgram || 'Komunikasi dan Penyiaran Islam'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                        Fakultas & Institusi
                      </span>
                      <span className="text-slate-700 font-medium block text-xs">
                        {userSession.faculty || 'Fakultas Tarbiyah dan Dakwah'} · Universitas Al-Fithrah Surabaya
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500 font-medium">Otoritas Sistem:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        Akses Penuh Seluruh Arsip
                      </span>
                    </div>

                    {userSession.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono">{userSession.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Navigation Links */}
                  <div className="p-1.5 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (onOpenSettings) onOpenSettings();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors font-medium text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Pengaturan & Cloud Sync</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenLoginModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors font-medium text-left cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Masuk Ulang Super Admin</span>
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="p-1.5 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors font-semibold text-xs text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Keluar dari Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Super Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

