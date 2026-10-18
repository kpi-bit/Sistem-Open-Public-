import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  FileX,
  Eye,
  Download,
  ExternalLink,
  Edit2,
  Trash2,
  Info,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  Send,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Printer,
  Cloud
} from 'lucide-react';
import { Letter, UserSession } from '../types/letter';
import { getPdfUrl } from '../services/api';
import { ExportReportModal } from './ExportReportModal';

interface LetterTableSectionProps {
  letters: Letter[];
  isLoading: boolean;
  onOpenAddModal: () => void;
  onOpenEditModal: (letter: Letter) => void;
  onOpenDetailModal: (letter: Letter) => void;
  onOpenDeleteModal: (letter: Letter) => void;
  onOpenPdfViewer: (letter: Letter) => void;
  onOpenDispositionModal: (letter: Letter) => void;
  userSession: UserSession;
  activeCategoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  activeStorageFilter: string;
  onStorageFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  isDriveConnected?: boolean;
  onSyncToDrive?: (letter: Letter) => void;
}

export const LetterTableSection: React.FC<LetterTableSectionProps> = ({
  letters,
  isLoading,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onOpenDeleteModal,
  onOpenPdfViewer,
  onOpenDispositionModal,
  userSession,
  activeCategoryFilter,
  onCategoryFilterChange,
  activeStorageFilter,
  onStorageFilterChange,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  isDriveConnected = false,
  onSyncToDrive,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Export current filtered list to Excel / CSV format
  const handleExportCsv = () => {
    const headers = [
      'No',
      'Nomor Surat Resmi',
      'Perihal / Judul Surat',
      'Kategori',
      'Tanggal Surat',
      'Tujuan / Instansi',
      'Nama Pemohon',
      'NIM / NIDN',
      'Status Berkas PDF',
      'Status Disposisi',
      'Keterangan',
    ];

    const rows = letters.map((l, index) => [
      index + 1,
      `"${(l.letterNumber || '').replace(/"/g, '""')}"`,
      `"${(l.title || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.letterDate || '').replace(/"/g, '""')}"`,
      `"${(l.recipient || l.sender || '').replace(/"/g, '""')}"`,
      `"${(l.studentName || l.lecturerName || l.creator || '').replace(/"/g, '""')}"`,
      `"${(l.studentNim || l.lecturerNidn || l.creatorIdentifier || '').replace(/"/g, '""')}"`,
      `"${l.hasPdf ? 'Tersimpan (Ada PDF)' : 'Belum Tersimpan'}"`,
      `"${(l.dispositionStatus || '-').replace(/"/g, '""')}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Microsoft Excel compatibility
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const filterSuffix = activeCategoryFilter !== 'Semua' ? `_${activeCategoryFilter.replace(/[\s/]+/g, '_')}` : '';
    link.setAttribute('download', `rekap_persuratan_kpi_iaf_${new Date().toISOString().split('T')[0]}${filterSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculation
  const totalItems = letters.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentLetters = letters.slice(startIndex, endIndex);

  const categories = [
    'Semua',
    'Surat Masuk',
    'Surat Keluar',
    'Surat Keputusan',
    'Surat Edaran',
    'Nota Dinas',
    'Surat Tugas',
  ];

  const storageOptions = [
    { label: 'Semua Status PDF', value: 'Semua' },
    { label: 'Tersimpan (Memiliki PDF)', value: 'Tersimpan' },
    { label: 'Belum Tersimpan (Tanpa PDF)', value: 'Belum Tersimpan' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Tabel Data Persuratan Resmi Universitas Al-Fithrah</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola, cari, dan pantau arsip digital surat Program Studi Komunikasi dan Penyiaran Islam Universitas Al-Fithrah Surabaya.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export Summary Report Buttons (PDF & Excel) */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
              title="Buka pratinjau dan cetak laporan rekapitulasi surat resmi"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak / Laporan PDF</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-300 transition-colors cursor-pointer"
              title="Unduh seluruh data terfilter dalam format berkas Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Excel ({letters.length})</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Tambah Surat Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-3 border-t border-slate-200">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchQueryChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nomor surat, perihal, atau keterangan..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={activeCategoryFilter}
              onChange={(e) => {
                onCategoryFilterChange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Kategori: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={activeStorageFilter}
              onChange={(e) => {
                onStorageFilterChange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              {storageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => {
                onSortByChange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 text-slate-700 font-medium"
            >
              <option value="orderNumberAsc">Nomor Urut (1 → N)</option>
              <option value="orderNumberDesc">Nomor Urut (N → 1)</option>
              <option value="letterNumberAsc">Nomor Surat (A-Z)</option>
              <option value="titleAsc">Perihal / Judul (A-Z)</option>
              <option value="dateDesc">Tanggal Terbit Terbaru</option>
              <option value="dateAsc">Tanggal Terbit Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold tracking-wider">
              {/* Kolom 1: Nomor */}
              <th className="py-3 px-3 w-14 text-center">No</th>
              {/* Kolom 2: Nomor Surat */}
              <th className="py-3 px-4 min-w-[170px]">Nomor Surat</th>
              {/* Kolom 3: Nama Surat */}
              <th className="py-3 px-4 min-w-[260px]">Nama Surat</th>
              {/* Kolom 4: Keterangan */}
              <th className="py-3 px-4 min-w-[220px]">Keterangan</th>
              {/* Kolom 5: Tersimpan di Web */}
              <th className="py-3 px-3.5 text-center min-w-[130px]">Tersimpan di Web</th>
              {/* Kolom 6: PDF */}
              <th className="py-3 px-4 text-center min-w-[140px]">PDF</th>
              {/* Kolom 7: Aksi */}
              <th className="py-3 px-4 text-center min-w-[160px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Memuat data persuratan...</span>
                  </div>
                </td>
              </tr>
            ) : currentLetters.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                      <FileX className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-700">Tidak ada surat ditemukan</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Tidak ada dokumen yang sesuai dengan pencarian atau filter yang dipilih.
                    </p>
                    <button
                      onClick={onOpenAddModal}
                      className="mt-4 px-3 py-1.5 bg-emerald-700 text-white rounded-md text-xs font-medium hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      + Tambah Dokumen Surat
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              currentLetters.map((letter, idx) => {
                const autoNumber = startIndex + idx + 1;
                const isStored = letter.hasPdf && letter.storageStatus === 'Tersimpan';

                return (
                  <tr
                    key={letter.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. Nomor Urut Otomatis */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-500 tabular-nums">
                      {autoNumber}
                    </td>

                    {/* 2. Nomor Surat Resmi */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {letter.letterNumber}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                          <span className="inline-block px-1.5 py-0.2 bg-slate-100 rounded text-slate-600 font-medium">
                            {letter.category}
                          </span>
                          <span>·</span>
                          <span className="font-mono">{letter.letterDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Nama Surat */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {letter.title}
                      </div>
                      {letter.institutionUnit && (
                        <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Unit: {letter.institutionUnit}
                        </div>
                      )}
                    </td>

                    {/* 4. Keterangan */}
                    <td className="py-3 px-4">
                      <p className="text-slate-600 leading-relaxed line-clamp-2" title={letter.description}>
                        {letter.description || '-'}
                      </p>
                      {letter.dispositionStatus && letter.dispositionStatus !== 'Belum Didisposisi' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded mt-1 border border-teal-200">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Disposisi: {letter.dispositionTo || 'Terkirim'}</span>
                        </span>
                      )}
                    </td>

                    {/* 5. Tersimpan di Database & Google Drive */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {isStored ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <FileCheck className="w-3 h-3 text-emerald-600" />
                            <span>Server: Tersimpan</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <FileX className="w-3 h-3 text-amber-600" />
                            <span>Belum Tersimpan</span>
                          </div>
                        )}

                        {/* Google Drive Sync Indicator */}
                        {letter.isSyncedToDrive && letter.driveWebViewLink ? (
                          <a
                            href={letter.driveWebViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka berkas surat di Google Drive"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <Cloud className="w-3 h-3 text-blue-600" />
                            <span>Drive: Tersimpan</span>
                            <ExternalLink className="w-2.5 h-2.5 text-blue-500" />
                          </a>
                        ) : onSyncToDrive ? (
                          <button
                            onClick={() => onSyncToDrive(letter)}
                            title="Unggah berkas surat ini langsung ke Google Drive"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-800 border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
                          >
                            <Cloud className="w-3 h-3 text-blue-500" />
                            <span>+ Sync Drive</span>
                          </button>
                        ) : null}
                      </div>
                    </td>

                    {/* 6. PDF: Tombol Lihat, Buka, Unduh */}
                    <td className="py-3 px-4 text-center">
                      {letter.hasPdf ? (
                        <div className="inline-flex items-center gap-1">
                          {/* Tombol Lihat PDF (Modal in-app) */}
                          <button
                            onClick={() => onOpenPdfViewer(letter)}
                            title="Lihat Pratinjau PDF"
                            className="p-1.5 rounded-md text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Tombol Buka Tab Baru */}
                          <a
                            href={getPdfUrl(letter.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka Berkas PDF di Tab Baru"
                            className="p-1.5 rounded-md text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Tombol Unduh PDF */}
                          <a
                            href={getPdfUrl(letter.id, true)}
                            download={letter.pdfFileName || `Surat_${letter.letterNumber}.pdf`}
                            title="Unduh Berkas PDF Resmi"
                            className="p-1.5 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <a
                            href={getPdfUrl(letter.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Buka / Cetak PDF Resmi Otomatis"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-emerald-700" />
                            <span>PDF Resmi</span>
                          </a>
                          <a
                            href={getPdfUrl(letter.id, true)}
                            download={`Surat_${letter.letterNumber.replace(/\//g, '_')}.pdf`}
                            title="Unduh Berkas PDF Resmi"
                            className="p-1.5 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </td>

                    {/* 7. Aksi: Edit, Hapus, Detail */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        {/* Tombol Detail */}
                        <button
                          onClick={() => onOpenDetailModal(letter)}
                          title="Lihat Detail Lengkap Dokumen"
                          className="px-2 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Detail
                        </button>

                        {/* Tombol Disposisi */}
                        <button
                          onClick={() => onOpenDispositionModal(letter)}
                          title="Form Lembar Disposisi"
                          className="px-2 py-1 text-teal-800 bg-teal-50 hover:bg-teal-100 rounded text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Disposisi
                        </button>

                        {/* Tombol Edit */}
                        <button
                          onClick={() => onOpenEditModal(letter)}
                          title="Ubah Data Surat"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => onOpenDeleteModal(letter)}
                          title="Hapus Surat"
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Tampilkan per halaman:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-500 ml-2">
            Menampilkan <strong className="font-mono text-slate-800">{totalItems > 0 ? startIndex + 1 : 0}</strong> - <strong className="font-mono text-slate-800">{endIndex}</strong> dari <strong className="font-mono text-slate-800">{totalItems}</strong> surat
          </span>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-slate-800 font-mono">
            Hal {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export Report Preview & Print Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        letters={letters}
        activeCategoryFilter={activeCategoryFilter}
        activeStorageFilter={activeStorageFilter}
        searchQuery={searchQuery}
        onExportExcel={handleExportCsv}
      />
    </div>
  );
};
