const AUTH_KEY = 'healthcare-dashboard-auth';

export interface AuthSession {
  username: string;
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    return parsed.username ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(username: string): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username }));
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_KEY);
}
