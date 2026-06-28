import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="collapsible-section">
      <button
        type="button"
        className="collapsible-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{title}</span>
        <ChevronDown size={18} className={`collapsible-icon${isOpen ? ' is-open' : ''}`} />
      </button>
      {isOpen ? <div className="collapsible-content">{children}</div> : null}
    </section>
  );
}
