import { Bot } from 'lucide-react';
import type { UploadState } from '../../types/upload';
import { useAiAssistant } from '../../hooks/useAiAssistant';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';

interface AiAnalyticsAssistantProps {
  upload: UploadState;
  disabled?: boolean;
}

export function AiAnalyticsAssistant({ upload, disabled = false }: AiAnalyticsAssistantProps) {
  const { messages, sendMessage, canChat } = useAiAssistant(upload.parsedJson, upload.fileName);
  const inputDisabled = disabled || !canChat;

  return (
    <section className="assistant-panel">
      <div className="assistant-panel-header">
        <div className="assistant-title">
          <Bot size={22} />
          <div>
            <h2>AI Analytics Assistant</h2>
            <p>Local analytics assistant powered by your uploaded dataset only.</p>
          </div>
        </div>
      </div>

      {!canChat ? (
        <div className="assistant-placeholder">
          Please upload a dataset before using the AI Assistant.
        </div>
      ) : (
        <ChatHistory messages={messages} />
      )}

      <ChatInput onSend={sendMessage} disabled={inputDisabled} />
    </section>
  );
}
