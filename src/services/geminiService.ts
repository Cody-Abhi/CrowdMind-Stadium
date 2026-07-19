import { ApiResponse, ChatMessage } from '../types';

export const geminiService = {
  /**
   * Sends a general prompt to the generation API endpoint.
   */
  async generateContent(prompt: string, systemInstruction?: string): Promise<{ text: string; error?: string }> {
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return { text: data.text || '' };
    } catch (err) {
      return { 
        text: '', 
        error: err instanceof Error ? err.message : 'An error occurred during content generation' 
      };
    }
  },

  /**
   * Pushes a chat message and returns the response from the chat endpoint.
   */
  async sendChatMessage(
    message: string, 
    history: ChatMessage[], 
    context?: { role: string; alertsCount: number }
  ): Promise<{ text: string; error?: string }> {
    try {
      const formattedHistory = history.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: formattedHistory, context })
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return { text: data.text || '' };
    } catch (err) {
      return { 
        text: '', 
        error: err instanceof Error ? err.message : 'An error occurred during chat transmission' 
      };
    }
  },

  /**
   * Queries the natural language RAG index search.
   */
  async queryRag(message: string): Promise<ApiResponse<{ answer: string; citations: any[]; confidence_score: number }>> {
    try {
      const response = await fetch('/api/v1/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const res = await response.json();
      return res;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to query RAG node'
      };
    }
  }
};
