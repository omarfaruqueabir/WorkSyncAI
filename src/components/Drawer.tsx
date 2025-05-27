import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
  children: React.ReactNode;
}

export default function Drawer({ children }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out z-30 shadow-lg`}
      >
        {children}
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-40 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${
          isOpen 
            ? 'left-60' 
            : 'left-4'
        }`}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  );
} 