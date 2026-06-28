import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', headerAction }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      <header className="card-header">
        <div className="card-header-text">
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {headerAction ? <div className="card-header-action">{headerAction}</div> : null}
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
}
