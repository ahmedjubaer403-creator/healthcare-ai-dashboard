export interface DataQualityMetrics {
  totalRows: number;
  totalColumns: number;
  duplicateRows: number;
  missingValuesPerColumn: Record<string, number>;
}

export interface DataPreviewModel {
  columns: string[];
  previewRows: Record<string, unknown>[];
  quality: DataQualityMetrics;
}
