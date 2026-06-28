import type { FilterState } from '../../types/healthcare';

interface FilterBarProps {
  filters: FilterState;
  options: {
    gender: string[];
    diseaseCategory: string[];
    division: string[];
    outcome: string[];
  };
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

const FILTER_FIELDS: Array<{
  key: keyof FilterState;
  label: string;
  optionKey: keyof FilterBarProps['options'];
}> = [
  { key: 'gender', label: 'Gender', optionKey: 'gender' },
  { key: 'diseaseCategory', label: 'Disease Category', optionKey: 'diseaseCategory' },
  { key: 'division', label: 'Division', optionKey: 'division' },
  { key: 'outcome', label: 'Outcome', optionKey: 'outcome' },
];

export function FilterBar({ filters, options, onChange, resultCount }: FilterBarProps) {
  return (
    <section className="filter-bar">
      <div className="filter-grid">
        {FILTER_FIELDS.map(({ key, label, optionKey }) => (
          <label key={key} className="filter-field">
            <span>{label}</span>
            <select
              value={filters[key]}
              onChange={(event) =>
                onChange({ ...filters, [key]: event.target.value })
              }
            >
              <option value="All">All</option>
              {options[optionKey].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p className="filter-meta">Showing {resultCount} patient records</p>
    </section>
  );
}
