import { useState } from 'react';
import { 
  ChatBubbleLeftIcon, 
  PlusIcon, 
  EllipsisHorizontalIcon, 
  TrashIcon, 
  SparklesIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';

interface ChatSidebarProps {
  conversations: {
    id: string;
    preview: string;
    timestamp: Date;
  }[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({ conversations, activeId, onSelect, onNew, onDelete }: ChatSidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === chatId ? null : chatId);
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onDelete(chatId);
    setMenuOpenId(null);
  };

  const handleClickOutside = () => {
    if (menuOpenId) {
      setMenuOpenId(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-2" onClick={handleClickOutside}>
      <div className="flex items-center justify-between px-2 py-4 mb-2 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">WorkSync AI</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>

      <button
        onClick={onNew}
        className="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-white/20 p-4 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
      >
        <PlusIcon className="w-4 h-4" />
        New chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {conversations.map((chat) => (
          <div key={chat.id} className="relative">
            <button
              onClick={() => onSelect(chat.id)}
              className={`w-full flex items-center gap-3 rounded-lg p-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors pr-12 ${
                activeId === chat.id 
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <ChatBubbleLeftIcon className="w-4 h-4 shrink-0" />
              <div className="truncate">{chat.preview}</div>
            </button>
            
            <button
              onClick={(e) => handleMenuClick(e, chat.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>

            {menuOpenId === chat.id && (
              <div className="absolute right-2 top-[calc(100%-10px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={(e) => handleDeleteClick(e, chat.id)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 