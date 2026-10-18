import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Letter } from '../types/letter';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: Letter | null;
  onConfirm: (letterId: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  letter,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen || !letter) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(letter.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">
            Hapus Dokumen Surat?
          </h3>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Apakah Anda yakin ingin menghapus data surat resmi dengan nomor:
          </p>

          <div className="my-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-mono font-bold text-rose-800 block">
              {letter.letterNumber}
            </span>
            <span className="font-medium text-slate-700 block mt-0.5 line-clamp-2">
              {letter.title}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Tindakan ini akan menghapus arsip data surat serta berkas PDF terkait dari penyimpanan sistem. Tindakan ini tidak dapat dibatalkan.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Surat'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
