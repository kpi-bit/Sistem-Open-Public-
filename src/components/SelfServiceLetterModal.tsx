import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  Download,
  Building2,
  User,
  Calendar,
  Sparkles,
  Printer,
  CheckCircle2,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { UserSession } from '../types/letter';
import { LetterheadKpiLogo, OfficialKpiStamp } from './InstitutionalLogo';

interface SelfServiceLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSession: UserSession;
  onGenerate: (formData: any) => Promise<any>;
}

export const SelfServiceLetterModal: React.FC<SelfServiceLetterModalProps> = ({
  isOpen,
  onClose,
  userSession,
  onGenerate,
}) => {
  // Super Admin can toggle between issuing letters for Mahasiswa or Dosen
  const [targetGroup, setTargetGroup] = useState<'mahasiswa' | 'dosen'>('mahasiswa');
  const isMahasiswa = targetGroup === 'mahasiswa';
  const isDosen = targetGroup === 'dosen';

  const lecturerTemplates = [
    {
      id: 'Surat Tugas Penelitian',
      badge: 'Dosen KPI',
      name: 'Surat Tugas Penelitian & Pengabdian Masyarakat (PkM)',
      perihal: 'Surat Tugas Pelaksanaan Penelitian dan PkM Dosen',
      desc: 'Penugasan resmi dosen KPI untuk kegiatan penelitian ilmiah dan pengabdian masyarakat dakwah.',
      defaultInstansi: 'LPPM Universitas Al-Fithrah & Mitra Masyarakat',
      defaultPimpinan: 'Ketua LPPM UAF Surabaya',
      defaultAlamat: 'Surabaya dan Wilayah Jawa Timur',
      defaultPeriode: 'Semester Genap Tahun Akademik 2026/2027',
      bodyParagraph:
        'Dalam rangka mewujudkan Tri Dharma Perguruan Tinggi di Program Studi Komunikasi dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya, bersama ini Ketua Program Studi menugaskan kepada dosen berikut untuk melaksanakan kegiatan Penelitian dan Pengabdian kepada Masyarakat (PkM):',
      closingParagraph:
        'Demikian surat tugas ini diterbitkan untuk dilaksanakan dengan penuh dedikasi dan rasa tanggung jawab serta melaporkan hasil pelaksanaannya kepada pimpinan program studi.',
    },
    {
      id: 'Surat Tugas DPL',
      badge: 'Dosen KPI',
      name: 'Surat Tugas Dosen Pembimbing Lapangan (DPL) Magang',
      perihal: 'Penugasan Dosen Pembimbing Lapangan Magang Mahasiswa',
      desc: 'Penugasan dosen pembimbing untuk supervisi magang mahasiswa KPI di mitra penyiaran.',
      defaultInstansi: 'Mitra Industri Penyiaran & Media Massa',
      defaultPimpinan: 'Manajer SDM / Pimpinan Redaksi Media',
      defaultAlamat: 'Surabaya, Jawa Timur',
      defaultPeriode: 'Februari – Juni 2027',
      bodyParagraph:
        'Dalam rangka pelaksanaan bimbingan teknis dan evaluasi berkala Praktek Kerja/Magang mahasiswa Program Studi Komunikasi dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya, bersama ini kami menugaskan dosen pembimbing lapangan berikut:',
      closingParagraph:
        'Demikian surat tugas ini kami sampaikan, atas sinergi dan kerja sama yang baik antara pihak kampus dan instansi mitra kami ucapkan terima kasih.',
    },
    {
      id: 'Surat Keterangan Narasumber',
      badge: 'Dosen KPI',
      name: 'Surat Rekomendasi Narasumber / Pemateri Media Dakwah',
      perihal: 'Surat Rekomendasi Narasumber Kajian Media Penyiaran',
      desc: 'Pengantar resmi menjadi narasumber/penceramah radio, TV, atau lembaga dakwah.',
      defaultInstansi: 'Stasiun Televisi / Radio / Lembaga Mitra',
      defaultPimpinan: 'Produser Eksekutif / Pimpinan Redaksi',
      defaultAlamat: 'Jawa Timur',
      defaultPeriode: 'Tahun 2026/2027',
      bodyParagraph:
        'Menindaklanjuti permohonan narasumber dalam program siaran dan literasi komunikasi Islam, dengan ini Ketua Program Studi Komunikasi dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya memberikan izin dan rekomendasi kepada dosen berikut:',
      closingParagraph:
        'Demikian surat rekomendasi ini diterbitkan untuk dipergunakan sebagaimana mestinya.',
    },
    {
      id: 'Surat Keterangan Mengajar',
      badge: 'Dosen KPI',
      name: 'Surat Keterangan Beban Kerja Dosen (BKD) & Mengajar',
      perihal: 'Surat Keterangan Mengajar dan Beban Kinerja Dosen',
      desc: 'Keterangan aktif mengajar mata kuliah program studi KPI untuk verifikasi BKD dan sertifikasi dosen.',
      defaultInstansi: 'Kopertais Wilayah IV / Bagian Akademik UAF',
      defaultPimpinan: 'Koordinator Kopertais Wilayah IV',
      defaultAlamat: 'Surabaya, Jawa Timur',
      defaultPeriode: 'Tahun Akademik 2026/2027',
      bodyParagraph:
        'Ketua Program Studi Komunikasi dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya menerangkan bahwa dosen di bawah ini secara aktif melaksanakan tugas pengajaran:',
      closingParagraph:
        'Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat digunakan sebagai syarat laporan Beban Kerja Dosen (BKD) dan keperluan administrasi akademik lainnya.',
    },
  ];

  const studentTemplates = [
    {
      id: 'Surat Magang / PKM',
      badge: 'Mahasiswa KPI',
      name: 'Surat Permohonan Melaksanakan Magang (PKM)',
      perihal: 'Permohonan Melaksanakan Magang',
      desc: 'Permohonan izin praktik kerja lapangan mahasiswa KPI di stasiun radio, televisi, podcast, atau media massa (Sesuai Lampiran).',
      defaultInstansi: 'HRD Streaming Radio Suara Muslim',
      defaultPimpinan: 'Bapak/Ibu. Sephy',
      defaultAlamat: 'Jl. Dinoyo No.57, Keputran, Kec. Tegalsari, Surabaya, Jawa Timur 60265',
      defaultPeriode: '09 Februari – 09 Juni 2027',
      bodyParagraph:
        'Dalam rangka melaksanakan Praktek Kerja/Magang sebagai salah satu aktivitas belajar di tempat kerja oleh mahasiswa di Program Studi Ilmu Komunikasi dan Penyiaran Islam, Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya, bersama ini kami memohonkan kesediaan Bapak/Ibu untuk mengizinkan dan memberikan kesempatan bagi mahasiswa berikut:',
      closingParagraph:
        'Untuk melaksanakan Praktek Kerja/Magang di instansi Bapak/Ibu. Kami berharap kehadiran mahasiswa kami di instansi yang Bapak/Ibu pimpin akan memberikan manfaat bagi mereka untuk mengimplementasi konsep - konsep bidang ilmu komunikasi dan media islam yang selama ini telah mereka pelajari di kelas.\n\nDemikian surat permohonan ini kami sampaikan, atas bantuan dan kerjasamanya kami ucapkan terima kasih.',
    },
    {
      id: 'Surat Izin Penelitian',
      badge: 'Mahasiswa KPI',
      name: 'Surat Izin Observasi & Penelitian Skripsi',
      perihal: 'Izin Penelitian dan Pengambilan Data Skripsi',
      desc: 'Izin riset lapangan, wawancara redaksi, dan observasi data penyusunan naskah skripsi.',
      defaultInstansi: 'Pimpinan Redaksi Televisi 9 (TV9) Nusantara',
      defaultPimpinan: 'Bapak H. Hakim Jayli',
      defaultAlamat: 'Jl. Raya Darmo No. 96, Surabaya, Jawa Timur',
      defaultPeriode: '15 Oktober – 15 November 2026',
      bodyParagraph:
        'Sehubungan dengan penyusunan Skripsi/Tugas Akhir mahasiswa pada Program Studi Ilmu Komunikasi dan Penyiaran Islam, Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya, bersama ini kami memohon izin dan perkenan Bapak/Ibu untuk memberikan kesempatan penelitian, observasi, dan wawancara bagi mahasiswa berikut:',
      closingParagraph:
        'Adapun data dan keterangan yang diperoleh semata-mata digunakan untuk kepentingan penyusunan karya ilmiah skripsi akademik. Demikian surat permohonan izin ini kami sampaikan, atas perhatian dan perkenannya kami sampaikan terima kasih.',
    },
    {
      id: 'Surat Keterangan Aktif',
      badge: 'Mahasiswa KPI',
      name: 'Surat Keterangan Aktif Kuliah Mahasiswa',
      perihal: 'Surat Keterangan Aktif Kuliah',
      desc: 'Surat resmi status aktif akademik untuk syarat beasiswa KIP-K, tunjangan instansi orang tua, atau BPJS.',
      defaultInstansi: 'Pengelola Program Beasiswa / Instansi Terkait',
      defaultPimpinan: '',
      defaultAlamat: 'Surabaya, Jawa Timur',
      defaultPeriode: 'Semester Ganjil Tahun Akademik 2026/2027',
      bodyParagraph:
        'Ketua Program Studi Komunikasi dan Penyiaran Islam, Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya, dengan ini menerangkan dengan sebenarnya bahwa:',
      closingParagraph:
        'Adalah benar mahasiswa yang bersangkutan tercatat aktif mengikuti perkuliahan pada Program Studi Komunikasi dan Penyiaran Islam (KPI) Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya Tahun Akademik 2026/2027.\n\nDemikian surat keterangan ini kami berikan untuk dipergunakan sebagaimana mestinya.',
    },
    {
      id: 'Surat Dispensasi',
      badge: 'Mahasiswa KPI',
      name: 'Surat Rekomendasi Dispensasi Khidmah Santri',
      perihal: 'Surat Rekomendasi Dispensasi Perkuliahan',
      desc: 'Izin dispensasi perkuliahan karena tugas khidmah Pondok Pesantren Assalafi Al Fithrah Surabaya.',
      defaultInstansi: 'Dosen Pengampu Mata Kuliah Prodi KPI',
      defaultPimpinan: 'Bapak/Ibu Dosen Pengampu',
      defaultAlamat: 'Kampus Universitas Al-Fithrah Surabaya',
      defaultPeriode: '10 – 15 Oktober 2026',
      bodyParagraph:
        'Dengan ini Ketua Program Studi Komunikasi dan Penyiaran Islam memberikan rekomendasi izin dispensasi kehadiran perkuliahan kepada mahasiswa berikut:',
      closingParagraph:
        'Sehubungan dengan penugasan khidmah resmi kepengurusan Pondok Pesantren Assalafi Al Fithrah Surabaya dalam rangka persiapan agenda kelembagaan. Mohon kepada Bapak/Ibu Dosen untuk memberikan kelonggaran presensi dan penugasan akademik pengganti.\n\nDemikian surat dispensasi ini dibuat untuk digunakan sebagaimana mestinya.',
    },
    {
      id: 'Surat Delegasi',
      badge: 'Mahasiswa KPI',
      name: 'Surat Tugas Delegasi / Lomba Media Penyiaran',
      perihal: 'Surat Tugas Delegasi Kompetisi Penyiaran',
      desc: 'Surat tugas mewakili kampus UAF dalam festival film pendek dakwah, lomba presenter TV, atau podcast nasional.',
      defaultInstansi: 'Panitia Festival Penyiaran Islam Nasional',
      defaultPimpinan: 'Ketua Pelaksana',
      defaultAlamat: 'Jawa Timur',
      defaultPeriode: 'Oktober – November 2026',
      bodyParagraph:
        'Ketua Program Studi Komunikasi dan Penyiaran Islam Fakultas Tarbiyah dan Dakwah Universitas Al-Fithrah Surabaya dengan ini menugaskan mahasiswa berikut sebagai delegasi resmi:',
      closingParagraph:
        'Untuk mengikuti rangkaian perlombaan dan kegiatan penyiaran dakwah. Demikian surat tugas ini diberikan untuk dilaksanakan dengan penuh sportivitas dan membawa nama baik almamater Universitas Al-Fithrah Surabaya.',
    },
  ];

  const templates = isDosen ? lecturerTemplates : studentTemplates;
  const [selectedTemplate, setSelectedTemplate] = useState(studentTemplates[0].id);
  const currentTemplateObj = templates.find((t) => t.id === selectedTemplate) || templates[0];

  const [perihal, setPerihal] = useState(currentTemplateObj.perihal);
  const [recipientTitle, setRecipientTitle] = useState(currentTemplateObj.defaultInstansi);
  const [recipientPerson, setRecipientPerson] = useState(currentTemplateObj.defaultPimpinan);
  const [recipientAddress, setRecipientAddress] = useState(currentTemplateObj.defaultAlamat);
  const [periodOrDuration, setPeriodOrDuration] = useState(currentTemplateObj.defaultPeriode);

  // Student Fields
  const [studentName, setStudentName] = useState(userSession.name || 'WULAN FATHUL WINA');
  const [studentNim, setStudentNim] = useState(userSession.nim || '202470233012');
  const [studentAddress, setStudentAddress] = useState(
    userSession.address || 'Jl. Jagasatru Gg.Langgar 2 RT.02 RW.03 Dusun 0 RT 002 RW 003 Kel.Jagasatra Kec. Pekalipan Kota Cirebon'
  );
  const [studentPhone, setStudentPhone] = useState(userSession.phone || '083870838747');

  // Lecturer Fields
  const [lecturerName, setLecturerName] = useState(userSession.name || 'Muhammad Munir, M.Sos.');
  const [lecturerNidn, setLecturerNidn] = useState(userSession.nidn || '2126059505');

  // Custom Topic / Title field (for Thesis or Specific purpose)
  const [researchTopic, setResearchTopic] = useState('Strategi Penyiaran Dakwah Digital pada Media Radio Suara Muslim Surabaya');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('preview');

  useEffect(() => {
    const t = templates.find((item) => item.id === selectedTemplate);
    if (t) {
      setPerihal(t.perihal);
      setRecipientTitle(t.defaultInstansi);
      setRecipientPerson(t.defaultPimpinan);
      setRecipientAddress(t.defaultAlamat);
      setPeriodOrDuration(t.defaultPeriode);
    }
  }, [selectedTemplate]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setIsSubmitting(true);
      await onGenerate({
        templateType: selectedTemplate,
        perihal,
        recipientTitle,
        recipientPerson,
        recipientAddress,
        studentName,
        studentNim,
        studentAddress,
        studentPhone,
        lecturerName,
        lecturerNidn,
        periodOrDuration,
        researchTopic,
        creatorRole: userSession.role,
        creatorIdentifier: userSession.identifier,
        creatorName: userSession.name,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-amber-300 w-full max-w-6xl max-h-[94vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Top Header - Bright Institutional Banner with Gold Accent */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-900 to-emerald-950 text-white flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-white/10 ring-1 ring-amber-300">
              <LetterheadKpiLogo className="scale-75 origin-center w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                  PROGRAM STUDI KOMUNIKASI DAN PENYIARAN ISLAM (KPI)
                </span>
                <span className="text-emerald-300">·</span>
                <span className="text-[10px] text-emerald-200">
                  Universitas Al-Fithrah Surabaya
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Penerbitan Surat Resmi Mahasiswa & Dosen</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-emerald-950 font-extrabold">
                  Super Admin
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-md text-xs font-semibold border border-amber-300/60 transition-colors cursor-pointer"
              title="Cetak langsung ke printer atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex border-b border-amber-200 bg-amber-50/60 p-1 text-xs">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-1.5 rounded font-bold text-center ${
              mobileTab === 'form' ? 'bg-white shadow-xs text-emerald-900 border border-amber-300' : 'text-slate-600'
            }`}
          >
            1. Formulir Kebutuhan
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 rounded font-bold text-center ${
              mobileTab === 'preview' ? 'bg-white shadow-xs text-emerald-900 border border-amber-300' : 'text-slate-600'
            }`}
          >
            2. Pratinjau Surat A4 (Resmi)
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
          {/* Left Panel: Form Input (5 Columns on Desktop) */}
          <div
            className={`lg:col-span-5 border-r border-amber-200/80 overflow-y-auto p-5 space-y-4 text-xs bg-[#fdfcf9] ${
              mobileTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Step 1: Pilih Kebutuhan Surat */}
            <div>
              {/* Category Selector for Super Admin */}
              <div className="flex border border-amber-300 rounded-lg p-0.5 bg-amber-50 text-xs font-semibold mb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setTargetGroup('mahasiswa');
                    setSelectedTemplate(studentTemplates[0].id);
                  }}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    targetGroup === 'mahasiswa'
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Surat Mahasiswa KPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetGroup('dosen');
                    setSelectedTemplate(lecturerTemplates[0].id);
                  }}
                  className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    targetGroup === 'dosen'
                      ? 'bg-emerald-800 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Surat Tugas Dosen KPI</span>
                </button>
              </div>

              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Pilih Templat Surat ({isMahasiswa ? 'Mahasiswa' : 'Dosen'}):</span>
                </label>
              </div>

              <div className="space-y-1.5">
                {templates.map((tpl) => (
                  <label
                    key={tpl.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      selectedTemplate === tpl.id
                        ? 'bg-amber-50/90 border-amber-500 ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="templateChoice"
                      value={tpl.id}
                      checked={selectedTemplate === tpl.id}
                      onChange={() => setSelectedTemplate(tpl.id)}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs">
                          {tpl.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold shrink-0">
                          {tpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                        {tpl.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Tujuan Instansi Surat */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Instansi & Tujuan Surat</span>
              </h4>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Perihal Surat
                </label>
                <input
                  type="text"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-semibold text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Nama Instansi / Media / Lembaga Tujuan
                </label>
                <input
                  type="text"
                  value={recipientTitle}
                  onChange={(e) => setRecipientTitle(e.target.value)}
                  placeholder="Contoh: HRD Streaming Radio Suara Muslim"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">
                    Nama Pimpinan / Ditujukan
                  </label>
                  <input
                    type="text"
                    value={recipientPerson}
                    onChange={(e) => setRecipientPerson(e.target.value)}
                    placeholder="Contoh: Bapak/Ibu. Sephy"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">
                    Waktu / Periode Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={periodOrDuration}
                    onChange={(e) => setPeriodOrDuration(e.target.value)}
                    placeholder="09 Februari – 09 Juni 2027"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Alamat Lengkap Instansi Tujuan
                </label>
                <textarea
                  rows={2}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Alamat instansi tujuan..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs text-slate-900 resize-none"
                />
              </div>
            </div>

            {/* Step 3: Biodata Pemohon (Mahasiswa NIM / Dosen NIDN) */}
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Biodata Pemohon ({isMahasiswa ? 'Mahasiswa' : 'Dosen'})</span>
              </h4>

              {isMahasiswa ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        Nama Mahasiswa
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        NIM (Nomor Induk Mahasiswa)
                      </label>
                      <input
                        type="text"
                        value={studentNim}
                        onChange={(e) => setStudentNim(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">
                      Alamat / Tempat Tinggal
                    </label>
                    <textarea
                      rows={2}
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        No. HP / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        Program Studi
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Komunikasi & Penyiaran Islam"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-600 font-medium text-xs"
                      />
                    </div>
                  </div>

                  {selectedTemplate === 'Surat Izin Penelitian' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        Judul Penelitian / Skripsi
                      </label>
                      <textarea
                        rows={2}
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs resize-none italic"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        Nama Dosen
                      </label>
                      <input
                        type="text"
                        value={lecturerName}
                        onChange={(e) => setLecturerName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">
                        NIDN (Nomor Induk Dosen)
                      </label>
                      <input
                        type="text"
                        value={lecturerNidn}
                        onChange={(e) => setLecturerNidn(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none font-mono text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">
                      Fokus / Periode Tugas
                    </label>
                    <input
                      type="text"
                      value={periodOrDuration}
                      onChange={(e) => setPeriodOrDuration(e.target.value)}
                      placeholder="Semester Genap Tahun 2026/2027"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 outline-none text-xs"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Quick Informational Notice */}
            <div className="p-3 bg-amber-50/70 border border-amber-300/80 rounded-lg text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Petunjuk Penerbitan Surat</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Surat yang diterbitkan otomatis memuat Kop Surat resmi Universitas Al-Fithrah Surabaya, nomor surat terdata, serta tanda tangan dan stempel digital Kaprodi <strong>Muhammad Munir, M.Sos. (NIDN: 2126059505)</strong>.
              </p>
            </div>
          </div>

          {/* Right Panel: Official A4 Live Document Preview (7 Columns on Desktop) */}
          <div
            className={`lg:col-span-7 bg-[#f6f4ee] overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-start ${
              mobileTab === 'form' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* The A4 Letter Container with ID for exact browser print */}
            <div
              id="printable-official-letter"
              className="bg-white text-slate-950 shadow-xl border border-amber-200/90 rounded-xs w-full max-w-[595px] min-h-[820px] p-8 sm:p-11 font-serif relative text-[11px] sm:text-[12px] leading-relaxed"
            >
              {/* KOP SURAT RESMI DENGAN LOGO EMAS & KETERANGAN ALAMAT PERSIS LAMPIRAN */}
              <div className="flex items-center gap-3.5 pb-2.5 border-b-[2.5px] border-slate-950">
                {/* Logo Emas Persis Sesuai Lampiran */}
                <LetterheadKpiLogo className="w-16 shrink-0" />

                <div className="text-center flex-1 pr-2 font-sans">
                  <h2 className="text-[13px] sm:text-[15px] font-black tracking-wide uppercase text-slate-950 leading-tight">
                    UNIVERSITAS AL-FITHRAH SURABAYA
                  </h2>
                  <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-slate-900 leading-tight mt-0.5">
                    FAKULTAS TARBIYAH DAN DAKWAH
                  </h3>
                  <h4 className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-tight text-emerald-950 leading-tight">
                    PROGRAM STUDI KOMUNIKASI DAN PENYIARAN ISLAM
                  </h4>
                  <p className="text-[9.5px] text-slate-600 mt-0.5 font-normal">
                    Jl. Kedinding Lor No. 30 Surabaya 60129
                  </p>
                  <p className="text-[9px] text-slate-600 font-normal">
                    Web. : <span className="text-blue-700 underline font-medium">www.alfithrah.ac.id</span> - Email : <span className="text-blue-700 underline font-medium">kpi@alfithrah.ac.id</span>
                  </p>
                </div>
              </div>

              {/* Garis Ganda Pemisah Kop Surat (Thick + Thin border) */}
              <div className="h-0.5 bg-slate-950 mt-0.5 mb-4" />

              {/* Blok Metadata Surat (Nomor, Lampiran, Perihal) */}
              <div className="grid grid-cols-12 gap-1 mb-4 font-sans text-[11px]">
                <div className="col-span-2 text-slate-800 font-medium">No</div>
                <div className="col-span-10 font-mono font-medium">
                  : 044/03/KPI-UAF/B/X/2026
                </div>
                <div className="col-span-2 text-slate-800 font-medium">Lampiran</div>
                <div className="col-span-10">: -</div>
                <div className="col-span-2 text-slate-800 font-medium">Perihal</div>
                <div className="col-span-10 font-bold text-slate-950">
                  : {perihal || 'Permohonan Melaksanakan Magang'}
                </div>
              </div>

              {/* Blok Kepada Yth. */}
              <div className="mb-4 font-sans text-[11px] leading-snug">
                <p>Kepada Yth.</p>
                <p className="font-bold">{recipientTitle || 'HRD Streaming Radio Suara Muslim'}</p>
                {recipientPerson && <p>{recipientPerson}</p>}
                <p className="max-w-md">{recipientAddress || 'Jl. Dinoyo No.57, Keputran, Kec. Tegalsari, Surabaya'}</p>
                <p className="mt-1">di</p>
                <p className="ml-4 font-semibold">Tempat</p>
              </div>

              {/* Isi Surat Dinamis Sesuai Kebutuhan Mahasiswa & Dosen */}
              <div className="space-y-2.5 font-sans text-[11px] text-justify leading-relaxed">
                <p>Dengan Hormat,</p>
                <p>{currentTemplateObj.bodyParagraph}</p>

                {/* Data Pemohon */}
                <div className="my-2.5 pl-4 space-y-1 font-sans text-[11px]">
                  {isMahasiswa ? (
                    <>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">Nama</span>
                        <span className="col-span-8 font-bold uppercase">: {studentName || 'WULAN FATHUL WINA'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">NIM</span>
                        <span className="col-span-8 font-mono font-bold">: {studentNim || '202470233012'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">Tempat di</span>
                        <span className="col-span-8 leading-snug">: {studentAddress || 'Jl. Jagasatru Gg.Langgar 2, Cirebon'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">No. HP/Email</span>
                        <span className="col-span-8 font-mono">: {studentPhone || '083870838747'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">
                          {selectedTemplate === 'Surat Magang / PKM'
                            ? 'Pelaksanaan PKM'
                            : selectedTemplate === 'Surat Izin Penelitian'
                            ? 'Waktu Penelitian'
                            : selectedTemplate === 'Surat Dispensasi'
                            ? 'Waktu Dispensasi'
                            : 'Masa Berlaku'}
                        </span>
                        <span className="col-span-8 font-semibold">: {periodOrDuration || '09 Februari – 09 Juni 2027'}</span>
                      </div>
                      {selectedTemplate === 'Surat Izin Penelitian' && researchTopic && (
                        <div className="grid grid-cols-12 pt-0.5">
                          <span className="col-span-4 font-semibold text-slate-800">Judul Penelitian</span>
                          <span className="col-span-8 font-medium italic">: &ldquo;{researchTopic}&rdquo;</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">Nama Dosen</span>
                        <span className="col-span-8 font-bold">: {lecturerName || 'Muhammad Munir, M.Sos.'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">NIDN</span>
                        <span className="col-span-8 font-mono font-bold">: {lecturerNidn || '2126059505'}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">Jabatan Akademik</span>
                        <span className="col-span-8">: Dosen Tetap Prodi Komunikasi dan Penyiaran Islam</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4 font-semibold text-slate-800">Fokus / Periode Tugas</span>
                        <span className="col-span-8 font-semibold">: {periodOrDuration || 'Semester Genap 2026/2027'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Paragraf Penutup Sesuai Template */}
                <div className="whitespace-pre-line leading-relaxed">
                  {currentTemplateObj.closingParagraph}
                </div>
              </div>

              {/* Titimangsa, Tanda Tangan & Stempel Resmi Kaprodi */}
              <div className="mt-8 flex justify-end">
                <OfficialKpiStamp dateStr={currentDateFormatted} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-3.5 bg-[#fcfbf7] border-t border-amber-300 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format surat resmi berstempel dan bertanda tangan Kaprodi Muhammad Munir, M.Sos. siap diterbitkan.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak langsung menggunakan browser atau simpan PDF resolusi tinggi"
            >
              <Printer className="w-3.5 h-3.5 text-amber-700" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menerbitkan Surat...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terbitkan & Unduh Surat Resmi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
