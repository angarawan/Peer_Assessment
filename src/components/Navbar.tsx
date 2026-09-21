import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/db';
import { UserProfile } from '../types';
import {
  Activity,
  LogOut,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentUser, role, quickLogin, logout } = useAuth();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    DatabaseService.getUsers().then(setAllUsers);
  }, [showSwitchModal]);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
                aria-label="Buka menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 tracking-tight leading-tight font-heading">
                  PENILAIAN ANTAR TEMAN PJOK
                </h1>
                <p className="text-xs sm:text-sm font-medium text-emerald-600 tracking-normal hidden xs:block">
                  &ldquo;Belajar menilai, belajar memperbaiki&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* User Session & Quick Switcher */}
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Switch Persona for Demo / Evaluation */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(!showSwitchModal)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 transition-colors"
                  title="Ganti Akun Pengujian Cepat"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden md:inline">Ganti Akun Uji</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showSwitchModal && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Pilih Akun Demo Pengujian
                      </p>
                      <p className="text-xs text-slate-500">
                        Beralih peran secara instan untuk mencoba fitur Guru & Murid
                      </p>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {allUsers.map((u) => (
                        <button
                          key={u.uid}
                          type="button"
                          onClick={() => {
                            quickLogin(u.uid);
                            setShowSwitchModal(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                            currentUser.uid === u.uid
                              ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              u.role === 'guru' ? 'bg-indigo-600' : 'bg-emerald-500'
                            }`}>
                              {u.nama.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{u.nama}</p>
                              <p className="text-[11px] text-slate-400">
                                {u.role === 'guru' ? 'Guru / Admin' : `Siswa Kelas ${u.kelas}`}
                              </p>
                            </div>
                          </div>
                          {currentUser.uid === u.uid && (
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current user badge */}
              <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white shadow-xs ${
                  role === 'guru' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {currentUser.nama.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                    {currentUser.nama}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    {role === 'guru' ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md font-semibold">
                        <ShieldCheck className="w-3 h-3" /> Guru PJOK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">
                        <GraduationCap className="w-3 h-3" /> {currentUser.kelas || 'Siswa'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </header>
  );
};
