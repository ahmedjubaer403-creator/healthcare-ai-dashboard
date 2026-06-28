export interface HealthcareRecord {
  patientId: string;
  fullName: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  bloodType: string;
  religion: string;
  maritalStatus: string;
  occupation: string;
  educationLevel: string;
  division: string;
  district: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiCategory: string;
  systolicBp: number;
  diastolicBp: number;
  bpStatus: string;
  pulseRate: number;
  bodyTemp: number;
  spo2: number;
  bloodGlucose: number;
  haemoglobin: number;
  primaryDisease: string;
  diseaseCategory: string;
  symptoms: string;
  comorbidity: string;
  allergy: string;
  vaccinationStatus: string;
  smokingStatus: string;
  alcoholUse: string;
  exerciseFrequency: string;
  dietType: string;
  insurance: string;
  treatingHospital: string;
  attendingDoctor: string;
  wardUnit: string;
  treatmentPlan: string;
  referral: string;
  outcome: string;
  admissionDate: string;
  dischargeDate: string;
  lengthOfStay: number;
  followUpDate: string;
  monthlyIncomeBdt: number;
  familyMembers: number;
  notes: string;
}

export interface DashboardKPIs {
  totalPatients: number;
  averageAge: number;
  averageLengthOfStay: number;
  averageBmi: number;
  averageBloodGlucose: number;
  averageSpo2: number;
  hypertensionRate: number;
  obesityRate: number;
}

export interface ChartDatum {
  name: string;
  value: number;
}

export interface FilterState {
  gender: string;
  diseaseCategory: string;
  division: string;
  outcome: string;
}

export const DEFAULT_FILTERS: FilterState = {
  gender: 'All',
  diseaseCategory: 'All',
  division: 'All',
  outcome: 'All',
};
