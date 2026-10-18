import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  ArrowRightCircle,
  Clock,
  Sparkles,
  BookCheck,
  Building2,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import { UserSession } from '../types/letter';

interface SpmiDashboardProps {
  userSession: UserSession;
  onNavigateModule?: (module: string) => void;
}

interface SpmiDocument {
  id: string;
  code: string;
  title: string;
  category: 'Standar Mutu' | 'Manual Mutu' | 'Kebijakan SPMI' | 'Formulir Evaluasi' | 'Laporan AMI';
  cycle: string;
  status: 'Berlaku' | 'Dalam Review' | 'Terverifikasi';
  dateApproved: string;
  pic: string;
  fileSize: string;
}

const DUMMY_SPMI_DOCS: SpmiDocument[] = [
  {
    id: 'spmi-01',
    code: 'STD/SPMI-UAF/KPI/01',
    title: 'Standar Kompetensi Lulusan (CPL) Program Studi Komunikasi dan Penyiaran Islam',
    category: 'Standar Mutu',
    cycle: 'Siklus 2026/2027',
    status: 'Berlaku',
    dateApproved: '15 Januari 2026',
    pic: 'Kaprodi KPI & GJM Fakultas',
    fileSize: '420 KB',
  },
  {
    id: 'spmi-02',
    code: 'STD/SPMI-UAF/KPI/02',
    title: 'Standar Isi dan Perangkat Pembelajaran (RPS & Modul Praktikum Penyiaran)',
    category: 'Standar Mutu',
    cycle: 'Siklus 2026/2027',
    status: 'Berlaku',
    dateApproved: '20 Januari 2026',
    pic: 'Unit Penjaminan Mutu Prodi',
    fileSize: '512 KB',
  },
  {
    id: 'spmi-03',
    code: 'MAN/SPMI-UAF/KPI/01',
    title: 'Manual Pelaksanaan Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (PPEPP)',
    category: 'Manual Mutu',
    cycle: 'Siklus 2025/2026',
    status: 'Terverifikasi',
    dateApproved: '10 Desember 2025',
    pic: 'Lembaga Penjaminan Mutu (LPM) UAF',
    fileSize: '680 KB',
  },
  {
    id: 'spmi-04',
    code: 'AMI/SPMI-UAF/KPI/2026',
    title: 'Laporan Hasil Audit Mutu Internal (AMI) Semester Ganjil TA 2025/2026 Prodi KPI',
    category: 'Laporan AMI',
    cycle: 'Siklus 2025/2026',
    status: 'Terverifikasi',
    dateApproved: '05 Februari 2026',
    pic: 'Auditor Internal LPM UAF',
    fileSize: '1.2 MB',
  },
  {
    id: 'spmi-05',
    code: 'KBJ/SPMI-UAF/03',
    title: 'Kebijakan Pengelolaan Praktik Magang Media dan Integrasi Siaran Dakwah Multplatform',
    category: 'Kebijakan SPMI',
    cycle: 'Siklus 2026/2027',
    status: 'Berlaku',
    dateApproved: '02 Februari 2026',
    pic: 'Dekanat Tarbiyah dan Dakwah',
    fileSize: '345 KB',
  },
  {
    id: 'spmi-06',
    code: 'FRM/SPMI-UAF/KPI/09',
    title: 'Formulir Kuisioner Indeks Kepuasan Mahasiswa terhadap Proses Belajar Mengajar',
    category: 'Formulir Evaluasi',
    cycle: 'Siklus 2026/2027',
    status: 'Berlaku',
    dateApproved: '12 Februari 2026',
    pic: 'Gugus Jaminan Mutu (GJM)',
    fileSize: '290 KB',
  },
];

const CIRCUMFERENCE = 2 * Math.PI * 36;

export const SpmiDashboard: React.FC<SpmiDashboardProps> = ({ userSession, onNavigateModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const filteredDocs = DUMMY_SPMI_DOCS.filter((doc) => {
    const matchSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.pic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || doc.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // Pie chart data: Capaian Standar SPMI KPI
  const pieData = [
    { label: 'Standar Pendidikan', value: 92, color: '#10b981' },
    { label: 'Standar Penelitian', value: 88, color: '#3b82f6' },
    { label: 'Standar Pengabdian (PkM)', value: 90, color: '#f59e0b' },
    { label: 'Standar Tata Kelola & SDM', value: 95, color: '#8b5cf6' },
  ];
  const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0);

  let accumulated = 0;
  const pieSlices = pieData.map((item) => {
    const fraction = item.value / totalPie;
    const length = fraction * CIRCUMFERENCE;
    const slice = { ...item, length, offset: -accumulated };
    accumulated += length;
    return slice;
  });

  return (
    <div className="space-y-6">
      {/* Top Announcement Banner: SPMI Institutional Nuance */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-[#064e3b] to-teal-950 text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-emerald-950">
                Sistem Penjaminan Mutu Internal
              </span>
              <span className="text-xs text-amber-300">·</span>
              <span className="text-xs text-emerald-200 font-mono font-bold">
                Akreditasi BAN-PT / LAMDIK
              </span>
              <span className="text-xs text-emerald-300">·</span>
              <span className="text-xs text-emerald-100 font-medium">
                Siklus PPEPP 2026/2027
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Manajemen SPMI & Akreditasi Prodi Komunikasi dan Penyiaran Islam
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
              Monitoring mutu akademik berkelanjutan berpedoman pada SN-Dikti dan Standar Mutu Universitas Al-Fithrah. Meliputi siklus Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (PPEPP) secara terstruktur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Status Prodi</span>
            <span className="text-sm font-black font-mono text-white">TERAKREDITASI B (MENUJU UNGGUL)</span>
          </div>
        </div>
      </div>

      {/* 1. TOP 6 METRIC STAT CARDS (Classic AdminLTE/KPI Style: Green, Cyan, Yellow, Emerald, Teal, Gold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Green */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#28a745] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  24
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  SN-Dikti
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Standar Mutu SPMI</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <Award className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Pendidikan, Penelitian, PkM</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
          </div>
        </div>

        {/* Card 2: Cyan */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#17a2b8] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  18
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  Aktif
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Dokumen Kebijakan & Manual</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Buku Kebijakan, Manual & Standar</span>
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-200" />
          </div>
        </div>

        {/* Card 3: Yellow / Amber */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#ffc107] text-slate-900 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  100%
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider text-slate-900">
                  Selesai
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Audit Mutu Internal (AMI)</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <BookCheck className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Siklus Semester Ganjil 2025/2026</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" />
          </div>
        </div>

        {/* Card 4: Dark Green */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#1e7e34] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  2
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  RTL Berjalan
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Temuan Minor & Tindak Lanjut</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <AlertCircle className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>0 Temuan Major · 2 Temuan Observasi</span>
            <Clock className="w-3.5 h-3.5 text-emerald-200" />
          </div>
        </div>

        {/* Card 5: Teal */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#117a8b] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  36
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  Valid
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">SOP SPMI & Tata Pamong</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <Layers className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Prosedur Baku Akademik & Non-Akademik</span>
            <Check className="w-3.5 h-3.5 text-teal-200" />
          </div>
        </div>

        {/* Card 6: Gold / Orange */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#d39e00] text-slate-900 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  3.84
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider text-slate-900">
                  Skala 4.0
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Indeks Kepuasan Mahasiswa & Dosen</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Kategori: Sangat Baik (A)</span>
            <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          </div>
        </div>
      </div>

      {/* 2. SIKLUS PPEPP & GRAFIK MUTU AKADEMIK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Capaian Standar SPMI */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-700" />
                <span>Distribusi Skor Ketercapaian Standar SPMI KPI</span>
              </h3>
              <span className="text-xs text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Rata-rata: 91.25%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                  />
                  {pieSlices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="14"
                      strokeDasharray={`${slice.length} ${CIRCUMFERENCE}`}
                      strokeDashoffset={slice.offset}
                      className="transition-all duration-300"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    91.3%
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    Capaian Mutu
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.label}:</span>
                    <span className="font-mono font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sumber: Rekapitulasi Audit Mutu Internal (AMI) 2026</span>
            <span className="text-emerald-700 font-bold">Status: Memenuhi Syarat Unggul</span>
          </div>
        </div>

        {/* Siklus PPEPP Card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-800" />
                <span>Tahapan Siklus Mutu PPEPP Prodi KPI</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Siklus Berkelanjutan
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  code: 'P',
                  title: 'Penetapan Standar',
                  desc: 'Penyusunan 24 Standar Mutu berbasis CPL & Visi Keilmuan KPI',
                  status: '100% Selesai',
                  bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
                  badge: 'bg-emerald-700 text-white',
                },
                {
                  code: 'P',
                  title: 'Pelaksanaan Standar',
                  desc: 'Penerapan RPS, praktikum media siaran, dan tata kelola administrasi',
                  status: 'Sedang Berjalan',
                  bg: 'bg-blue-50 text-blue-900 border-blue-200',
                  badge: 'bg-blue-700 text-white',
                },
                {
                  code: 'E',
                  title: 'Evaluasi Pelaksanaan',
                  desc: 'Audit Mutu Internal (AMI) berkala dan survei kepuasan mahasiswa',
                  status: 'Terjadwal Rutin',
                  bg: 'bg-amber-50 text-amber-900 border-amber-200',
                  badge: 'bg-amber-600 text-white',
                },
                {
                  code: 'P',
                  title: 'Pengendalian Pelaksanaan',
                  desc: 'Rencana Tindak Lanjut (RTL) temuan AMI dan koreksi perkuliahan',
                  status: 'Terkendali',
                  bg: 'bg-purple-50 text-purple-900 border-purple-200',
                  badge: 'bg-purple-700 text-white',
                },
                {
                  code: 'P',
                  title: 'Peningkatan Standar',
                  desc: 'Benchmarking kurikulum penyiaran dan penyesuaian regulasi baru',
                  status: 'Fase Peningkatan',
                  bg: 'bg-teal-50 text-teal-900 border-teal-200',
                  badge: 'bg-teal-700 text-white',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${step.bg}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-md font-mono font-black text-xs flex items-center justify-center shrink-0 ${step.badge}`}>
                      {step.code}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs leading-tight">{step.title}</h4>
                      <p className="text-[11px] opacity-85 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border shrink-0">
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABEL DOKUMEN MUTU & ARSIP SPMI */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#fcfbf7] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-800" />
              <span>Arsip Dokumen Standar & Manual SPMI Prodi KPI ({filteredDocs.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumen resmi SPMI, standar capaian pembelajaran, instrumen akreditasi, dan bukti fisik evaluasi mutu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode atau dokumen..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-medium"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Standar Mutu">Standar Mutu</option>
              <option value="Manual Mutu">Manual Mutu</option>
              <option value="Kebijakan SPMI">Kebijakan SPMI</option>
              <option value="Laporan AMI">Laporan AMI</option>
              <option value="Formulir Evaluasi">Formulir Evaluasi</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode Dokumen</th>
                <th className="py-3 px-4">Nama Dokumen Mutu</th>
                <th className="py-3 px-4">Kategori & Siklus</th>
                <th className="py-3 px-4">Penanggung Jawab (PIC)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center w-28">Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada dokumen mutu yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">{doc.code}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500 block">Disahkan: {doc.dateApproved}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold block w-fit mb-0.5">
                        {doc.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{doc.cycle}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{doc.pic}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{doc.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => alert(`Mengunduh berkas ${doc.title} (${doc.fileSize})`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md font-bold text-[11px] transition-colors cursor-pointer"
                        title="Unduh Salinan Dokumen SPMI"
                      >
                        <Download className="w-3 h-3" />
                        <span>{doc.fileSize}</span>
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
