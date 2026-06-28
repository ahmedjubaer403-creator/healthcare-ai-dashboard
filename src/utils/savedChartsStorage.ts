import type { SavedChart } from '../types/savedChart';

const STORAGE_KEY = 'healthcare-dashboard-saved-charts';

export function getSavedCharts(): SavedChart[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedChart[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedCharts(charts: SavedChart[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
}

export function addSavedChart(chart: SavedChart): SavedChart[] {
  const charts = getSavedCharts();
  const next = [chart, ...charts];
  persistSavedCharts(next);
  return next;
}

export function removeSavedChart(id: string): SavedChart[] {
  const next = getSavedCharts().filter((chart) => chart.id !== id);
  persistSavedCharts(next);
  return next;
}
