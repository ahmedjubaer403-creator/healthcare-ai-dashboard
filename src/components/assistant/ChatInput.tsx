import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [question, setQuestion] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setQuestion('');
  }

  return (
    <form className="assistant-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="assistant-input"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask about records, age, gender, diseases, outcomes, missing values..."
        disabled={disabled}
      />
      <button type="submit" className="assistant-send-button" disabled={disabled || !question.trim()}>
        <Send size={16} />
        Send
      </button>
    </form>
  );
}
