import { Message } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ChatResponse {
  content: string;
  error?: string;
}

export async function sendChatMessage(messages: Message[]): Promise<ChatResponse> {
  try {
    const latestMessage = messages[messages.length - 1];
    console.log("Data:: ", latestMessage?.content || "");

    const response = await fetch(`${API_BASE_URL}/chatbot/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topK: 2,
        query: latestMessage?.content || ""
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get response from server');
    }

    const data = await response.json();

    const result: ChatResponse = {
      content: data.message
    };

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
} 