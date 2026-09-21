import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { DatabaseService } from '../services/db';
import { INITIAL_USERS } from '../services/seedData';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  user: UserProfile | null;
  role: 'guru' | 'murid' | null;
  loading: boolean;
  login: (identity: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (uid: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setCurrentUser: (user: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_SESSION_KEY = 'pjok_active_session_uid';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      // If Firebase Auth is configured
      if (isFirebaseConfigured() && auth) {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userProfile = await DatabaseService.getUser(firebaseUser.uid);
            if (userProfile) {
              setCurrentUser(userProfile);
            } else {
              // Fallback
              setCurrentUser({
                uid: firebaseUser.uid,
                nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna',
                email: firebaseUser.email || '',
                role: 'guru',
                status: 'aktif'
              });
            }
          } else {
            // Check local storage session
            checkLocalSession();
          }
          setLoading(false);
        });
      } else {
        await checkLocalSession();
        setLoading(false);
      }
    };

    const checkLocalSession = async () => {
      const savedUid = localStorage.getItem(LS_SESSION_KEY);
      if (savedUid) {
        const user = await DatabaseService.getUser(savedUid);
        if (user) {
          setCurrentUser(user);
          return;
        }
      }
      // Default to Guru PJOK for instant testing preview if first launch
      const defaultGuru = INITIAL_USERS[0];
      setCurrentUser(defaultGuru);
      localStorage.setItem(LS_SESSION_KEY, defaultGuru.uid);
    };

    initAuth();
  }, []);

  const login = async (identity: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const cleanIdentity = identity.trim().toLowerCase();

      // Firebase Auth attempt if configured
      if (isFirebaseConfigured() && auth && cleanIdentity.includes('@')) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, cleanIdentity, pass);
          const profile = await DatabaseService.getUser(userCred.user.uid);
          if (profile) {
            setCurrentUser(profile);
            localStorage.setItem(LS_SESSION_KEY, profile.uid);
            return { success: true };
          }
        } catch (e: any) {
          console.warn('Firebase login attempt note:', e?.message);
        }
      }

      // Check users from local database by email, NIS, or nama
      const allUsers = await DatabaseService.getUsers();
      const match = allUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentity ||
          u.nama.toLowerCase() === cleanIdentity ||
          (u.nis && u.nis.toLowerCase() === cleanIdentity)
      );

      if (match) {
        if (match.status === 'nonaktif') {
          return { success: false, message: 'Akun Anda berstatus nonaktif. Hubungi Guru PJOK.' };
        }
        setCurrentUser(match);
        localStorage.setItem(LS_SESSION_KEY, match.uid);
        return { success: true };
      }

      return {
        success: false,
        message: 'Pengguna tidak ditemukan. Masukkan email, nama, atau NIS yang terdaftar.'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Terjadi kesalahan saat masuk' };
    }
  };

  const quickLogin = async (uid: string): Promise<boolean> => {
    const user = await DatabaseService.getUser(uid);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(LS_SESSION_KEY, user.uid);
      return true;
    }
    return false;
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Signout error', e);
      }
    }
    localStorage.removeItem(LS_SESSION_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        role: currentUser?.role || null,
        loading,
        login,
        quickLogin,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
