import type {
  ChartDatum,
  DashboardKPIs,
  FilterState,
  HealthcareRecord,
} from '../types/healthcare';

export function applyFilters(
  records: HealthcareRecord[],
  filters: FilterState,
): HealthcareRecord[] {
  return records.filter((record) => {
    if (filters.gender !== 'All' && record.gender !== filters.gender) return false;
    if (filters.diseaseCategory !== 'All' && record.diseaseCategory !== filters.diseaseCategory) {
      return false;
    }
    if (filters.division !== 'All' && record.division !== filters.division) return false;
    if (filters.outcome !== 'All' && record.outcome !== filters.outcome) return false;
    return true;
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateKPIs(records: HealthcareRecord[]): DashboardKPIs {
  const ages = records.map((r) => r.age);
  const los = records.map((r) => r.lengthOfStay);
  const bmis = records.map((r) => r.bmi);
  const glucose = records.map((r) => r.bloodGlucose);
  const spo2 = records.map((r) => r.spo2);

  const hypertensive = records.filter((r) =>
    r.bpStatus.includes('HTN') || r.bpStatus.includes('Elevated'),
  ).length;

  const obese = records.filter((r) =>
    r.bmiCategory === 'Obese' || r.bmiCategory === 'Overweight',
  ).length;

  return {
    totalPatients: records.length,
    averageAge: average(ages),
    averageLengthOfStay: average(los),
    averageBmi: average(bmis),
    averageBloodGlucose: average(glucose),
    averageSpo2: average(spo2),
    hypertensionRate: records.length ? (hypertensive / records.length) * 100 : 0,
    obesityRate: records.length ? (obese / records.length) * 100 : 0,
  };
}

export function groupByField(
  records: HealthcareRecord[],
  field: keyof HealthcareRecord,
): ChartDatum[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    const key = String(record[field] || 'Unknown');
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getAgeDistribution(records: HealthcareRecord[]): ChartDatum[] {
  const bins = [
    { label: '0-17', min: 0, max: 17 },
    { label: '18-34', min: 18, max: 34 },
    { label: '35-49', min: 35, max: 49 },
    { label: '50-64', min: 50, max: 64 },
    { label: '65+', min: 65, max: 200 },
  ];

  return bins.map(({ label, min, max }) => ({
    name: label,
    value: records.filter((r) => r.age >= min && r.age <= max).length,
  }));
}

export function getAdmissionTrend(records: HealthcareRecord[]): ChartDatum[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    if (!record.admissionDate) continue;
    const month = record.admissionDate.slice(0, 7);
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }));
}

export function getVitalAverages(records: HealthcareRecord[]) {
  return [
    { name: 'Systolic BP', value: average(records.map((r) => r.systolicBp)) },
    { name: 'Diastolic BP', value: average(records.map((r) => r.diastolicBp)) },
    { name: 'Pulse Rate', value: average(records.map((r) => r.pulseRate)) },
    { name: 'SpO2', value: average(records.map((r) => r.spo2)) },
    { name: 'Blood Glucose', value: average(records.map((r) => r.bloodGlucose)) },
    { name: 'Haemoglobin', value: average(records.map((r) => r.haemoglobin)) },
  ];
}

export function getUniqueValues(
  records: HealthcareRecord[],
  field: keyof HealthcareRecord,
): string[] {
  return [...new Set(records.map((r) => String(r[field])).filter(Boolean))].sort();
}
