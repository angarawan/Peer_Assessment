import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService, subscribeToDataChanges } from '../../services/db';
import { AssessmentTask, AssessmentRecord } from '../../types';
import { StudentTab } from '../../components/StudentNav';
import {
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  Calendar,
  HeartHandshake,
  HelpCircle
} from 'lucide-react';

interface StudentHomeProps {
  onNavigateTab: (tab: StudentTab) => void;
  onStartAssessment: (task: AssessmentTask) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onNavigateTab,
  onStartAssessment
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<AssessmentTask[]>([]);
  const [myAssessmentsGiven, setMyAssessmentsGiven] = useState<AssessmentRecord[]>([]);
  const [myAssessmentsReceived, setMyAssessmentsReceived] = useState<AssessmentRecord[]>([]);

  const loadData = async () => {
    if (!user) return;
    const [allTasks, allAssessments] = await Promise.all([
      DatabaseService.getTasks(),
      DatabaseService.getAssessments()
    ]);

    // Tasks for user's class
    const userClass = (user.kelas || 'XI 7').toLowerCase();
    const relevantTasks = allTasks.filter(
      (t) => t.kelas.toLowerCase() === userClass && t.status === 'aktif'
    );
    setTasks(relevantTasks);

    // Given by me
    const given = allAssessments.filter(
      (a) => a.assessorUserId === user.uid || a.assessorName.toLowerCase() === user.nama.toLowerCase()
    );
    setMyAssessmentsGiven(given);

    // Received by me
    const received = allAssessments.filter(
      (a) => a.targetUserId === user.uid || a.targetName.toLowerCase() === user.nama.toLowerCase()
    );
    setMyAssessmentsReceived(received);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, [user]);

  // Average score received by this student
  const avgReceived =
    myAssessmentsReceived.length > 0
      ? (
          myAssessmentsReceived.reduce((sum, item) => sum + (item.averageScore || 0), 0) /
          myAssessmentsReceived.length
        ).toFixed(2)
      : null;

  const score100Received = avgReceived ? Math.round((Number(avgReceived) / 4) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-600/15 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Selamat Belajar & Berolahraga</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Halo, {user?.nama}! 👋
          </h2>

          <p className="mt-1 text-sm sm:text-base text-emerald-50">
            Siswa Kelas <strong className="text-white underline decoration-emerald-300">{user?.kelas || 'XI 7'}</strong> (Absen {user?.nomorAbsen || '01'})
          </p>

          <p className="mt-2 text-xs sm:text-sm text-emerald-100 italic">
            &ldquo;Belajar menilai, belajar memperbaiki. Berikan masukan yang jujur, santun, dan membangun untuk teman sekelasmu.&rdquo;
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab('tasks')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              <span>Lihat Tugas Penilaian</span>
            </button>
            <button
              onClick={() => onNavigateTab('history')}
              className="px-4 py-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800/80 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs transition-colors inline-flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Riwayat & Masukan Teman</span>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Telah Menilai
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">
              {myAssessmentsGiven.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Teman</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Dinilai Teman
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-heading">
              {myAssessmentsReceived.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Kali</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Rata-Rata Capaian Saya
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
              {avgReceived || '—'}
            </span>
            {avgReceived && (
              <span className="text-xs font-bold text-emerald-600">
                / 4 ({score100Received} / 100)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active Tasks List (Section 11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
              Tugas Penilaian Aktif
            </h3>
            <p className="text-xs text-slate-500">
              Pilih tugas gerak yang ditugaskan oleh guru untuk mulai mengamati dan menilai temanmu
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-3xl border border-slate-200 text-slate-400 text-sm">
            Saat ini belum ada tugas penilaian aktif untuk kelasmu.
          </div>
        ) : (
          tasks.map((task) => {
            // Count how many peers this student has already evaluated for this task
            const evaluatedCount = myAssessmentsGiven.filter((a) => a.taskId === task.id).length;
            const requiredCount = task.jumlahTemanDinilai || 2;
            const isCompleted = evaluatedCount >= requiredCount;

            return (
              <div
                key={task.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                      Kelas {task.kelas}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                      Materi: {task.materi}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tugas Selesai ({evaluatedCount}/{requiredCount})</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Perlu Menilai ({evaluatedCount}/{requiredCount})</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {task.nama}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    <strong className="text-slate-700">Instruksi: </strong>
                    {task.instruksi}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Batas Waktu: <strong>{task.batasWaktu}</strong>
                    </span>
                    <span>•</span>
                    <span>{task.indikatorIds.length} Indikator Gerak</span>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0">
                  <button
                    onClick={() => onStartAssessment(task)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>{isCompleted ? 'Nilai Teman Lain' : 'Mulai Menilai'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ethics & Peer Assessment Guide Card (Section 26) */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-teal-50 to-emerald-50 border border-emerald-200/70 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-extrabold text-slate-900 text-sm font-heading">
            Etika Penilaian Antar Teman PJOK
          </h4>
          <p className="text-slate-600 leading-relaxed">
            1. Nilailah gerakan teman berdasarkan <strong>indikator gerak sebenarnya</strong>, bukan karena kedekatan pertemanan.
          </p>
          <p className="text-slate-600 leading-relaxed">
            2. Tuliskan masukan yang <strong>santun, positif, dan membangun</strong> agar temanmu tahu bagian mana yang perlu diperbaiki.
          </p>
        </div>
      </div>
    </div>
  );
};
