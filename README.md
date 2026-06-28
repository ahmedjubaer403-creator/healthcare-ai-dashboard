# Healthcare Analytics Dashboard

A React + Vite analytics dashboard for the Bangladesh healthcare dataset (`Healthcare_Data_500.xlsx`).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Data source

The app loads `public/Healthcare_Data_500.xlsx` (sheet: **Healthcare Data**) and falls back to a CSV export if present.

## KPI & chart mapping

| UI element | Source column(s) |
|---|---|
| Total Patients | Patient ID |
| Average Age | Age |
| Avg Length of Stay | Length of Stay (days) |
| Average BMI | BMI |
| Avg Blood Glucose | Blood Glucose (mg/dL) |
| Average SpO2 | SpO2 (%) |
| Hypertension Rate | BP Status |
| Obesity / Overweight | BMI Category |
| Disease Category chart | Disease Category |
| Gender chart | Gender |
| Age Distribution | Age (binned) |
| BMI Category chart | BMI Category |
| BP Status chart | BP Status |
| Outcome chart | Outcome |
| Admissions trend | Admission Date |
| Division chart | Division |
| Insurance chart | Insurance |
| Vaccination chart | Vaccination Status |
| Vital averages | Systolic/Diastolic BP, Pulse Rate, SpO2, Blood Glucose, Haemoglobin |

## Stack

- React 19 + TypeScript + Vite
- Recharts, xlsx, PapaParse, Lucide React
