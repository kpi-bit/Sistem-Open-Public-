import React from 'react';
import { FileText, FileCheck, FileQuestion, ArrowRight } from 'lucide-react';

interface StatCardsProps {
  totalLetters: number;
  totalWithPdf: number;
  totalWithoutPdf: number;
  onFilterPdfStatus?: (status: string) => void;
  activeFilter?: string;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalLetters,
  totalWithPdf,
  totalWithoutPdf,
  onFilterPdfStatus,
  activeFilter,
}) => {
  const completionPercentage = totalLetters > 0 ? Math.round((totalWithPdf / totalLetters) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Card 1: Total Surat */}
      <div
        onClick={() => onFilterPdfStatus && onFilterPdfStatus('Semua')}
        className={`group bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer hover:border-emerald-600 ${
          activeFilter === 'Semua' ? 'border-emerald-600 ring-2 ring-emerald-600/10' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Surat
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {totalLetters}
          </span>
          <span className="text-xs text-slate-500 font-medium">dokumen terdata</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Semua arsip Universitas Al-Fithrah</span>
          <span className="text-emerald-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Tampilkan semua <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Card 2: Total PDF Tersimpan */}
      <div
        onClick={() => onFilterPdfStatus && onFilterPdfStatus('Tersimpan')}
        className={`group bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer hover:border-emerald-600 ${
          activeFilter === 'Tersimpan' ? 'border-emerald-600 ring-2 ring-emerald-600/10' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total PDF Tersimpan
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 font-mono tabular-nums">
            {totalWithPdf}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            berkas ({completionPercentage}%)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tersedia online & siap unduh</span>
          <span className="text-emerald-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Filter PDF <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Card 3: Surat yang Belum Memiliki PDF */}
      <div
        onClick={() => onFilterPdfStatus && onFilterPdfStatus('Belum Tersimpan')}
        className={`group bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer hover:border-amber-500 ${
          activeFilter === 'Belum Tersimpan' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Belum Memiliki PDF
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileQuestion className="w-5 h-5 text-amber-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 font-mono tabular-nums">
            {totalWithoutPdf}
          </span>
          <span className="text-xs text-slate-500 font-medium">perlu unggah</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menunggu kelengkapan berkas</span>
          <span className="text-amber-700 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Perlu unggahan <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
