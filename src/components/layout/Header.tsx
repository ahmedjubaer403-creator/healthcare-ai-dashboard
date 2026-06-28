import { HeartPulse, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <HeartPulse size={28} />
        <div>
          <h1>Healthcare Analytics Dashboard</h1>
          <p>Business intelligence powered by your uploaded healthcare data</p>
        </div>
      </div>
      <button type="button" className="logout-button" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
