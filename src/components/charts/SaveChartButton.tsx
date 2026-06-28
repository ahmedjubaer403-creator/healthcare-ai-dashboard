import { BookmarkPlus } from 'lucide-react';

interface SaveChartButtonProps {
  onClick: () => void;
}

export function SaveChartButton({ onClick }: SaveChartButtonProps) {
  return (
    <button type="button" className="save-chart-button" onClick={onClick}>
      <BookmarkPlus size={15} />
      Save Chart
    </button>
  );
}
