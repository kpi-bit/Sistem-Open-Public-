import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Key,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { InstitutionalLogo } from './InstitutionalLogo';
import { UserRole } from '../types/letter';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole, identifier: string, pass: string) => Promise<void>;
  onLoginWithGoogle?: () => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLoginWithGoogle,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('mahasiswa');
  const [identifier, setIdentifier] = useState('202470233012');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'mahasiswa') {
      setIdentifier('202470233012'); // Wulan Fathul Wina
      setPassword('123');
    } else if (role === 'dosen') {
      setIdentifier('2126059505'); // Muhammad Munir, M.Sos.
      setPassword('123');
    } else {
      setIdentifier('admin');
      setPassword(''); // Do not prefill or expose admin password for security
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Harap isi identitas (NIM / NIDN / Username).');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await onLogin(selectedRole, identifier.trim(), password.trim());
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login gagal. Silakan periksa kembali data akun Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-200/80 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 shadow-xs">
              <InstitutionalLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider bg-black/25 px-1.5 py-0.5 rounded">
                  Portal Persuratan Digital
                </span>
                <span className="text-[10px] text-emerald-200 font-mono">KPI UAF</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Masuk Sistem Persuratan
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Pilih peran Anda untuk mengakses layanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors cursor-pointer relative z-10"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs: Mahasiswa, Dosen KPI, Admin */}
        <div className="p-3 bg-slate-100/90 border-b border-slate-200 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleRoleChange('mahasiswa')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'mahasiswa'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Mahasiswa</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('dosen')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'dosen'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Dosen KPI</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Admin</span>
          </button>
        </div>

        {/* Role Description Card */}
        <div className="px-5 py-3 bg-emerald-50/50 border-b border-emerald-100 flex items-start gap-2.5">
          {selectedRole === 'mahasiswa' ? (
            <>
              <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-800 shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-emerald-950">Layanan Mahasiswa (Self-Service)</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Ajukan surat magang, izin penelitian, aktif kuliah, atau dispensasi mandiri dengan status <strong>Pending</strong> untuk ditinjau Dosen KPI.
                </p>
              </div>
            </>
          ) : selectedRole === 'dosen' ? (
            <>
              <div className="p-1.5 bg-amber-100 rounded-md text-amber-800 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-950">Portal Dosen KPI</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Verifikasi dan berikan persetujuan (<strong>Approve</strong>) pada permohonan surat mahasiswa KPI yang berstatus Pending.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-1.5 bg-slate-200 rounded-md text-slate-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Hak Akses Administrator</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Kelola master data, arsip surat masuk & keluar prodi, disposisi, dan integrasi Google Drive.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-tight text-xs">{error}</span>
            </div>
          )}

          {/* Identifier Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {selectedRole === 'mahasiswa'
                ? 'Nomor Induk Mahasiswa (NIM)'
                : selectedRole === 'dosen'
                ? 'Nomor Induk Dosen Nasional (NIDN)'
                : 'Username Admin'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'mahasiswa'
                    ? 'Contoh: 202470233012'
                    : selectedRole === 'dosen'
                    ? 'Contoh: 2126059505'
                    : 'admin'
                }
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 font-mono outline-none text-xs transition-all"
              />
            </div>

            {/* Quick Helper Chips for Smooth Testing */}
            {selectedRole === 'mahasiswa' && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-slate-500">Pilih Mahasiswa:</span>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('202470233012');
                    setPassword('123');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-100 text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Wulan (202470233012)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('202470233005');
                    setPassword('123');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-emerald-100 text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Fauzi (202470233005)
                </button>
              </div>
            )}

            {selectedRole === 'dosen' && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-slate-500">Pilih Dosen KPI:</span>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('2126059505');
                    setPassword('123');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Muhammad Munir, M.Sos. (Kaprodi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier('2115088201');
                    setPassword('123');
                  }}
                  className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Dr. Fathur Rohman, M.Si.
                </button>
              </div>
            )}
          </div>

          {/* Password Input (Secure: No plain-text password leaked) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none text-xs transition-all font-mono"
              />
            </div>
            {selectedRole !== 'admin' && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                Sandi akun atau PIN kampus Anda.
              </span>
            )}
          </div>

          {/* Google Login for Super Admin / Drive Integration */}
          {onLoginWithGoogle && selectedRole === 'admin' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    setError(null);
                    await onLoginWithGoogle();
                    onClose();
                  } catch (err: any) {
                    setError(err.message || 'Gagal login dengan akun Google.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-bold transition-all cursor-pointer shadow-2xs text-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
                </svg>
                <span>Masuk dengan Google (Super Admin + Drive)</span>
              </button>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
                selectedRole === 'mahasiswa'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : selectedRole === 'dosen'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>
                {isLoading
                  ? 'Memverifikasi...'
                  : selectedRole === 'mahasiswa'
                  ? 'Masuk Mahasiswa'
                  : selectedRole === 'dosen'
                  ? 'Masuk Dosen KPI'
                  : 'Masuk Admin'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
