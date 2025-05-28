import { Message } from '@/types/chat';
import { UserIcon } from '@heroicons/react/24/solid';
import LoadingDots from './LoadingDots';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from 'mermaid-react';
import { useEffect, useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const showLoading = !isUser && !message.content;
  const [mermaidCharts, setMermaidCharts] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isUser && message.content) {
      // Extract Mermaid diagrams from the message
      const regex = /```mermaid\n([\s\S]*?)```/g;
      const charts: string[] = [];
      let match;
      
      while ((match = regex.exec(message.content)) !== null) {
        charts.push(match[1].trim());
      }
      
      setMermaidCharts(charts);
    }
  }, [message.content, isUser]);

  const renderContent = () => {
    if (showLoading) {
      return <LoadingDots />;
    }

    // For user messages, just show plain text
    if (isUser) {
      return <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{message.content}</p>;
    }

    // For AI messages, render markdown and handle Mermaid diagrams
    const contentWithoutMermaid = message.content.replace(/```mermaid\n[\s\S]*?```/g, '');

    return (
      <div className="space-y-4">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          className="prose dark:prose-invert max-w-none"
        >
          {contentWithoutMermaid}
        </ReactMarkdown>
        
        {mermaidCharts.map((chart, index) => (
          <div key={index} className="my-4 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <Mermaid chart={chart} />
          </div>
        ))}
      </div>
    );
  };
  
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
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 