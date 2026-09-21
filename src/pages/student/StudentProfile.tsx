import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../services/db';
import { AssessmentRecord } from '../../types';
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Lightbulb
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [assessmentsGivenCount, setAssessmentsGivenCount] = useState(0);
  const [assessmentsReceivedCount, setAssessmentsReceivedCount] = useState(0);
  const [averageReceivedScore, setAverageReceivedScore] = useState<string>('0.00');

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      const records = await DatabaseService.getAssessments();
      const given = records.filter(
        (r) =>
          r.assessorUserId === user.uid ||
          r.assessorName.toLowerCase() === user.nama.toLowerCase()
      );
      const received = records.filter(
        (r) =>
          r.targetUserId === user.uid ||
          r.targetName.toLowerCase() === user.nama.toLowerCase()
      );

      setAssessmentsGivenCount(given.length);
      setAssessmentsReceivedCount(received.length);

      if (received.length > 0) {
        const sum = received.reduce((acc, curr) => acc + (curr.averageScore || 0), 0);
        setAverageReceivedScore((sum / received.length).toFixed(2));
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-3xl mx-auto mb-4 shadow-xl shadow-emerald-500/25">
          {user?.nama ? user.nama.charAt(0) : 'M'}
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
          {user?.nama || 'Nama Siswa'}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-emerald-600 mt-0.5">
          Murid Kelas {user?.kelas || 'XI 7'} &bull; Nomor Absen {user?.nomorAbsen || '01'}
        </p>
        <p className="text-xs text-slate-400 font-mono mt-1">NIS: {user?.nis || '-'}</p>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Menilai
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 font-heading">
              {assessmentsGivenCount}
            </span>
            <span className="text-[10px] text-slate-400 block">Teman</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
              Dinilai
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-800 font-heading">
              {assessmentsReceivedCount}
            </span>
            <span className="text-[10px] text-slate-400 block">Kali</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
              Rata-Rata
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-700 font-heading">
              {averageReceivedScore}
            </span>
            <span className="text-[10px] text-emerald-600 block">Skala 4</span>
          </div>
        </div>
      </div>

      {/* Guide to Peer Assessment (Section 26) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              Panduan Penilaian Antar Teman (Peer Assessment)
            </h3>
            <p className="text-xs text-slate-400">
              Prinsip dan cara menilai yang baik dalam pembelajaran PJOK
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Objektif & Jujur:</strong> Nilai gerakan teman berdasarkan ketercapaian rubrik indikator gerak jasmani, bukan karena rasa sungkan atau kedekatan personal.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Konstruktif:</strong> Tuliskan masukan yang membantu teman memperbaiki posisi kaki, tangan, pandangan, atau keseimbangan saat mempraktikkan gerak.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              <strong>Saling Menghargai:</strong> Gunakan bahasa yang sopan dan santun. Belajar menilai juga membantu kita memahami teknik gerak yang benar.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
            Keluar dari Akun Siswa
          </h4>
          <p className="text-[11px] text-slate-400">
            Sesi kamu akan disimpan dengan aman
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </div>
  );
};
