import { useCallback, useMemo, useState } from 'react';
import type { FilterState, HealthcareRecord } from '../types/healthcare';
import { DEFAULT_FILTERS } from '../types/healthcare';
import {
  applyFilters,
  calculateKPIs,
  getAdmissionTrend,
  getAgeDistribution,
  getUniqueValues,
  getVitalAverages,
  groupByField,
} from '../utils/analytics';

export function useHealthcareData() {
  const [records, setRecords] = useState<HealthcareRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const loadRecords = useCallback((newRecords: HealthcareRecord[]) => {
    setRecords(newRecords);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearRecords = useCallback(() => {
    setRecords([]);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredRecords = useMemo(
    () => applyFilters(records, filters),
    [records, filters],
  );

  const hasDataset = records.length > 0;

  const analytics = useMemo(
    () => ({
      kpis: calculateKPIs(filteredRecords),
      diseaseCategory: groupByField(filteredRecords, 'diseaseCategory'),
      gender: groupByField(filteredRecords, 'gender'),
      bmiCategory: groupByField(filteredRecords, 'bmiCategory'),
      bpStatus: groupByField(filteredRecords, 'bpStatus'),
      outcome: groupByField(filteredRecords, 'outcome'),
      division: groupByField(filteredRecords, 'division'),
      insurance: groupByField(filteredRecords, 'insurance'),
      vaccinationStatus: groupByField(filteredRecords, 'vaccinationStatus'),
      ageDistribution: getAgeDistribution(filteredRecords),
      admissionTrend: getAdmissionTrend(filteredRecords),
      vitalAverages: getVitalAverages(filteredRecords),
      filterOptions: {
        gender: getUniqueValues(records, 'gender'),
        diseaseCategory: getUniqueValues(records, 'diseaseCategory'),
        division: getUniqueValues(records, 'division'),
        outcome: getUniqueValues(records, 'outcome'),
      },
    }),
    [filteredRecords, records],
  );

  return {
    records,
    filteredRecords,
    filters,
    setFilters,
    analytics,
    loadRecords,
    clearRecords,
    hasDataset,
  };
}
