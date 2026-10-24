/**
 * ⚠️  DEMO AUTHENTICATION — NOT PRODUCTION READY ⚠️
 *
 * This module provides FRONTEND-ONLY prototype authentication.
 * Credentials are hardcoded and compared in-memory.
 * Anyone who reads the source code can log in.
 * Route protection here only hides UI — it does NOT protect data.
 *
 * ── HOW TO REPLACE WITH REAL AUTH (Supabase) ──────────────────────────────
 *  1.  npm install @supabase/supabase-js
 *  2.  Create a Supabase project → Authentication → enable Email/Password.
 *  3.  Create .env (never commit it):
 *        VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
 *        VITE_SUPABASE_ANON_KEY=eyJhbGci...    ← anon/public key only
 *  4.  Replace login() with:
 *        const { error } = await supabase.auth.signInWithPassword({ email, password })
 *  5.  Replace logout() with:
 *        await supabase.auth.signOut()
 *  6.  Protect data with Supabase Row Level Security (RLS) policies.
 *  7.  NEVER put the service-role (secret) key in any frontend file.
 * ──────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Demo credentials ────────────────────────────────────────────────────────
// Intentionally visible — this is a prototype. Replace when using real auth.
export const DEMO_CREDENTIALS = {
  email: 'admin@graveyard.dev',
  username: 'admin',
  password: 'ghost1234',
  displayName: 'Alex — Graveyard Admin',
  role: 'Admin',
} as const;
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'graveyard_admin_session_v1';

export type AppView = 'app' | 'login';

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
  navigateToLogin: () => void;
  navigateToApp: () => void;
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
  const initialSession = loadSession();

  const [session, setSession] = useState<AdminSession | null>(initialSession);
  // Default: main app is public. Only show admin/login when explicitly navigated.
  const [currentView, setCurrentView] = useState<AppView>(
    initialSession ? 'app' : 'login',
  );

  const isAuthenticated = session !== null;

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
    setCurrentView('app');
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setCurrentView('login');
  }, []);

  const navigateToLogin = useCallback(() => {
    setCurrentView('login');
  }, []);

  const navigateToApp = useCallback(() => {
    setCurrentView('app');
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      session,
      currentView,
      login,
      logout,
      navigateToLogin,
      navigateToApp,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
