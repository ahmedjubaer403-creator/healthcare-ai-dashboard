import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types/aiAssistant';
import { analyzeQuestion } from '../utils/aiAnalyticsEngine';

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export function useAiAssistant(
  parsedRows: Record<string, unknown>[] | null,
  fileName: string | null,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const previousFileRef = useRef<string | null>(null);

  useEffect(() => {
    if (fileName !== previousFileRef.current) {
      setMessages([]);
      previousFileRef.current = fileName;
    }
  }, [fileName]);

  const sendMessage = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || !parsedRows?.length) return;

      const userMessage = createMessage('user', trimmed);
      const assistantMessage = createMessage(
        'assistant',
        analyzeQuestion(trimmed, parsedRows),
      );

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
    },
    [parsedRows],
  );

  return {
    messages,
    sendMessage,
    canChat: Boolean(parsedRows?.length),
  };
}
