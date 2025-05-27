import { Message } from '@/types/chat';
import { UserIcon } from '@heroicons/react/24/solid';
import LoadingDots from './LoadingDots';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const showLoading = !isUser && !message.content;
  
  return (
    <div className={`py-6 rounded-lg ${
      isUser 
        ? 'bg-user-message-light dark:bg-user-message-dark' 
        : 'bg-assistant-message-light dark:bg-assistant-message-dark'
    }`}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-start">
          <div className="w-8 h-8 shrink-0 mt-1 mr-6">
            {isUser ? (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-500 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">AI</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {showLoading ? (
              <LoadingDots />
            ) : (
              <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 