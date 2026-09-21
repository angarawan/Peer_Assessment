import React, { useState, useEffect } from 'react';
import { DatabaseService } from '../../services/db';
import { isFirebaseConfigured } from '../../lib/firebase';
import {
  Settings,
  Database,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
  Server,
  AlertCircle,
  Sliders,
  Award,
  Sparkles
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isFbConnected = isFirebaseConfigured();

  const handleResetData = async () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengatur ulang data aplikasi ke data bawaan Kurikulum PJOK Kelas XI (Passing Bola Basket)? Semua data dummy akan diperbarui.'
      )
    ) {
      setResetting(true);
      await DatabaseService.resetToSeedData();
      setResetting(false);
      setMessage('Data aplikasi berhasil diatur ulang ke konfigurasi standar PJOK.');
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
          Pengaturan & Basis Data
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Konfigurasi sistem, status penyimpanan Firebase, dan pemulihan data aplikasi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Koneksi Firebase */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Status Penyimpanan Data (Firebase Firestore)
              </h3>
              <p className="text-xs text-slate-400">
                Arsitektur database multi-role & otentikasi
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Mode Penyimpanan:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {isFbConnected ? 'Firebase Cloud Firestore' : 'Hybrid Local Storage (Auto-Sync)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Keamanan Role (RBAC):</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Guru (Admin) & Murid (Restricted)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Format Nilai:</span>
              <span className="font-semibold text-slate-800">
                Skala Likert 1–4 & Konversi Otomatis 100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Aplikasi dirancang dengan arsitektur hybrid yang siap digunakan langsung di kelas tanpa hambatan jaringan, serta terintegrasi dengan Firebase Cloud untuk sinkronisasi antar perangkat (HP & Laptop).
          </p>
        </div>

        {/* Reset & Pemeliharaan Data */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading">
                  Reset Data ke Kurikulum PJOK Awal
                </h3>
                <p className="text-xs text-slate-400">
                  Muat ulang data sampel Kelas XI 7 materi Bola Basket
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Jika Anda ingin membersihkan data uji coba dan memulihkan daftar siswa, 5 indikator passing bola basket, dan sampel penilaian awal, Anda dapat menekan tombol di bawah ini.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetting ? 'Memulihkan Data...' : 'Reset ke Data Bawaan Kurikulum'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h4 className="font-extrabold text-slate-900 font-heading">
              PENILAIAN ANTAR TEMAN PJOK
            </h4>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Aplikasi Penilaian Formatif Pendidikan Jasmani, Olahraga, dan Kesehatan &bull; Kurikulum Merdeka
          </p>
          <p className="text-[11px] text-emerald-600 font-medium italic">
            &ldquo;Belajar menilai, belajar memperbaiki&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sistem Terverifikasi Aman</span>
        </div>
      </div>
    </div>
  );
};
