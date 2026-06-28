import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDatum } from '../../types/healthcare';
import type { SavedChartType } from '../../types/savedChart';

const COLORS = [
  '#0d9488',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#64748b',
  '#475569',
];

interface ChartRendererProps {
  data: ChartDatum[];
  type: SavedChartType;
  layout?: 'horizontal' | 'vertical';
  compact?: boolean;
}

export function ChartRenderer({
  data,
  type,
  layout = 'vertical',
  compact = false,
}: ChartRendererProps) {
  const pieRadius = compact ? 70 : 95;

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'pie' ? (
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={pieRadius}
            label={compact ? false : ({ name, percent }) =>
              `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {!compact ? <Legend /> : null}
        </PieChart>
      ) : type === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: compact ? 10 : 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          {!compact ? <Legend /> : null}
          <Line
            type="monotone"
            dataKey="value"
            name="Admissions"
            stroke="#0d9488"
            strokeWidth={2}
            dot={{ r: compact ? 2 : 3 }}
          />
        </LineChart>
      ) : (
        <BarChart
          data={data}
          layout={layout === 'horizontal' ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 8, left: layout === 'horizontal' ? 80 : 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          {layout === 'horizontal' ? (
            <>
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={compact ? 90 : 120}
                tick={{ fontSize: compact ? 10 : 11 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                tick={{ fontSize: compact ? 10 : 11 }}
                interval={0}
                angle={compact ? 0 : -20}
                textAnchor={compact ? 'middle' : 'end'}
                height={compact ? 50 : 70}
              />
              <YAxis allowDecimals={false} />
            </>
          )}
          <Tooltip />
          <Bar dataKey="value" name="Patients" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
