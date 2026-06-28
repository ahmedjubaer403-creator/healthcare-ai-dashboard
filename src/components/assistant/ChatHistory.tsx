import type { ChatMessage } from '../../types/aiAssistant';

interface ChatHistoryProps {
  messages: ChatMessage[];
}

const SECTION_LABELS = [
  'Source A:',
  'Source B:',
  'Comparison:',
  'Suggested Next Step or Chart:',
] as const;

function renderAssistantContent(content: string) {
  const sections = SECTION_LABELS.map((label, index) => {
    const start = content.indexOf(label);
    if (start === -1) return null;

    const nextLabel = SECTION_LABELS[index + 1];
    const end = nextLabel ? content.indexOf(nextLabel) : content.length;
    const body = content.slice(start + label.length, end).trim();

    return (
      <div key={label} className="assistant-section">
        <strong>{label}</strong>
        <p>{body}</p>
      </div>
    );
  }).filter(Boolean);

  if (sections.length === 0) {
    return <p className="assistant-plain-text">{content}</p>;
  }

  return sections;
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  if (messages.length === 0) {
    return (
      <div className="assistant-empty-history">
        <p>Ask a question about your uploaded dataset to begin the analysis.</p>
      </div>
    );
  }

  return (
    <div className="assistant-history">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`assistant-message assistant-message-${message.role}`}
        >
          <header>{message.role === 'user' ? 'You' : 'AI Analytics Assistant'}</header>
          {message.role === 'assistant' ? (
            <div className="assistant-response">{renderAssistantContent(message.content)}</div>
          ) : (
            <p>{message.content}</p>
          )}
        </article>
      ))}
    </div>
  );
}
