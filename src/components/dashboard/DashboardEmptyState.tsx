import { UploadCloud } from 'lucide-react';

export function DashboardEmptyState() {
  return (
    <div className="dashboard-empty-state">
      <UploadCloud size={28} />
      <p>Please upload a CSV or Excel dataset to begin analysis.</p>
    </div>
  );
}
