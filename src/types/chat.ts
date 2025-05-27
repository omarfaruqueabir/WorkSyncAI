export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  role: Role;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
} 