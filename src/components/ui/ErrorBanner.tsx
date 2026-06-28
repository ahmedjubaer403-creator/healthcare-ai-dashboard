import { AlertTriangle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="error-banner">
      <AlertTriangle size={20} />
      <span>{message}</span>
    </div>
  );
}
