import React, { useState } from 'react';
import {
  FileText,
  Layers,
  CheckCircle2,
  Download,
  Search,
  Filter,
  FileCheck2,
  Building2,
  GraduationCap,
  Sparkles,
  Tv,
  Clock,
  BookOpen
} from 'lucide-react';
import { UserSession } from '../types/letter';

interface SopDashboardProps {
  userSession: UserSession;
}

interface SopItem {
  id: string;
  code: string;
  title: string;
  category: 'Akademik & Perkuliahan' | 'Magang & Kemitraan' | 'Skripsi & Munaqasyah' | 'Lab & Studio' | 'Layanan Mahasiswa';
  dateApproved: string;
  executor: string;
  version: string;
  fileSize: string;
}

const DUMMY_SOPS: SopItem[] = [
  {
    id: 'sop-01',
    code: 'SOP/KPI-UAF/AKD/01',
    title: 'SOP Permohonan dan Pelaksanaan Praktek Kerja Lapangan / Magang (PKM)',
    category: 'Magang & Kemitraan',
    dateApproved: '10 Januari 2026',
    executor: 'Koordinator Magang & TU KPI',
    version: 'Rev. 02',
    fileSize: '380 KB',
  },
  {
    id: 'sop-02',
    code: 'SOP/KPI-UAF/AKD/02',
    title: 'SOP Pengajuan Izin Penelitian dan Observasi Skripsi Lapangan',
    category: 'Skripsi & Munaqasyah',
    dateApproved: '12 Januari 2026',
    executor: 'Ketua Prodi KPI & Pembimbing',
    version: 'Rev. 01',
    fileSize: '410 KB',
  },
  {
    id: 'sop-03',
    code: 'SOP/KPI-UAF/AKD/03',
    title: 'SOP Peminjaman dan Penggunaan Studio Podcast & Radio Streaming KPI',
    category: 'Lab & Studio',
    dateApproved: '18 Januari 2026',
    executor: 'Laboran & Kepala Studio UAF',
    version: 'Rev. 02',
    fileSize: '320 KB',
  },
  {
    id: 'sop-04',
    code: 'SOP/KPI-UAF/AKD/04',
    title: 'SOP Pelaksanaan Ujian Proposal dan Munaqasyah Skripsi Sarjana',
    category: 'Skripsi & Munaqasyah',
    dateApproved: '20 Januari 2026',
    executor: 'Panitia Munaqasyah Fakultas',
    version: 'Rev. 03',
    fileSize: '540 KB',
  },
  {
    id: 'sop-05',
    code: 'SOP/KPI-UAF/AKD/05',
    title: 'SOP Penerbitan Surat Keterangan Aktif Kuliah dan Dispensasi Mahasiswa',
    category: 'Layanan Mahasiswa',
    dateApproved: '25 Januari 2026',
    executor: 'Tata Usaha Persuratan Digital',
    version: 'Rev. 02',
    fileSize: '290 KB',
  },
  {
    id: 'sop-06',
    code: 'SOP/KPI-UAF/AKD/06',
    title: 'SOP Verifikasi dan Pengesahan Rencana Pembelajaran Semester (RPS)',
    category: 'Akademik & Perkuliahan',
    dateApproved: '05 Februari 2026',
    executor: 'Gugus Jaminan Mutu (GJM) Prodi',
    version: 'Rev. 01',
    fileSize: '360 KB',
  },
];

export const SopDashboard: React.FC<SopDashboardProps> = ({ userSession }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredSops = DUMMY_SOPS.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.executor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-[#064e3b] to-emerald-950 text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
            <Layers className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                Standar Operasional Prosedur
              </span>
              <span className="text-xs text-amber-300">·</span>
              <span className="text-xs text-emerald-200 font-mono font-bold">
                Tata Kelola Prodi KPI
              </span>
              <span className="text-xs text-emerald-300">·</span>
              <span className="text-xs text-emerald-100 font-medium">
                Berlaku TA 2026/2027
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Pusat Dokumen SOP & Prosedur Baku Mutu Akademik
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
              Panduan operasional baku bagi mahasiswa, dosen, dan staf untuk memastikan seluruh layanan akademik, praktikum studio penyiaran, serta permohonan surat berjalan tertib, cepat, dan transparan.
            </p>
          </div>
        </div>
      </div>

      {/* 1. TOP 6 METRIC STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#28a745] text-white p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">42</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">Total SOP Terbit</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><Layers className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-emerald-100">Baku Mutu Pelayanan Prodi KPI</div>
        </div>

        <div className="rounded-xl shadow-xs overflow-hidden bg-[#17a2b8] text-white p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">14</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">SOP Akademik & Kuliah</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><BookOpen className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-cyan-100">Registrasi, RPS, dan Perkuliahan</div>
        </div>

        <div className="rounded-xl shadow-xs overflow-hidden bg-[#ffc107] text-slate-900 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">8</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">SOP Magang / PKM</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><Tv className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-slate-800">Kemitraan Radio, TV, & Media Massa</div>
        </div>

        <div className="rounded-xl shadow-xs overflow-hidden bg-[#1e7e34] text-white p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">10</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">SOP Skripsi & Munaqasyah</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><GraduationCap className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-emerald-100">Bimbingan, Seminar, Ujian Akhir</div>
        </div>

        <div className="rounded-xl shadow-xs overflow-hidden bg-[#117a8b] text-white p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">6</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">SOP Studio Siaran & Lab</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><Building2 className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-teal-100">Laboratorium Siaran & Komputer</div>
        </div>

        <div className="rounded-xl shadow-xs overflow-hidden bg-[#d39e00] text-slate-900 p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">16</span>
              <p className="text-xs sm:text-sm font-semibold mt-1">SK & Pedoman Resmi</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg"><FileCheck2 className="w-8 h-8 opacity-80" /></div>
          </div>
          <div className="pt-2 text-[11px] font-medium text-slate-900">Keputusan Pimpinan Universitas & Fakultas</div>
        </div>
      </div>

      {/* 2. TABEL DAFTAR SOP RESMI */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#fcfbf7] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>Daftar Dokumen SOP Resmi Prodi KPI ({filteredSops.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prosedur operasional baku lengkap dengan penanggung jawab pelaksana dan versi revisi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul SOP atau kode..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-medium"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Magang & Kemitraan">Magang & Kemitraan</option>
              <option value="Skripsi & Munaqasyah">Skripsi & Munaqasyah</option>
              <option value="Lab & Studio">Lab & Studio</option>
              <option value="Layanan Mahasiswa">Layanan Mahasiswa</option>
              <option value="Akademik & Perkuliahan">Akademik & Perkuliahan</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nomor & Kode SOP</th>
                <th className="py-3 px-4">Nama Prosedur Baku</th>
                <th className="py-3 px-4">Kategori & Revisi</th>
                <th className="py-3 px-4">Pelaksana / Penanggung Jawab</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-28">Berkas PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSops.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada SOP yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSops.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">{item.code}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[11px] text-slate-500 block">Ditetapkan: {item.dateApproved}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold block w-fit mb-0.5">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold">{item.version}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{item.executor}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Berlaku</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => alert(`Mengunduh dokumen ${item.title} (${item.fileSize})`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                        title="Unduh Salinan Dokumen SOP Resmi"
                      >
                        <Download className="w-3 h-3" />
                        <span>{item.fileSize}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
