export default function LoadingDots() {
  return (
    <div className="flex space-x-2 items-center h-6 pt-2">
      <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-[bounce_1.4s_infinite_0ms]"></div>
      <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce-delay-1"></div>
      <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce-delay-2"></div>
    </div>
  );
} 