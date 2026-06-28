import { X } from 'lucide-react';
import type { SavedChart } from '../../types/savedChart';
import { ChartRenderer } from '../charts/ChartRenderer';

interface ChartViewModalProps {
  chart: SavedChart | null;
  onClose: () => void;
}

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function ChartViewModal({ chart, onClose }: ChartViewModalProps) {
  if (!chart) return null;

  return (
    <div className="chart-view-modal-backdrop" onClick={onClose}>
      <div
        className="chart-view-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chart-view-title"
      >
        <header className="chart-view-modal-header">
          <div>
            <h2 id="chart-view-title">{chart.title}</h2>
            <p>Saved {formatSavedAt(chart.savedAt)}</p>
          </div>
          <button type="button" className="chart-view-close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <dl className="chart-view-filters">
          <div>
            <dt>Gender</dt>
            <dd>{chart.filters.gender}</dd>
          </div>
          <div>
            <dt>Disease Category</dt>
            <dd>{chart.filters.diseaseCategory}</dd>
          </div>
          <div>
            <dt>Division</dt>
            <dd>{chart.filters.division}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{chart.filters.outcome}</dd>
          </div>
        </dl>

        <div className="chart-view-modal-chart">
          <ChartRenderer
            data={chart.data}
            type={chart.chartType}
            layout={chart.layout}
          />
        </div>
      </div>
    </div>
  );
}
