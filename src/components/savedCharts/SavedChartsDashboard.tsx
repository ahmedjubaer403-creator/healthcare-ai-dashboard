import { useState } from 'react';
import type { SavedChart } from '../../types/savedChart';
import { SavedChartCard } from './SavedChartCard';
import { ChartViewModal } from './ChartViewModal';

interface SavedChartsDashboardProps {
  savedCharts: SavedChart[];
  onDelete: (id: string) => void;
}

export function SavedChartsDashboard({ savedCharts, onDelete }: SavedChartsDashboardProps) {
  const [viewingChart, setViewingChart] = useState<SavedChart | null>(null);

  return (
    <section className="saved-charts-dashboard">
      <header className="saved-charts-dashboard-header">
        <h2>Saved Charts Dashboard</h2>
        <p>Review, view, and manage charts saved from the analytics dashboard.</p>
      </header>

      {savedCharts.length === 0 ? (
        <div className="saved-charts-empty">No saved charts yet.</div>
      ) : (
        <div className="saved-charts-grid">
          {savedCharts.map((chart) => (
            <SavedChartCard
              key={chart.id}
              chart={chart}
              onView={setViewingChart}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <ChartViewModal chart={viewingChart} onClose={() => setViewingChart(null)} />
    </section>
  );
}
