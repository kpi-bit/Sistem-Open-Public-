import React, { useState } from 'react';
import {
  X,
  Database,
  Cloud,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Shield,
  FileCode,
  FolderArchive
} from 'lucide-react';

interface FirebaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<FirebaseGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const envSample = `# Konfigurasi Firebase & Cloud Storage Universitas Al-Fithrah Surabaya
FIREBASE_API_KEY="AIzaSy..."
FIREBASE_AUTH_DOMAIN="uaf-persuratan.firebaseapp.com"
FIREBASE_PROJECT_ID="uaf-persuratan"
FIREBASE_STORAGE_BUCKET="uaf-persuratan.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="570063596726"
FIREBASE_APP_ID="1:570063596726:web:abcd1234"`;

  const firestoreRulesSample = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Koleksi arsip surat resmi Universitas Al-Fithrah Surabaya
    match /letters/{letterId} {
      // Pembacaan publik / staf sivitas akademika
      allow read: if true;
      // Perubahan, tambah, dan hapus hanya untuk administrator terotentikasi
      allow create, update, delete: if request.auth != null;
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#064e3b] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Pengaturan Penyimpanan & Integrasi Firebase
              </h3>
              <p className="text-xs text-emerald-200">
                Petunjuk konfigurasi Cloud Firestore, Storage, dan Penyimpanan Berkas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Status Saat Ini */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status Sistem Penyimpanan Saat Ini: Aktif & Bekerja Nyata</span>
            </div>
            <p className="text-emerald-800 leading-relaxed text-xs">
              Aplikasi saat ini telah dilengkapi dengan <strong>full-stack persistent storage</strong> yang menyimpan data surat di berkas basis data aman server serta berkas PDF fisik di direktori berkas online (<code>/uploads/pdfs/</code>). Semua unggahan PDF dan pengeditan tersimpan secara permanen dan tetap ada meskipun halaman dimuat ulang.
            </p>
          </div>

          {/* Langkah Konfigurasi Firebase */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-emerald-700" />
              <span>Langkah Menghubungkan ke Google Cloud Firebase:</span>
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 block text-xs">
                  1. Buat Project di Firebase Console
                </span>
                <p className="text-slate-600 mt-1">
                  Kunjungi <strong>console.firebase.google.com</strong>, buat project baru bernama <code>iaf-persuratan</code>, dan aktifkan <strong>Cloud Firestore</strong> serta <strong>Firebase Storage</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 block text-xs">
                  2. Aturan Keamanan Firestore (firestore.rules)
                </span>
                <p className="text-slate-600 mt-1 mb-2">
                  Gunakan aturan keamanan terstandarisasi untuk melindungi dokumen persuratan Universitas Al-Fithrah:
                </p>
                <div className="relative">
                  <pre className="p-2.5 bg-slate-900 text-slate-200 rounded font-mono text-[10px] overflow-x-auto">
                    {firestoreRulesSample}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(firestoreRulesSample, 'rules')}
                    className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'rules' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Salin</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-800 block text-xs">
                  3. Variabel Lingkungan (.env) yang Diperlukan
                </span>
                <p className="text-slate-600 mt-1 mb-2">
                  Tambahkan variabel berikut ke pengaturan server tanpa mengekspos kunci di client:
                </p>
                <div className="relative">
                  <pre className="p-2.5 bg-slate-900 text-emerald-300 rounded font-mono text-[10px] overflow-x-auto">
                    {envSample}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(envSample, 'env')}
                    className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Salin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md text-xs transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
