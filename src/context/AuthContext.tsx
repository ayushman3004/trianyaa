// src/context/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';

export interface UserSession {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: UserSession | null;
  status: AuthStatus;
  login: (user: UserSession) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<UserSession | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refreshSession = useCallback(async (): Promise<UserSession | null> => {
    try {
      const res = await fetch('/api/auth/me', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) {
        setUser(null);
        setStatus('unauthenticated');
        return null;
      }
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        setStatus('authenticated');
        return data.user;
      } else {
        setUser(null);
        setStatus('unauthenticated');
        return null;
      }
    } catch {
      setUser(null);
      setStatus('unauthenticated');
      return null;
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback((userData: UserSession) => {
    setUser(userData);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
      refreshSession,
    }),
    [user, status, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
