import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { hasConfig } from '@/lib/firebase';
import { firebaseLogin, firebaseRegister, firebaseLogout, firebaseOnAuth } from '@/lib/firebase-auth';

interface AdminUser {
  username: string;
  email?: string;
}

interface AdminContextType {
  user: AdminUser | null;
  users: AdminUser[];
  login: (username: string, password: string) => Promise<boolean> | boolean;
  register: (username: string, password: string) => Promise<boolean> | boolean;
  logout: () => void;
  isAuthenticated: boolean;
  editContent: (key: string, value: string) => void;
  usingFirebase: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

const DEFAULT_ADMIN = { username: 'admin', password: 'b20admin2024' };

function loadLocalUsers(): { username: string; password: string }[] {
  try {
    const stored = localStorage.getItem('admin_users');
    if (stored) return JSON.parse(stored);
  } catch {}
  return [DEFAULT_ADMIN];
}

function saveLocalUsers(users: { username: string; password: string }[]) {
  localStorage.setItem('admin_users', JSON.stringify(users));
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const usingFirebase = hasConfig;

  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = sessionStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (!usingFirebase) return;
    const unsubscribe = firebaseOnAuth((fbUser) => {
      if (fbUser) {
        const u: AdminUser = { username: fbUser.email || fbUser.uid, email: fbUser.email || undefined };
        setUser(u);
        sessionStorage.setItem('admin_user', JSON.stringify(u));
      } else {
        setUser(null);
        sessionStorage.removeItem('admin_user');
      }
    });
    return unsubscribe;
  }, [usingFirebase]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (usingFirebase) {
      try {
        const fbUser = await firebaseLogin(username, password);
        const u: AdminUser = { username: fbUser.email || fbUser.uid, email: fbUser.email || undefined };
        setUser(u);
        sessionStorage.setItem('admin_user', JSON.stringify(u));
        return true;
      } catch {
        return false;
      }
    }

    const users = loadLocalUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (found) {
      const u: AdminUser = { username };
      setUser(u);
      sessionStorage.setItem('admin_user', JSON.stringify(u));
      return true;
    }
    return false;
  }, [usingFirebase]);

  const register = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (usingFirebase) {
      try {
        await firebaseRegister(username, password);
        return true;
      } catch {
        return false;
      }
    }

    const users = loadLocalUsers();
    if (users.some((u) => u.username === username)) return false;
    users.push({ username, password });
    saveLocalUsers(users);
    return true;
  }, [usingFirebase]);

  const logout = useCallback(() => {
    if (usingFirebase) firebaseLogout();
    setUser(null);
    sessionStorage.removeItem('admin_user');
  }, [usingFirebase]);

  const editContent = useCallback((key: string, value: string) => {
    sessionStorage.setItem(`edit_${key}`, value);
  }, []);

  const localUsers = loadLocalUsers().map(({ username }) => ({ username }));

  return (
    <AdminContext.Provider value={{
      user,
      users: localUsers,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      editContent,
      usingFirebase,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
