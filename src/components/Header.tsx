import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  LogIn,
  LogOut,
  ChevronDown,
  Cloud,
  RefreshCw,
  CheckCircle2,
  Building2,
  User,
  Clock,
  LayoutDashboard,
  Mail,
  Layers
} from 'lucide-react';
import { InstitutionalLogo } from './InstitutionalLogo';
import { UserSession } from '../types/letter';

interface HeaderProps {
  userSession: UserSession;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenAddModal?: () => void;
  onOpenSelfService?: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  isDriveConnected?: boolean;
  onConnectDrive?: () => void;
  onSyncAllDrive?: () => void;
  isSyncingDrive?: boolean;
  syncedDriveCount?: number;
  totalDriveCount?: number;
  activeModule?: string;
  onSelectModule?: (module: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userSession,
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenSelfService,
  onOpenLoginModal,
  onLogout,
  onToggleSidebar,
  isDriveConnected = false,
  onConnectDrive,
  onSyncAllDrive,
  isSyncingDrive = false,
  syncedDriveCount = 0,
  totalDriveCount = 0,
  activeModule = 'dashboard-utama',
  onSelectModule,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMahasiswa = userSession.role === 'mahasiswa';
  const isDosen = userSession.role === 'dosen';
  const isAdmin = userSession.role === 'admin';

  // Role display label & styling
  const getRoleBadge = () => {
    if (isMahasiswa) {
      return {
        label: 'Mahasiswa KPI',
        icon: GraduationCap,
        className: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        barClass: 'from-emerald-700 to-teal-800',
      };
    }
    if (isDosen) {
      return {
        label: 'Dosen KPI',
        icon: BookOpen,
        className: 'bg-amber-100 text-amber-950 border-amber-300',
        barClass: 'from-amber-700 to-emerald-900',
      };
    }
    return {
      label: 'Administrator',
      icon: ShieldCheck,
      className: 'bg-purple-100 text-purple-950 border-purple-300',
      barClass: 'from-emerald-900 via-teal-900 to-emerald-950',
    };
  };

  const roleInfo = getRoleBadge();
  const RoleIcon = roleInfo.icon;

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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top Professional Welcome & Institution Banner */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white px-4 sm:px-6 lg:px-8 py-2 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-1.5 text-xs">
          {/* Welcome Text Prominently Displayed */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded bg-white/10 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <p className="font-semibold tracking-wide text-emerald-50 text-[12px] sm:text-[13px]">
              Selamat Datang di Sistem Persuratan Prodi Komunikasi dan Penyiaran Islam (KPI)
              {userSession.isAuthenticated && userSession.name && (
                <span className="ml-1 font-bold text-amber-300">
                  — Halo, {userSession.name}!
                </span>
              )}
            </p>
          </div>

          {/* Institutional sub-details */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-emerald-100/90 font-medium">
            <span>Fakultas Tarbiyah dan Dakwah</span>
            <span className="text-emerald-300/40">|</span>
            <span>Universitas Al-Fithrah Surabaya</span>
            <span className="text-emerald-300/40">|</span>
            <span className="px-1.5 py-0.5 rounded bg-black/25 text-amber-300 font-mono font-bold text-[10px]">
              V.1 Self-Service
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation & Action Bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Sidebar Toggle + Institution Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Menu Navigasi"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                <InstitutionalLogo size="sm" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight text-emerald-950 uppercase">
                    Persuratan KPI
                  </span>
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono text-[10px] font-extrabold">
                    UAF
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Universitas Al-Fithrah Surabaya
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Field */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari surat, perihal, NIM, atau instansi..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions, Drive Status, Role Badge, and Profile/Login */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Google Drive Status & Sync Button */}
            {isDriveConnected ? (
              <button
                onClick={onSyncAllDrive}
                disabled={isSyncingDrive}
                title="Google Drive Terhubung - Klik untuk menyelaraskan surat ke Drive"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50/90 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="hidden xl:inline font-bold">Drive:</span>
                <span className="text-[11px] font-mono font-bold text-blue-700">
                  {syncedDriveCount}/{totalDriveCount}
                </span>
                {isSyncingDrive ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
              </button>
            ) : onConnectDrive ? (
              <button
                onClick={onConnectDrive}
                title="Hubungkan ke Google Drive untuk pengarsipan otomatis"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="hidden xl:inline">Drive</span>
              </button>
            ) : null}

            {/* Role-Specific Primary Action Button */}
            {isMahasiswa && onOpenSelfService ? (
              <button
                onClick={onOpenSelfService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ajukan Surat</span>
              </button>
            ) : (isAdmin || isDosen) && onOpenAddModal ? (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Tambah Surat</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            ) : null}

            {/* User Session Profile & Role Dropdown */}
            {userSession.isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer text-left ${
                    isDropdownOpen
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-600/15'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                  aria-expanded={isDropdownOpen}
                >
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-emerald-800 shadow-2xs shrink-0">
                    <RoleIcon className="w-3.5 h-3.5" />
                  </div>

                  <div className="text-left text-xs leading-tight hidden sm:block">
                    <span className="font-bold text-slate-900 truncate block max-w-[130px]">
                      {userSession.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      {roleInfo.label}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isDropdownOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in duration-150">
                    <div className="p-4 bg-gradient-to-br from-[#064e3b] to-[#047857] text-white">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          <RoleIcon className="w-5 h-5 text-amber-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block ${roleInfo.className}`}>
                            {roleInfo.label}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-1 leading-snug truncate">
                            {userSession.name}
                          </h4>
                          <p className="text-[11px] text-emerald-100/90 font-mono mt-0.5 truncate">
                            {userSession.identifier}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1 text-xs text-slate-700">
                      {isMahasiswa && userSession.nim && (
                        <div className="px-3 py-1.5 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">NIM Mahasiswa:</span>
                          <span className="font-mono font-bold text-emerald-950">{userSession.nim}</span>
                        </div>
                      )}
                      {isDosen && userSession.nidn && (
                        <div className="px-3 py-1.5 bg-slate-50 rounded-lg">
                          <span className="text-[10px] text-slate-500 block">NIDN Dosen KPI:</span>
                          <span className="font-mono font-bold text-emerald-950">{userSession.nidn}</span>
                        </div>
                      )}
                      <div className="px-3 py-1.5 bg-slate-50 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Program Studi:</span>
                        <span className="font-medium text-slate-800">Komunikasi dan Penyiaran Islam</span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50/70">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors font-semibold text-xs text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Keluar / Ganti Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modular Top Navigation Menu: 'Dashboard Utama', 'Persuratan', 'Manajemen SPMI', 'Kurikulum', and 'SOP & Dokumen' */}
      {onSelectModule && (
        <div className="bg-[#f8fafc] border-t border-slate-200/90 px-4 sm:px-6 lg:px-8 shadow-inner-xs">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1.5">
            {[
              { id: 'dashboard-utama', label: 'Dashboard Utama', icon: LayoutDashboard },
              { id: 'persuratan', label: 'Persuratan', icon: Mail, badge: totalDriveCount > 0 ? String(totalDriveCount) : undefined },
              { id: 'spmi', label: 'Manajemen SPMI', icon: ShieldCheck, badge: '24 Standar' },
              { id: 'kurikulum', label: 'Kurikulum', icon: BookOpen, badge: '144 SKS' },
              { id: 'sop', label: 'SOP & Dokumen', icon: Layers, badge: '42 SOP' },
            ].map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => onSelectModule(mod.id)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs font-bold ring-1 ring-emerald-950/20'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{mod.label}</span>
                  {mod.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isActive
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {mod.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
