import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { HealthcareRecord } from '../types/healthcare';

const COLUMN_MAP: Record<string, keyof HealthcareRecord> = {
  'Patient ID': 'patientId',
  'Full Name': 'fullName',
  Age: 'age',
  Gender: 'gender',
  'Date of Birth': 'dateOfBirth',
  'Blood Type': 'bloodType',
  Religion: 'religion',
  'Marital Status': 'maritalStatus',
  Occupation: 'occupation',
  'Education Level': 'educationLevel',
  Division: 'division',
  District: 'district',
  'Height (cm)': 'heightCm',
  'Weight (kg)': 'weightKg',
  BMI: 'bmi',
  'BMI Category': 'bmiCategory',
  'Systolic BP (mmHg)': 'systolicBp',
  'Diastolic BP (mmHg)': 'diastolicBp',
  'BP Status': 'bpStatus',
  'Pulse Rate (bpm)': 'pulseRate',
  'Body Temp (°C)': 'bodyTemp',
  'SpO2 (%)': 'spo2',
  'Blood Glucose (mg/dL)': 'bloodGlucose',
  'Haemoglobin (g/dL)': 'haemoglobin',
  'Primary Disease': 'primaryDisease',
  'Disease Category': 'diseaseCategory',
  Symptoms: 'symptoms',
  Comorbidity: 'comorbidity',
  Allergy: 'allergy',
  'Vaccination Status': 'vaccinationStatus',
  'Smoking Status': 'smokingStatus',
  'Alcohol Use': 'alcoholUse',
  'Exercise Frequency': 'exerciseFrequency',
  'Diet Type': 'dietType',
  Insurance: 'insurance',
  'Treating Hospital': 'treatingHospital',
  'Attending Doctor': 'attendingDoctor',
  'Ward / Unit': 'wardUnit',
  'Treatment Plan': 'treatmentPlan',
  Referral: 'referral',
  Outcome: 'outcome',
  'Admission Date': 'admissionDate',
  'Discharge Date': 'dischargeDate',
  'Length of Stay (days)': 'lengthOfStay',
  'Follow-up Date': 'followUpDate',
  'Monthly Income (BDT)': 'monthlyIncomeBdt',
  'Family Members': 'familyMembers',
  Notes: 'notes',
};

const NUMERIC_FIELDS: Array<keyof HealthcareRecord> = [
  'age',
  'heightCm',
  'weightKg',
  'bmi',
  'systolicBp',
  'diastolicBp',
  'pulseRate',
  'bodyTemp',
  'spo2',
  'bloodGlucose',
  'haemoglobin',
  'lengthOfStay',
  'monthlyIncomeBdt',
  'familyMembers',
];

function normalizeRow(raw: Record<string, unknown>): HealthcareRecord {
  const record: Record<string, string | number> = {};

  for (const [sourceKey, targetKey] of Object.entries(COLUMN_MAP)) {
    const value = raw[sourceKey] ?? raw[sourceKey.replace('°', '�')] ?? '';
    record[targetKey] = NUMERIC_FIELDS.includes(targetKey)
      ? Number(value) || 0
      : String(value ?? '').trim();
  }

  return record as unknown as HealthcareRecord;
}

function parseWorkbookRows(rows: Record<string, unknown>[]): HealthcareRecord[] {
  return rows.map(normalizeRow).filter((row) => row.patientId);
}

export function mapRowsToHealthcareRecords(
  rows: Record<string, unknown>[],
): HealthcareRecord[] {
  return parseWorkbookRows(rows);
}

export async function loadHealthcareData(): Promise<HealthcareRecord[]> {
  const xlsxResponse = await fetch('/Healthcare_Data_500.xlsx');
  if (xlsxResponse.ok) {
    const buffer = await xlsxResponse.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames.find((name) =>
      name.toLowerCase().includes('healthcare'),
    ) ?? workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[sheetName],
    );
    return parseWorkbookRows(rows);
  }

  const csvResponse = await fetch('/Healthcare_Data_500.xlsx - Healthcare Data.csv');
  if (!csvResponse.ok) {
    throw new Error('Unable to load healthcare dataset from public folder.');
  }

  const csvText = await csvResponse.text();
  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? 'Failed to parse CSV file.');
  }

  return parseWorkbookRows(parsed.data);
}
