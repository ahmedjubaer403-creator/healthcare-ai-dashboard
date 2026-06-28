import { useCallback, useState } from 'react';
import type { SaveChartInput, SavedChart } from '../types/savedChart';
import {
  addSavedChart,
  getSavedCharts,
  removeSavedChart,
} from '../utils/savedChartsStorage';

export function useSavedCharts() {
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>(() => getSavedCharts());
  const [lastSavedTitle, setLastSavedTitle] = useState<string | null>(null);

  const saveChart = useCallback((input: SaveChartInput) => {
    const chart: SavedChart = {
      id: `chart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: input.title,
      chartType: input.chartType,
      layout: input.layout,
      subtitle: input.subtitle,
      filters: input.filters,
      data: input.data,
      savedAt: new Date().toISOString(),
    };

    const next = addSavedChart(chart);
    setSavedCharts(next);
    setLastSavedTitle(input.title);
    window.setTimeout(() => setLastSavedTitle(null), 2500);
  }, []);

  const deleteChart = useCallback((id: string) => {
    const next = removeSavedChart(id);
    setSavedCharts(next);
  }, []);

  return {
    savedCharts,
    saveChart,
    deleteChart,
    lastSavedTitle,
  };
}
