import React from 'react';
import {
  X,
  FileText,
  FileCheck,
  FileX,
  Calendar,
  Building2,
  User,
  Eye,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Cloud,
  Printer
} from 'lucide-react';
import { Letter } from '../types/letter';
import { getPdfUrl } from '../services/api';
import { InstitutionalLogo } from './InstitutionalLogo';

interface DetailLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: Letter | null;
  onOpenPdfViewer: (letter: Letter) => void;
  onSyncToDrive?: (letter: Letter) => void;
  isDriveConnected?: boolean;
}

export const DetailLetterModal: React.FC<DetailLetterModalProps> = ({
  isOpen,
  onClose,
  letter,
  onOpenPdfViewer,
  onSyncToDrive,
  isDriveConnected,
}) => {
  if (!isOpen || !letter) return null;

  const isStored = letter.hasPdf && letter.storageStatus === 'Tersimpan';

  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Institutional Letterhead Kop */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#064e3b] to-[#047857] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <InstitutionalLogo size="sm" className="bg-white/10 rounded-full p-0.5" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold block">
                  UNIVERSITAS AL-FITHRAH SURABAYA
                </span>
                <h3 className="text-base font-bold text-white">
                  Lembar Rincian Arsip Surat Digital
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Top Info Banner */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-slate-500 text-[11px] font-medium block">Nomor Resmi Surat:</span>
              <span className="text-base font-bold font-mono text-emerald-900">
                {letter.letterNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-slate-200/80 rounded font-semibold text-slate-700">
                No. Urut #{letter.orderNumber}
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold">
                {letter.category}
              </span>
            </div>
          </div>

          {/* Judul / Nama Surat */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nama Surat / Perihal
            </h4>
            <p className="text-sm font-bold text-slate-900 mt-1 leading-snug">
              {letter.title}
            </p>
          </div>

          {/* Keterangan */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Keterangan Ringkas
            </h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {letter.description || 'Tidak ada keterangan tambahan.'}
            </p>
          </div>

          {/* Data Grid: Tanggal, Unit, Pengirim, Penerima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Tanggal Terbit:</span>
              <span className="font-semibold text-slate-800 font-mono text-xs mt-0.5 block">
                {letter.letterDate}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Bidang / Unit Institusi:</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                {letter.institutionUnit || 'Universitas Al-Fithrah'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Pengirim:</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                {letter.sender || '-'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block font-medium">Penerima / Tujuan:</span>
              <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                {letter.recipient || '-'}
              </span>
            </div>
          </div>

          {/* Lembar Disposisi jika ada */}
          {letter.dispositionStatus && letter.dispositionStatus !== 'Belum Didisposisi' && (
            <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/70">
              <div className="flex items-center gap-1.5 font-bold text-teal-900 mb-1">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Instruksi & Lembar Disposisi Pimpinan</span>
              </div>
              <p className="text-teal-950 font-medium text-xs mt-1">
                Tujuan Disposisi: <strong>{letter.dispositionTo || '-'}</strong>
              </p>
              {letter.dispositionNote && (
                <p className="text-xs text-teal-900 mt-1 italic">
                  "{letter.dispositionNote}"
                </p>
              )}
            </div>
          )}

          {/* Status Penyimpanan & PDF Details */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Status Berkas & Penyimpanan Digital
            </h4>

            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Status Penyimpanan:</span>
              {isStored ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tersimpan di Web / Database Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  <FileX className="w-4 h-4 text-amber-600" />
                  <span>Belum Memiliki Berkas PDF</span>
                </div>
              )}
            </div>

            {/* Google Drive Status */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-600 font-medium">Google Drive:</span>
              {letter.isSyncedToDrive && letter.driveWebViewLink ? (
                <a
                  href={letter.driveWebViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Cloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tersimpan di Drive (Buka Berkas)</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 italic">Belum tersinkron ke Drive</span>
                  {onSyncToDrive && (
                    <button
                      type="button"
                      onClick={() => onSyncToDrive(letter)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Unggah ke Drive Sekarang</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {letter.hasPdf && (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Nama Berkas Asli:</span>
                  <span className="font-mono text-slate-800 font-medium truncate block">
                    {letter.pdfFileName || 'dokumen.pdf'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ukuran File:</span>
                  <span className="font-mono text-slate-800 font-medium block">
                    {formatFileSize(letter.pdfFileSize)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {letter.hasPdf ? (
              <>
                <button
                  onClick={() => onOpenPdfViewer(letter)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Lihat PDF</span>
                </button>

                <a
                  href={getPdfUrl(letter.id, true)}
                  download={letter.pdfFileName || `Surat_${letter.letterNumber}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh PDF</span>
                </a>

                <a
                  href={getPdfUrl(letter.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md bg-white hover:bg-slate-100 transition-colors"
                  title="Buka di Tab Baru"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href={getPdfUrl(letter.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka PDF Resmi</span>
                </a>
                <a
                  href={getPdfUrl(letter.id, true)}
                  download={`Surat_${letter.letterNumber.replace(/\//g, '_')}.pdf`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
