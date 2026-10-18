import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Letter } from '../types/letter';
import { InstitutionalLogo } from './InstitutionalLogo';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: Letter[];
  activeCategoryFilter: string;
  activeStorageFilter: string;
  searchQuery: string;
  onExportExcel: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  letters,
  activeCategoryFilter,
  activeStorageFilter,
  searchQuery,
  onExportExcel,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[94vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Top Control Bar */}
        <div className="px-5 py-3.5 bg-[#064e3b] text-white flex items-center justify-between gap-3 border-b border-emerald-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Ekspor Laporan Rekapitulasi Persuratan
              </h3>
              <p className="text-[11px] text-emerald-200">
                Format resmi cetak & berkas rekapitulasi data arsip KPI Universitas Al-Fithrah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Unduh Berkas Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-950 hover:bg-slate-100 rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors ml-1 cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100/70 flex justify-center text-slate-900 print:p-0 print:bg-white"
        >
          {/* Printable Sheet A4 */}
          <div className="bg-white rounded-sm shadow-md border border-slate-300 w-full max-w-4xl p-8 sm:p-10 font-sans text-xs min-h-[900px] print:shadow-none print:border-none print:p-0">
            {/* 1. KOP SURAT RESMI PRODI KPI */}
            <div className="flex items-center gap-4 pb-3 border-b-2 border-slate-900">
              <InstitutionalLogo size="md" className="w-16 h-16 shrink-0" />
              <div className="text-center flex-1 pr-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wide uppercase text-slate-950 font-sans">
                  UNIVERSITAS AL-FITHRAH (UAF) SURABAYA
                </h2>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                  FAKULTAS TARBIYAH DAN DAKWAH
                </h3>
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-emerald-950 font-sans">
                  PROGRAM STUDI KOMUNIKASI DAN PENYIARAN ISLAM (KPI)
                </h4>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                  Jl. Kedinding Lor No. 30 Surabaya 60129 · Web: www.alfithrah.ac.id · Email: kpi@alfithrah.ac.id
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-slate-900 mt-0.5 mb-6" />

            {/* 2. JUDUL LAPORAN REKAPITULASI */}
            <div className="text-center mb-6">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-950">
                LAPORAN REKAPITULASI AGENDA PERSURATAN RESMI
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Buku Agenda & Pengarsipan Digital Dokumen Surat Masuk / Keluar Prodi KPI
              </p>
            </div>

            {/* 3. METADATA FILTER & PERIODE */}
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500 block">Kategori Filter:</span>
                <span className="font-bold text-slate-800">{activeCategoryFilter}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status Berkas PDF:</span>
                <span className="font-bold text-slate-800">{activeStorageFilter}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Data Terdaftar:</span>
                <span className="font-bold text-emerald-800 font-mono">{letters.length} Dokumen</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Cetak:</span>
                <span className="font-bold text-slate-800 font-mono">{currentDateFormatted}</span>
              </div>
            </div>

            {searchQuery && (
              <div className="mb-4 text-[11px] text-slate-500 italic">
                Kata Kunci Pencarian: &ldquo;{searchQuery}&rdquo;
              </div>
            )}

            {/* 4. TABEL DATA PERSURATAN TERFORMAT */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-2 px-2 border-r border-slate-300 text-center w-10">No</th>
                    <th className="py-2 px-3 border-r border-slate-300 min-w-[140px]">Nomor Surat</th>
                    <th className="py-2 px-3 border-r border-slate-300 min-w-[200px]">Perihal / Nama Surat</th>
                    <th className="py-2 px-3 border-r border-slate-300 min-w-[100px]">Kategori</th>
                    <th className="py-2 px-2.5 border-r border-slate-300 text-center w-24">Tanggal</th>
                    <th className="py-2 px-3 border-r border-slate-300 min-w-[130px]">Tujuan / Pemohon</th>
                    <th className="py-2 px-2 border-slate-300 text-center w-20">Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {letters.map((l, index) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 text-center font-mono border-r border-slate-200">
                        {index + 1}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900 border-r border-slate-200">
                        {l.letterNumber}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 leading-snug">
                        <div className="font-semibold text-slate-900">{l.title}</div>
                        {l.description && (
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {l.description}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                        {l.category}
                      </td>
                      <td className="py-2 px-2.5 text-center font-mono border-r border-slate-200 text-slate-600">
                        {l.letterDate}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-slate-700">
                        <div className="font-medium">{l.recipient || l.sender || '-'}</div>
                        {(l.studentName || l.studentNim) && (
                          <div className="text-[10px] text-emerald-800 font-mono">
                            {l.studentName} ({l.studentNim})
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center border-slate-200">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            l.hasPdf
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.hasPdf ? 'Ada PDF' : 'Tanpa PDF'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. LEMBAR PENGESAHAN & TANDA TANGAN */}
            <div className="mt-10 flex justify-end">
              <div className="w-64 text-left font-sans text-xs">
                <p>Surabaya, {currentDateFormatted}</p>
                <p className="mt-0.5">Mengetahui,</p>
                <p className="font-semibold text-slate-900 leading-snug">
                  Kaprodi Komunikasi dan Penyiaran Islam
                </p>

                {/* Stempel & Signature */}
                <div className="relative my-2 h-16 flex items-center justify-start">
                  <div className="absolute left-0 w-14 h-14 opacity-80 pointer-events-none">
                    <InstitutionalLogo size="sm" className="w-14 h-14" />
                  </div>
                  <div className="ml-10 font-serif italic text-slate-800 text-base select-none">
                    M. Munir
                  </div>
                </div>

                <p className="font-bold underline text-slate-950 text-xs mt-1">
                  Muhammad Munir, M.Sos.
                </p>
                <p className="font-mono text-[10px] text-slate-700">
                  NIDN. 2126059505
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-500">
            Laporan ini dibuat secara otomatis dari basis data Sistem Informasi Persuratan Digital Universitas Al-Fithrah Surabaya.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
