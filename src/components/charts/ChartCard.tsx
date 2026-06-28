import { Card } from '../ui/Card';
import { ChartRenderer } from './ChartRenderer';
import { SaveChartButton } from './SaveChartButton';
import type { ChartDatum } from '../../types/healthcare';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartDatum[];
  type: 'bar' | 'pie' | 'line';
  layout?: 'horizontal' | 'vertical';
  onSave?: () => void;
}

export function ChartCard({
  title,
  subtitle,
  data,
  type,
  layout = 'vertical',
  onSave,
}: ChartCardProps) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      headerAction={onSave ? <SaveChartButton onClick={onSave} /> : undefined}
    >
      <div className="chart-container">
        <ChartRenderer data={data} type={type} layout={layout} />
      </div>
    </Card>
  );
}
