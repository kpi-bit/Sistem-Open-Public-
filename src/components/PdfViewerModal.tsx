import React from 'react';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Printer
} from 'lucide-react';
import { Letter } from '../types/letter';
import { getPdfUrl } from '../services/api';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  letter: Letter | null;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  letter,
}) => {
  if (!isOpen || !letter) return null;

  const pdfUrl = getPdfUrl(letter.id);
  const downloadUrl = getPdfUrl(letter.id, true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* PDF Viewer Header Toolbar */}
        <div className="px-4 sm:px-6 py-3 bg-[#064e3b] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {letter.title}
              </h3>
              <p className="text-[11px] text-emerald-200/90 font-mono truncate">
                {letter.letterNumber} · UAF E-Archive
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={downloadUrl}
              download={letter.pdfFileName || `Surat_${letter.letterNumber}.pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh PDF</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
              title="Buka Dokumen di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tab Baru</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-md transition-colors cursor-pointer ml-1"
              aria-label="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewport */}
        <div className="flex-1 w-full bg-slate-100 relative">
          <iframe
            src={pdfUrl}
            title={`PDF Viewer - ${letter.letterNumber}`}
            className="w-full h-full border-none"
          />
        </div>

        {/* Footer info strip */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Universitas Al-Fithrah Surabaya · Berkas PDF Digital Resmi</span>
          <span className="font-mono">
            {letter.pdfFileName || 'dokumen.pdf'}
          </span>
        </div>
      </div>
    </div>
  );
};
