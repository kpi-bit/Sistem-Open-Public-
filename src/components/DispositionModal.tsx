import React, { useState, useEffect } from 'react';
import { X, FileCheck2, Send, Clock, CheckCircle } from 'lucide-react';
import { Letter } from '../types/letter';

interface DispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: Letter | null;
  onSubmit: (id: string, payload: { dispositionTo: string; dispositionNote: string; dispositionStatus: string }) => Promise<void>;
}

export const DispositionModal: React.FC<DispositionModalProps> = ({
  isOpen,
  onClose,
  letter,
  onSubmit,
}) => {
  const [dispositionTo, setDispositionTo] = useState('');
  const [dispositionNote, setDispositionNote] = useState('');
  const [dispositionStatus, setDispositionStatus] = useState<'Proses Disposisi' | 'Selesai'>('Proses Disposisi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (letter) {
      setDispositionTo(letter.dispositionTo || '');
      setDispositionNote(letter.dispositionNote || '');
      setDispositionStatus((letter.dispositionStatus as any) || 'Proses Disposisi');
    }
  }, [letter, isOpen]);

  if (!isOpen || !letter) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispositionTo.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(letter.id, {
        dispositionTo: dispositionTo.trim(),
        dispositionNote: dispositionNote.trim(),
        dispositionStatus,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickRoles = [
    'Wakil Rektor I (Akademik)',
    'Wakil Rektor II (Keuangan & Umum)',
    'Wakil Rektor III (Kemahasiswaan)',
    'Dekan Fakultas Tarbiyah dan Dakwah',
    'Ketua LPPM UAF',
    'Kepala BAAK',
    'Kepala Biro AUAK',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-[#20c997] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-bold text-white">
                Lembar Disposisi Surat
              </h3>
              <p className="text-[11px] text-white/90">
                Pencatatan instruksi pimpinan Universitas Al-Fithrah Surabaya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Letter Reference */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-500 font-mono block">
              {letter.letterNumber}
            </span>
            <p className="font-semibold text-slate-800 text-xs mt-0.5">
              {letter.title}
            </p>
          </div>

          {/* Disposisi Kepada */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Disposisi Diteruskan Kepada <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={dispositionTo}
              onChange={(e) => setDispositionTo(e.target.value)}
              placeholder="Pilih atau ketik pejabat / bagian terkait..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none"
            />
            {/* Quick role buttons */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {quickRoles.slice(0, 4).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setDispositionTo(role)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 rounded text-[10px] text-slate-600 transition-colors cursor-pointer"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Petunjuk / Catatan Disposisi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Instruksi / Catatan Tindak Lanjut
            </label>
            <textarea
              rows={3}
              value={dispositionNote}
              onChange={(e) => setDispositionNote(e.target.value)}
              placeholder="Contoh: Pelajari dan segera koordinasikan dengan bagian akademik; Hadiri dan buat resume..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-none resize-none"
            />
          </div>

          {/* Status Disposisi */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Status Disposisi
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Proses Disposisi"
                  checked={dispositionStatus === 'Proses Disposisi'}
                  onChange={() => setDispositionStatus('Proses Disposisi')}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700 font-medium">Dalam Proses</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Selesai"
                  checked={dispositionStatus === 'Selesai'}
                  onChange={() => setDispositionStatus('Selesai')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700 font-medium">Selesai Ditindaklanjuti</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-md border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-md bg-[#20c997] hover:bg-teal-600 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simpan Disposisi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
