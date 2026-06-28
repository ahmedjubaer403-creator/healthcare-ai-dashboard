import type { ChartDatum, FilterState } from './healthcare';

export type SavedChartType = 'bar' | 'pie' | 'line';

export interface SavedChart {
  id: string;
  title: string;
  chartType: SavedChartType;
  layout?: 'horizontal' | 'vertical';
  subtitle?: string;
  filters: FilterState;
  data: ChartDatum[];
  savedAt: string;
}

export interface SaveChartInput {
  title: string;
  chartType: SavedChartType;
  layout?: 'horizontal' | 'vertical';
  subtitle?: string;
  filters: FilterState;
  data: ChartDatum[];
}

export type DashboardTab = 'analytics' | 'saved';
