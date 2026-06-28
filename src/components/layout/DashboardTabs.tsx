import type { DashboardTab } from '../../types/savedChart';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onChange: (tab: DashboardTab) => void;
  savedCount: number;
}

export function DashboardTabs({ activeTab, onChange, savedCount }: DashboardTabsProps) {
  return (
    <nav className="dashboard-tabs" aria-label="Dashboard sections">
      <button
        type="button"
        className={`dashboard-tab${activeTab === 'analytics' ? ' is-active' : ''}`}
        onClick={() => onChange('analytics')}
      >
        Analytics Dashboard
      </button>
      <button
        type="button"
        className={`dashboard-tab${activeTab === 'saved' ? ' is-active' : ''}`}
        onClick={() => onChange('saved')}
      >
        Saved Charts Dashboard
        {savedCount > 0 ? <span className="dashboard-tab-badge">{savedCount}</span> : null}
      </button>
    </nav>
  );
}
