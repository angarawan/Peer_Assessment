import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/db';
import { AppConfig } from '../types';
import { INITIAL_APP_CONFIG } from '../services/seedData';
import { AppLogo } from '../components/AppLogo';
import {
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Info,
  KeyRound
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AppConfig>(INITIAL_APP_CONFIG);

  useEffect(() => {
    DatabaseService.getAppConfig().then(setConfig);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity.trim()) {
      setError('Silakan masukkan email, nama, atau NIS Anda.');
      return;
    }
    setError(null);
    setLoading(true);
    const res = await login(identity, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Gagal masuk. Periksa kembali email/NIS dan password Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/40 to-indigo-50/50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Dynamic App Logo */}
        <div className="flex justify-center mb-4">
          <AppLogo size="xl" showText={false} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          {config.appName || 'PENILAIAN ANTAR TEMAN PJOK'}
        </h1>
        <p className="mt-1 text-sm font-semibold text-blue-600">
          &ldquo;{config.motto || 'Sportif, Jujur, dan Menghargai Gerak Teman'}&rdquo;
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          {config.schoolName || 'Pendidikan Jasmani, Olahraga, dan Kesehatan'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-7 px-5 sm:px-9 rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 space-y-5">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Username / NIS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="Contoh: guru@pjok.sch.id atau Andi Pratama"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password / Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Memproses Masuk...' : 'MASUK KE APLIKASI'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credential Guide */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Petunjuk Kredensial Login:</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              &bull; <strong>Akun Guru:</strong> <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">guru@pjok.sch.id</code> (password: <code className="bg-white px-1 py-0.5 rounded text-slate-800 font-mono">guru123</code>)
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              &bull; <strong>Akun Murid:</strong> Masukkan NIS (contoh: <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">1001</code>) atau nama (password bawaan: <code className="bg-white px-1 py-0.5 rounded text-slate-800 font-mono">123456</code>)
            </p>
            <p className="text-slate-400 text-[10px] pt-1 border-t border-slate-200">
              * Guru dapat mengubah password guru dan data username murid di menu Pengaturan & Data Murid.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
