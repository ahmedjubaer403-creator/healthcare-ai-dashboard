import {
  Activity,
  Clock3,
  Droplets,
  Heart,
  Percent,
  Scale,
  Users,
  Wind,
} from 'lucide-react';
import type { DashboardKPIs } from '../../types/healthcare';

interface KPICardsProps {
  kpis: DashboardKPIs;
}

const KPI_CONFIG = [
  {
    key: 'totalPatients' as const,
    label: 'Total Patients',
    icon: Users,
    format: (v: number) => v.toLocaleString(),
    suffix: '',
  },
  {
    key: 'averageAge' as const,
    label: 'Average Age',
    icon: Activity,
    format: (v: number) => v.toFixed(1),
    suffix: ' yrs',
  },
  {
    key: 'averageLengthOfStay' as const,
    label: 'Avg Length of Stay',
    icon: Clock3,
    format: (v: number) => v.toFixed(1),
    suffix: ' days',
  },
  {
    key: 'averageBmi' as const,
    label: 'Average BMI',
    icon: Scale,
    format: (v: number) => v.toFixed(1),
    suffix: '',
  },
  {
    key: 'averageBloodGlucose' as const,
    label: 'Avg Blood Glucose',
    icon: Droplets,
    format: (v: number) => v.toFixed(0),
    suffix: ' mg/dL',
  },
  {
    key: 'averageSpo2' as const,
    label: 'Average SpO2',
    icon: Wind,
    format: (v: number) => v.toFixed(1),
    suffix: '%',
  },
  {
    key: 'hypertensionRate' as const,
    label: 'Hypertension Rate',
    icon: Heart,
    format: (v: number) => v.toFixed(1),
    suffix: '%',
  },
  {
    key: 'obesityRate' as const,
    label: 'Obesity / Overweight',
    icon: Percent,
    format: (v: number) => v.toFixed(1),
    suffix: '%',
  },
];

export function KPICards({ kpis }: KPICardsProps) {
  return (
    <section className="kpi-grid">
      {KPI_CONFIG.map(({ key, label, icon: Icon, format, suffix }) => (
        <article key={key} className="kpi-card">
          <div className="kpi-icon">
            <Icon size={20} />
          </div>
          <div>
            <p className="kpi-label">{label}</p>
            <p className="kpi-value">
              {format(kpis[key])}
              {suffix}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
