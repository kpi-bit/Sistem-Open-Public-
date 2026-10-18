import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  Tv,
  Radio,
  Video,
  Mic,
  Calendar,
  Clock,
  Compass
} from 'lucide-react';
import { UserSession } from '../types/letter';

interface KurikulumDashboardProps {
  userSession: UserSession;
  onNavigateModule?: (module: string) => void;
}

interface CourseItem {
  id: string;
  code: string;
  name: string;
  sks: number;
  semester: number;
  category: 'MK Keahlian KPI' | 'MK Fakultas' | 'MK Universitas' | 'MK Pilihan Penyiaran';
  type: 'Teori' | 'Praktikum Studio' | 'Teori & Praktik';
  lecturer: string;
  rpsStatus: 'Lengkap (RPS Terverifikasi)' | 'Revisi RPS';
}

const DUMMY_COURSES: CourseItem[] = [
  {
    id: 'kpi-01',
    code: 'KPI-101',
    name: 'Pengantar Ilmu Komunikasi & Penyiaran Islam',
    sks: 3,
    semester: 1,
    category: 'MK Keahlian KPI',
    type: 'Teori',
    lecturer: 'Muhammad Munir, M.Sos.',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-02',
    code: 'KPI-204',
    name: 'Teknik Produksi Siaran Radio & Podcast Dakwah',
    sks: 3,
    semester: 3,
    category: 'MK Keahlian KPI',
    type: 'Praktikum Studio',
    lecturer: 'Muhammad Munir, M.Sos. & Tim Lab',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-03',
    code: 'KPI-308',
    name: 'Jurnalistik Televisi & Penulisan Naskah Siaran',
    sks: 3,
    semester: 4,
    category: 'MK Keahlian KPI',
    type: 'Praktikum Studio',
    lecturer: 'Dr. Fathur Rohman, M.Si.',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-04',
    code: 'KPI-412',
    name: 'Komunikasi Antarbudaya & Retorika Dakwah Multikultural',
    sks: 2,
    semester: 4,
    category: 'MK Keahlian KPI',
    type: 'Teori',
    lecturer: 'Dr. Fathur Rohman, M.Si.',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-05',
    code: 'KPI-515',
    name: 'Praktek Kerja Lapangan (PKM) / Magang Media Massa',
    sks: 4,
    semester: 6,
    category: 'MK Keahlian KPI',
    type: 'Praktikum Studio',
    lecturer: 'DPL Magang KPI',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-06',
    code: 'KPI-601',
    name: 'Manajemen Penyiaran Radio & TV Komersial / Dakwah',
    sks: 3,
    semester: 5,
    category: 'MK Keahlian KPI',
    type: 'Teori & Praktik',
    lecturer: 'Muhammad Munir, M.Sos.',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-07',
    code: 'KPI-608',
    name: 'Sinematografi & Produksi Konten Dakwah Digital',
    sks: 3,
    semester: 5,
    category: 'MK Pilihan Penyiaran',
    type: 'Praktikum Studio',
    lecturer: 'Praktisi Media TV / Tamu',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
  {
    id: 'kpi-08',
    code: 'UAF-001',
    name: 'Keahswajaan & Nilai-Nilai Al-Fithrah',
    sks: 2,
    semester: 1,
    category: 'MK Universitas',
    type: 'Teori',
    lecturer: 'Tim Dosen Aswaja UAF',
    rpsStatus: 'Lengkap (RPS Terverifikasi)',
  },
];

const CIRCUMFERENCE = 2 * Math.PI * 36;

export const KurikulumDashboard: React.FC<KurikulumDashboardProps> = ({ userSession }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredCourses = DUMMY_COURSES.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSem = selectedSemester === 'Semua' || String(c.semester) === selectedSemester;
    const matchCat = selectedCategory === 'Semua' || c.category === selectedCategory;
    return matchSearch && matchSem && matchCat;
  });

  // Pie chart data: Sebaran Kelompok Mata Kuliah
  const pieData = [
    { label: 'MK Keahlian Inti KPI', value: 84, color: '#10b981' },
    { label: 'MK Fakultas Tarbiyah & Dakwah', value: 24, color: '#3b82f6' },
    { label: 'MK Pilihan Broadcasting & Media', value: 18, color: '#f59e0b' },
    { label: 'MK Wajib Universitas Al-Fithrah', value: 18, color: '#8b5cf6' },
  ];
  const totalSks = 144;

  let accumulated = 0;
  const pieSlices = pieData.map((item) => {
    const fraction = item.value / totalSks;
    const length = fraction * CIRCUMFERENCE;
    const slice = { ...item, length, offset: -accumulated };
    accumulated += length;
    return slice;
  });

  // SKS distribution per semester
  const semesterDistribution = [
    { sem: 'Sem 1', sks: 20 },
    { sem: 'Sem 2', sks: 20 },
    { sem: 'Sem 3', sks: 21 },
    { sem: 'Sem 4', sks: 21 },
    { sem: 'Sem 5', sks: 20 },
    { sem: 'Sem 6', sks: 20 },
    { sem: 'Sem 7', sks: 16 },
    { sem: 'Sem 8', sks: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Announcement Banner: Kurikulum OBE Nuance */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0f4c81] via-[#1e3a5f] to-[#0d3b66] text-white shadow-md border-l-4 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                Kurikulum OBE & MBKM
              </span>
              <span className="text-xs text-amber-300">·</span>
              <span className="text-xs text-sky-200 font-mono font-bold">
                Total 144 SKS Kelulusan
              </span>
              <span className="text-xs text-sky-300">·</span>
              <span className="text-xs text-sky-100 font-medium">
                Sarjana Sosial (S.Sos.)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              Struktur Kurikulum Program Studi Komunikasi dan Penyiaran Islam
            </h2>
            <p className="text-xs text-sky-100/90 mt-1 max-w-3xl leading-relaxed">
              Kurikulum dirancang untuk mencetak lulusan berakhlak mulia dengan keahlian broadcasting televisi, radio dakwah, jurnalisme multimedia, dan public relations berbasis riset serta nilai-nilai keislaman Assalafi Al-Fithrah.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Gelar Lulusan</span>
            <span className="text-sm font-black font-mono text-white">S.Sos. (KPI)</span>
          </div>
        </div>
      </div>

      {/* 1. TOP 6 METRIC STAT CARDS (Classic Style: Green, Cyan, Yellow, Emerald, Teal, Gold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Green */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#28a745] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  58
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  Mata Kuliah
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Total Mata Kuliah Aktif</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <BookOpen className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Tersebar Semester 1 s/d 8</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
          </div>
        </div>

        {/* Card 2: Cyan */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#17a2b8] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  144
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  SKS
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Beban SKS Kelulusan</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <GraduationCap className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Standar Sarjana Strata 1 (S1)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-200" />
          </div>
        </div>

        {/* Card 3: Yellow */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#ffc107] text-slate-900 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  84
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider text-slate-900">
                  SKS Inti
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Keahlian Broadcasting & Dakwah</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <Tv className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>58.3% Porsi Kurikulum Utama</span>
            <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          </div>
        </div>

        {/* Card 4: Dark Green */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#1e7e34] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  100%
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  Lengkap
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">RPS Terverifikasi Mutu</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>58 Rencana Pembelajaran Semester</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
          </div>
        </div>

        {/* Card 5: Teal */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#117a8b] text-white flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  4
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider">
                  CPL Utama
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Profil Lulusan KPI</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <Compass className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-white/95">
            <span>Jurnalis, Broadcaster, PR, Peneliti</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />
          </div>
        </div>

        {/* Card 6: Gold */}
        <div className="rounded-xl shadow-xs overflow-hidden bg-[#d39e00] text-slate-900 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="p-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  20
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/20 rounded font-semibold uppercase tracking-wider text-slate-900">
                  SKS
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold mt-1">Konversi Magang & MBKM</p>
            </div>
            <div className="p-3 bg-black/10 rounded-lg">
              <Radio className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="w-full py-1.5 px-4 bg-black/15 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Magang TV, Radio, & Agensi Media</span>
            <Sparkles className="w-3.5 h-3.5 text-slate-800" />
          </div>
        </div>
      </div>

      {/* 2. CHARTS: DISTRIBUSI SKS & SEBARAN SEMESTER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart: Komposisi SKS */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-700" />
                <span>Distribusi Beban SKS per Kelompok Kurikulum</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Total: 144 SKS
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
                    144
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    SKS Total
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
                    <span className="font-mono font-bold text-slate-900">{item.value} SKS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sesuai SK Kurikulum Operasional Prodi KPI 2026</span>
            <span className="text-emerald-700 font-bold">Terintegrasi MBKM</span>
          </div>
        </div>

        {/* Bar Chart: Sebaran SKS per Semester */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-800" />
                <span>Sebaran Beban SKS Semester 1 s/d 8</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Rata-rata: 18–21 SKS / Semester
              </span>
            </div>

            <div className="h-44 pt-4 flex items-end justify-around gap-2 border-b border-slate-200 pb-2">
              {semesterDistribution.map((item, i) => {
                const heightPercent = (item.sks / 24) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                    <div className="w-full flex items-end justify-center h-32">
                      <div
                        className="w-4 sm:w-6 bg-gradient-to-t from-emerald-800 to-emerald-600 rounded-t-xs transition-all hover:bg-emerald-500 cursor-pointer relative group"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-100 px-1 rounded shadow-2xs">
                          {item.sks} SKS
                        </span>
                      </div>
                    </div>
                    <span className="mt-2 text-[11px] font-semibold text-slate-600 font-mono">
                      {item.sem}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
              <span>Beban perkuliahan seimbang & mendukung Magang di Semester 6/7</span>
              <span className="font-mono font-bold text-emerald-900">Total: 144 SKS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABEL MATA KULIAH KURIKULUM KPI */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-[#fcfbf7] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Daftar Mata Kuliah & Perangkat Pembelajaran Semester ({filteredCourses.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rencana Pembelajaran Semester (RPS), bobot SKS, dosen pengampu, dan jenis perkuliahan teori/studio
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mata kuliah atau kode..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-medium"
              />
            </div>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800 font-semibold cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="MK Keahlian KPI">MK Keahlian KPI</option>
              <option value="MK Fakultas">MK Fakultas</option>
              <option value="MK Universitas">MK Universitas</option>
              <option value="MK Pilihan Penyiaran">MK Pilihan Penyiaran</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode MK</th>
                <th className="py-3 px-4">Nama Mata Kuliah</th>
                <th className="py-3 px-4 text-center">Bobot</th>
                <th className="py-3 px-4 text-center">Semester</th>
                <th className="py-3 px-4">Jenis & Kategori</th>
                <th className="py-3 px-4">Dosen Pengampu</th>
                <th className="py-3 px-4 text-center">Status RPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    Tidak ada mata kuliah yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">{c.code}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800">
                      {c.sks} SKS
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                      Sem. {c.semester}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold block w-fit mb-0.5">
                        {c.type}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{c.category}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{c.lecturer}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>RPS Valid</span>
                      </span>
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
