import React, { useState, useEffect } from 'react';
import { StudentTab } from '../components/StudentNav';
import { StudentSidebar } from '../components/StudentSidebar';
import { StudentHome } from './student/StudentHome';
import { StudentAssessmentForm } from './student/StudentAssessmentForm';
import { StudentHistory } from './student/StudentHistory';
import { StudentProfile } from './student/StudentProfile';
import { AssessmentTask, AssessmentRecord } from '../types';
import { DatabaseService, subscribeToDataChanges } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface StudentViewProps {
  isSidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}

export const StudentView: React.FC<StudentViewProps> = ({
  isSidebarOpen = false,
  onCloseSidebar = () => {}
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<StudentTab>('home');
  const [activeTaskForForm, setActiveTaskForForm] = useState<AssessmentTask | null>(null);
  const [editingRecord, setEditingRecord] = useState<AssessmentRecord | null>(null);

  const [tasks, setTasks] = useState<AssessmentTask[]>([]);
  const [myAssessments, setMyAssessments] = useState<AssessmentRecord[]>([]);

  const loadData = async () => {
    if (!user) return;
    const [allTasks, allAssessments] = await Promise.all([
      DatabaseService.getTasks(),
      DatabaseService.getAssessments()
    ]);

    const userClass = (user.kelas || 'XI 7').toLowerCase();
    const relevantTasks = allTasks.filter(
      (t) => t.kelas.toLowerCase() === userClass && t.status === 'aktif'
    );
    setTasks(relevantTasks);

    const mine = allAssessments.filter(
      (a) =>
        a.assessorUserId === user.uid ||
        a.assessorName.toLowerCase() === user.nama.toLowerCase()
    );
    setMyAssessments(mine);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToDataChanges(loadData);
    return () => unsub();
  }, [user]);

  // Calculate pending tasks count
  const pendingCount = tasks.reduce((acc, t) => {
    const doneCount = myAssessments.filter((a) => a.taskId === t.id).length;
    const req = t.jumlahTemanDinilai || 2;
    return doneCount < req ? acc + 1 : acc;
  }, 0);

  const handleStartAssessment = (task: AssessmentTask, recordToEdit?: AssessmentRecord) => {
    setActiveTaskForForm(task);
    setEditingRecord(recordToEdit || null);
  };

  const handleFormBack = () => {
    setActiveTaskForForm(null);
    setEditingRecord(null);
  };

  const handleFormSuccess = () => {
    setActiveTaskForForm(null);
    setEditingRecord(null);
    setCurrentTab('home');
  };

  // If student is currently filling out an assessment form
  if (activeTaskForForm) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex">
        <StudentSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setActiveTaskForForm(null);
            setEditingRecord(null);
            setCurrentTab(tab);
          }}
          isOpen={isSidebarOpen}
          onClose={onCloseSidebar}
          pendingTaskCount={pendingCount}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
          <StudentAssessmentForm
            task={activeTaskForForm}
            existingRecord={editingRecord}
            onBack={handleFormBack}
            onSuccess={handleFormSuccess}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex">
      {/* Student Sidebar for Desktop & Mobile Toggle */}
      <StudentSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
        pendingTaskCount={pendingCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {currentTab === 'home' && (
            <StudentHome
              onNavigateTab={setCurrentTab}
              onStartAssessment={(task) => handleStartAssessment(task)}
            />
          )}

          {currentTab === 'tasks' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                  Daftar Tugas Penilaian Kelas {user?.kelas || 'XI 7'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pilih tugas penilaian gerak di bawah ini untuk menilai teman sekelas
                </p>
              </div>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-sm">
                    Belum ada tugas aktif untuk kelasmu.
                  </div>
                ) : (
                  tasks.map((task) => {
                    const evaluatedCount = myAssessments.filter((a) => a.taskId === task.id).length;
                    const reqCount = task.jumlahTemanDinilai || 2;
                    const isDone = evaluatedCount >= reqCount;

                    return (
                      <div
                        key={task.id}
                        className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                              Kelas {task.kelas}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                              Materi: {task.materi}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {isDone
                                ? `Selesai (${evaluatedCount}/${reqCount} Teman)`
                                : `Belum Selesai (${evaluatedCount}/${reqCount} Teman)`}
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                            {task.nama}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-2">
                            {task.instruksi}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Batas: {task.batasWaktu}
                            </span>
                            <span>•</span>
                            <span>{task.indikatorIds.length} Indikator Gerak</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartAssessment(task)}
                          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all self-end md:self-center shrink-0 cursor-pointer"
                        >
                          <span>{isDone ? 'Nilai Teman Lain' : 'Mulai Menilai'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {currentTab === 'history' && (
            <StudentHistory
              onEditAssessment={(record, task) => handleStartAssessment(task, record)}
            />
          )}

          {currentTab === 'profile' && <StudentProfile />}
        </main>
      </div>
    </div>
  );
};
