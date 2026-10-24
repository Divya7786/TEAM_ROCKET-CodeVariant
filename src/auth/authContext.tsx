/**
 * ⚠️  DEMO AUTHENTICATION — NOT PRODUCTION READY ⚠️
 *
 * This module provides FRONTEND-ONLY prototype authentication.
 * It uses hardcoded credentials compared in-memory.
 * It does NOT provide real security — anyone who reads the source code
 * can log in. Route protection here only hides UI; it does not protect data.
 *
 * HOW TO REPLACE WITH REAL AUTH (Supabase example):
 * --------------------------------------------------
 *  1. npm install @supabase/supabase-js
 *  2. Create a Supabase project → enable Email/Password auth.
 *  3. Add to your .env file (NEVER commit this):
 *       VITE_SUPABASE_URL=https://xxx.supabase.co
 *       VITE_SUPABASE_ANON_KEY=eyJhb...          (anon key only — public is fine)
 *  4. Replace login() below with:
 *       const { error } = await supabase.auth.signInWithPassword({ email, password })
 *  5. Replace logout() with:
 *       await supabase.auth.signOut()
 *  6. Use Supabase Row Level Security (RLS) for actual data protection.
 *  7. NEVER put the service-role (secret) key in any frontend file.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Demo credentials ────────────────────────────────────────────────────────
// These are intentionally visible — this is a demo prototype.
// Replace this entire block when wiring up real auth.
export const DEMO_CREDENTIALS = {
  email: 'admin@graveyard.dev',
  username: 'admin',
  password: 'ghost1234',
  displayName: 'Alex — Graveyard Admin',
  role: 'Admin',
} as const;
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'graveyard_admin_session_v1';

export type AppView = 'login' | 'admin' | 'app';

export interface AdminSession {
  email: string;
  displayName: string;
  role: string;
  loginTime: number;
  remember: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  session: AdminSession | null;
  currentView: AppView;
  login: (identifier: string, password: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  navigateToApp: () => void;
  navigateToAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

function saveSession(session: AdminSession, remember: boolean) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(() => loadSession());
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const s = loadSession();
    return s ? 'admin' : 'login';
  });

  const isAuthenticated = session !== null;

  useEffect(() => {
    if (!isAuthenticated && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [isAuthenticated, currentView]);

  const login = useCallback(async (
    identifier: string,
    password: string,
    remember: boolean,
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate async network delay for realistic UX
    await new Promise((r) => setTimeout(r, 800));

    const emailMatch = identifier.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase();
    const usernameMatch = identifier.trim().toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase();
    const passwordMatch = password === DEMO_CREDENTIALS.password;

    if (!(emailMatch || usernameMatch) || !passwordMatch) {
      return { success: false, error: 'Invalid credentials. Check the demo hints below.' };
    }

    const newSession: AdminSession = {
      email: DEMO_CREDENTIALS.email,
      displayName: DEMO_CREDENTIALS.displayName,
      role: DEMO_CREDENTIALS.role,
      loginTime: Date.now(),
      remember,
    };

    saveSession(newSession, remember);
    setSession(newSession);
    setCurrentView('admin');
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setCurrentView('login');
  }, []);

  const navigateToApp = useCallback(() => {
    if (isAuthenticated) setCurrentView('app');
  }, [isAuthenticated]);

  const navigateToAdmin = useCallback(() => {
    if (isAuthenticated) setCurrentView('admin');
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      session,
      currentView,
      login,
      logout,
      navigateToApp,
      navigateToAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
