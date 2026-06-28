import type { DataQualityMetrics } from '../../types/dataPreview';

export const EMPTY_DATA_QUALITY: DataQualityMetrics = {
  totalRows: 0,
  totalColumns: 0,
  duplicateRows: 0,
  missingValuesPerColumn: {},
};

interface DataQualitySummaryProps {
  quality: DataQualityMetrics;
  isEmpty?: boolean;
}

export function DataQualitySummary({ quality, isEmpty = false }: DataQualitySummaryProps) {
  const missingEntries = Object.entries(quality.missingValuesPerColumn);

  return (
    <section className="data-quality-card">
      <header className="data-quality-header">
        <h3>Data Quality Summary</h3>
      </header>

      <dl className="data-quality-stats">
        <div className="data-quality-stat">
          <dt>Total Rows</dt>
          <dd>{isEmpty ? '—' : quality.totalRows.toLocaleString()}</dd>
        </div>
        <div className="data-quality-stat">
          <dt>Total Columns</dt>
          <dd>{isEmpty ? '—' : quality.totalColumns.toLocaleString()}</dd>
        </div>
        <div className="data-quality-stat">
          <dt>Duplicate Rows</dt>
          <dd>{isEmpty ? '—' : quality.duplicateRows.toLocaleString()}</dd>
        </div>
      </dl>

      <div className="data-quality-missing">
        <h4>Missing Values Per Column</h4>
        {isEmpty ? (
          <p className="data-quality-empty">No dataset loaded.</p>
        ) : missingEntries.length === 0 ? (
          <p className="data-quality-empty">No columns detected.</p>
        ) : (
          <ul className="data-quality-missing-list">
            {missingEntries.map(([column, count]) => (
              <li key={column}>
                <span className="data-quality-column">{column}</span>
                <span className="data-quality-count">{count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
