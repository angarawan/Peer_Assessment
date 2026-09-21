import React from 'react';
import { Home, ClipboardCheck, History, User } from 'lucide-react';

export type StudentTab = 'home' | 'tasks' | 'history' | 'profile';

interface StudentNavProps {
  currentTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
  pendingTaskCount?: number;
}

export const StudentNav: React.FC<StudentNavProps> = ({
  currentTab,
  onSelectTab,
  pendingTaskCount = 0
}) => {
  const tabs: Array<{
    id: StudentTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'tasks', label: 'Tugas', icon: ClipboardCheck, badge: pendingTaskCount },
    { id: 'history', label: 'Riwayat', icon: History },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <>
      {/* Top / Desktop Segmented Nav for Student */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-start gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.badge && t.badge > 0 ? (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                      isActive ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {t.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Fixed Bar for easy thumb navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 pb-safe">
        <div className="grid grid-cols-4 h-16">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-500 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {t.badge && t.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {t.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px]">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
