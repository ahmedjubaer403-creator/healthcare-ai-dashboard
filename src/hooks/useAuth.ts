import { useCallback, useState } from 'react';
import {
  clearSession,
  getStoredSession,
  saveSession,
  type AuthSession,
} from '../utils/authStorage';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());

  const login = useCallback((username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) return false;
    const nextSession = { username: username.trim() };
    saveSession(nextSession.username);
    setSession(nextSession);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  };
}
