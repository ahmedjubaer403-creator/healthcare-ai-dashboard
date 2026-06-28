import type { DataPreviewModel, DataQualityMetrics } from '../types/dataPreview';

const PREVIEW_ROW_LIMIT = 100;

function isMissingValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number' && Number.isNaN(value)) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  return false;
}

function rowSignature(row: Record<string, unknown>): string {
  const keys = Object.keys(row).sort();
  return JSON.stringify(keys.map((key) => [key, row[key]]));
}

export function getDetectedColumns(rows: Record<string, unknown>[]): string[] {
  if (rows.length === 0) return [];

  const columns = [...Object.keys(rows[0])];
  const columnSet = new Set(columns);

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!columnSet.has(key)) {
        columnSet.add(key);
        columns.push(key);
      }
    }
  }

  return columns;
}

export function countDuplicateRows(rows: Record<string, unknown>[]): number {
  const uniqueRows = new Set(rows.map(rowSignature));
  return rows.length - uniqueRows.size;
}

export function getMissingValuesPerColumn(
  rows: Record<string, unknown>[],
  columns: string[],
): Record<string, number> {
  const missingValues: Record<string, number> = {};

  for (const column of columns) {
    missingValues[column] = rows.reduce(
      (count, row) => count + (isMissingValue(row[column]) ? 1 : 0),
      0,
    );
  }

  return missingValues;
}

export function calculateDataQuality(
  rows: Record<string, unknown>[],
): DataQualityMetrics {
  const columns = getDetectedColumns(rows);

  return {
    totalRows: rows.length,
    totalColumns: columns.length,
    duplicateRows: countDuplicateRows(rows),
    missingValuesPerColumn: getMissingValuesPerColumn(rows, columns),
  };
}

export function buildDataPreviewModel(
  rows: Record<string, unknown>[],
): DataPreviewModel {
  const columns = getDetectedColumns(rows);
  const quality = calculateDataQuality(rows);

  return {
    columns,
    previewRows: rows.slice(0, PREVIEW_ROW_LIMIT),
    quality,
  };
}

export { PREVIEW_ROW_LIMIT };
