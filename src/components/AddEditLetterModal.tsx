import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Letter, LetterCategory } from '../types/letter';

interface AddEditLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData, isEdit: boolean, letterId?: string) => Promise<void>;
  letterToEdit?: Letter | null;
}

export const AddEditLetterModal: React.FC<AddEditLetterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  letterToEdit,
}) => {
  const isEdit = !!letterToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [letterNumber, setLetterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<LetterCategory>('Surat Keluar');
  const [letterDate, setLetterDate] = useState('');
  const [institutionUnit, setInstitutionUnit] = useState('Universitas Al-Fithrah Surabaya');
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [creator, setCreator] = useState('Staf Tata Usaha KPI - Universitas Al-Fithrah');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPdfName, setExistingPdfName] = useState<string | null>(null);
  const [removeExistingPdf, setRemoveExistingPdf] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (letterToEdit) {
      setLetterNumber(letterToEdit.letterNumber);
      setTitle(letterToEdit.title);
      setDescription(letterToEdit.description || '');
      setCategory(letterToEdit.category);
      setLetterDate(letterToEdit.letterDate);
      setInstitutionUnit(letterToEdit.institutionUnit || 'Universitas Al-Fithrah Surabaya');
      setSender(letterToEdit.sender || '');
      setRecipient(letterToEdit.recipient || '');
      setCreator(letterToEdit.creator || 'Staf Tata Usaha KPI - Universitas Al-Fithrah');
      setExistingPdfName(letterToEdit.pdfFileName || null);
      setSelectedFile(null);
      setRemoveExistingPdf(false);
    } else {
      // Default reset
      setLetterNumber('');
      setTitle('');
      setDescription('');
      setCategory('Surat Keluar');
      setLetterDate(new Date().toISOString().split('T')[0]);
      setInstitutionUnit('Universitas Al-Fithrah Surabaya');
      setSender('Prodi Komunikasi dan Penyiaran Islam - Universitas Al-Fithrah');
      setRecipient('');
      setCreator('Staf Tata Usaha KPI - Universitas Al-Fithrah');
      setSelectedFile(null);
      setExistingPdfName(null);
      setRemoveExistingPdf(false);
    }
    setValidationError(null);
  }, [letterToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setValidationError('Format berkas harus berupa dokumen PDF (.pdf).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setValidationError('Ukuran berkas PDF melebihi batas maksimum 15MB.');
        return;
      }
      setSelectedFile(file);
      setRemoveExistingPdf(false);
      setValidationError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setValidationError('Format berkas harus berupa dokumen PDF (.pdf).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setValidationError('Ukuran berkas PDF melebihi batas maksimum 15MB.');
        return;
      }
      setSelectedFile(file);
      setRemoveExistingPdf(false);
      setValidationError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!letterNumber.trim()) {
      setValidationError('Nomor resmi surat wajib diisi.');
      return;
    }
    if (!title.trim()) {
      setValidationError('Nama surat / perihal wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError(null);

      const formData = new FormData();
      formData.append('letterNumber', letterNumber.trim());
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      formData.append('letterDate', letterDate || new Date().toISOString().split('T')[0]);
      formData.append('institutionUnit', institutionUnit.trim());
      formData.append('sender', sender.trim());
      formData.append('recipient', recipient.trim());
      formData.append('creator', creator.trim());

      if (selectedFile) {
        formData.append('pdfFile', selectedFile);
      }
      if (removeExistingPdf) {
        formData.append('removePdf', 'true');
      }

      await onSubmit(formData, isEdit, letterToEdit?.id);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      } else {
        setValidationError('Terjadi kesalahan saat menyimpan surat.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#064e3b] text-white">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>{isEdit ? 'Ubah Data Surat Resmi' : 'Tambah Surat Baru'}</span>
            </h3>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              INSTITUT AL FITHRAH SURABAYA · Sistem Informasi Persuratan Digital
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nomor Surat */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Surat Resmi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="Contoh: 001/UAF/KPI/X/2026"
                className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Nomor urut sistem akan dibuat secara otomatis.
              </span>
            </div>

            {/* Tanggal Surat */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Terbit Dokumen <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Nama Surat */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Surat / Perihal <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Surat Tugas Dosen Pembimbing PKM Mahasiswa KPI"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategori Surat */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori Jenis Surat
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LetterCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none bg-white font-medium"
              >
                <option value="Surat Keluar">Surat Keluar</option>
                <option value="Surat Masuk">Surat Masuk</option>
                <option value="Surat Keputusan">Surat Keputusan (SK)</option>
                <option value="Surat Edaran">Surat Edaran</option>
                <option value="Nota Dinas">Nota Dinas</option>
                <option value="Surat Tugas">Surat Tugas</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Bidang / Unit Institusi */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bidang / Unit Kerja UAF
              </label>
              <input
                type="text"
                value={institutionUnit}
                onChange={(e) => setInstitutionUnit(e.target.value)}
                placeholder="Misal: Prodi KPI, Fakultas Tarbiyah dan Dakwah, LPPM, BAAK"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pengirim */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pengirim / Instansi Asal
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Misal: Kaprodi KPI / Dekan FTD / Rektor UAF"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              />
            </div>

            {/* Penerima */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Penerima / Tujuan Surat
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Misal: Sivitas Akademika / TV9 / Kopertais"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Keterangan / Isi Ringkas Surat
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Berikan ringkasan isi surat, batas waktu pelaksanaan, atau instruksi tindak lanjut..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 outline-none resize-none"
            />
          </div>

          {/* Upload File PDF */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Unggah Berkas PDF (Wajib .pdf, Maks 15MB)
            </label>

            {/* If there's an existing PDF in edit mode */}
            {existingPdfName && !removeExistingPdf && !selectedFile && (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/70 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-sm">{existingPdfName}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Tersimpan di Server
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRemoveExistingPdf(true)}
                  className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors"
                  title="Hapus PDF yang tersimpan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Selected new file preview */}
            {selectedFile && (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/70 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-900 font-medium">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-xs">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-500 hover:text-rose-600 p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Drag & drop upload area */}
            {(!selectedFile || (!existingPdfName && !selectedFile)) && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/20 rounded-lg p-5 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-emerald-600 mb-2" />
                <p className="font-semibold text-slate-700">
                  {existingPdfName && !removeExistingPdf
                    ? 'Klik untuk mengganti dengan file PDF baru'
                    : 'Tarik & letakkan berkas PDF di sini, atau klik untuk memilih'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mendukung format .pdf resmi hingga ukuran 15MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Form Actions (Tombol Simpan dan Batal) */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Surat'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
