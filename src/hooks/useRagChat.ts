import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

export function useRagChat() {
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Unified Asset & Operations Brain online. System clearance: ENGINEER. Ingestion nodes verified.', confidence: 0.99 }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSendQuery = useCallback(async (textToSubmit?: string) => {
    const text = (textToSubmit || chatInput).trim();
    if (!text || isAiThinking) return;

    setChatLog(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');
    setIsAiThinking(true);

    try {
      const res = await geminiService.queryRag(text);
      if (res.success && res.data) {
        setChatLog(prev => [...prev, {
          sender: 'ai',
          text: res.data!.answer,
          citations: res.data!.citations,
          confidence: res.data!.confidence_score
        }]);
      } else {
        throw new Error(res.error || 'Unknown error');
      }
    } catch (err) {
      setChatLog(prev => [...prev, {
        sender: 'ai',
        text: `Error synchronizing with local RAG node. Fallback active: ${err instanceof Error ? err.message : 'Connection failed.'}`,
        confidence: 0.1
      }]);
    } finally {
      setIsAiThinking(false);
    }
  }, [chatInput, isAiThinking]);

  return {
    chatLog,
    chatInput,
    setChatInput,
    isAiThinking,
    handleSendQuery
  };
}
