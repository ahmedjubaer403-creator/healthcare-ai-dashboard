export interface AssistantAnswer {
  sourceA: string;
  sourceB: string;
  comparison: string;
  suggestion: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function formatAssistantResponse(answer: AssistantAnswer): string {
  return [
    'Source A:',
    answer.sourceA,
    '',
    'Source B:',
    answer.sourceB,
    '',
    'Comparison:',
    answer.comparison,
    '',
    'Suggested Next Step or Chart:',
    answer.suggestion,
  ].join('\n');
}
