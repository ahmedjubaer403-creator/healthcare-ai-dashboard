import { Activity } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="loading-state">
      <Activity className="spin-icon" size={32} />
      <p>Loading healthcare dataset…</p>
    </div>
  );
}
