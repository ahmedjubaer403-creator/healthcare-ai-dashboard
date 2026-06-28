interface DataPreviewTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function DataPreviewTable({ columns, rows, totalRows }: DataPreviewTableProps) {
  return (
    <div className="data-preview-table-wrap">
      <p className="data-preview-caption">
        Showing first {rows.length.toLocaleString()} of {totalRows.toLocaleString()} rows
      </p>
      <div className="data-preview-table-scroll">
        <table className="data-preview-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`}>{formatCellValue(row[column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
