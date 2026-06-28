import { Card } from '../ui/Card';
import { ChartRenderer } from './ChartRenderer';
import { SaveChartButton } from './SaveChartButton';

interface VitalAveragesChartProps {
  data: Array<{ name: string; value: number }>;
  onSave?: () => void;
}

export function VitalAveragesChart({ data, onSave }: VitalAveragesChartProps) {
  return (
    <Card
      title="Average Vital Signs"
      subtitle="Systolic/Diastolic BP, Pulse Rate, SpO2, Blood Glucose, Haemoglobin"
      headerAction={onSave ? <SaveChartButton onClick={onSave} /> : undefined}
    >
      <div className="chart-container">
        <ChartRenderer data={data} type="bar" />
      </div>
    </Card>
  );
}
