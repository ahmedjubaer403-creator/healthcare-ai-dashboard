import { Eye, Trash2 } from 'lucide-react';
import type { SavedChart } from '../../types/savedChart';
import { ChartRenderer } from '../charts/ChartRenderer';

interface SavedChartCardProps {
  chart: SavedChart;
  onView: (chart: SavedChart) => void;
  onDelete: (id: string) => void;
}

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function SavedChartCard({ chart, onView, onDelete }: SavedChartCardProps) {
  return (
    <article className="saved-chart-card">
      <header className="saved-chart-card-header">
        <div>
          <h3>{chart.title}</h3>
          <p>Saved {formatSavedAt(chart.savedAt)}</p>
        </div>
        <span className="saved-chart-type">{chart.chartType.toUpperCase()}</span>
      </header>

      <div className="saved-chart-preview">
        <ChartRenderer
          data={chart.data}
          type={chart.chartType}
          layout={chart.layout}
          compact
        />
      </div>

      <footer className="saved-chart-actions">
        <button type="button" className="saved-chart-view-button" onClick={() => onView(chart)}>
          <Eye size={15} />
          View
        </button>
        <button
          type="button"
          className="saved-chart-delete-button"
          onClick={() => onDelete(chart.id)}
        >
          <Trash2 size={15} />
          Delete
        </button>
      </footer>
    </article>
  );
}
