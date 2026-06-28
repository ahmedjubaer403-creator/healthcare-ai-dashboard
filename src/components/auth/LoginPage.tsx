import { useState } from 'react';
import type { FormEvent } from 'react';
import { HeartPulse, LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Please enter both username and password.');
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <HeartPulse size={32} />
          <h1>Healthcare Analytics</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError('');
              }}
              autoComplete="username"
              placeholder="Enter username"
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
              autoComplete="current-password"
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-button">
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
