import { useState, useEffect, useCallback } from 'react';
import { ActivityItem } from '@/types/activity';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [displayedActivity, setDisplayedActivity] = useState<ActivityItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock API call - replace with your actual API call
  const fetchActivities = async () => {
    try {
      // Simulated API response
      const mockResponse = {
        activities: [
          {
            employeeId: "1",
            employeeName: "John Doe",
            description: "Updated the project timeline",
            timestamp: new Date()
          },
          {
            employeeId: "2",
            employeeName: "Jane Smith",
            description: "Completed code review",
            timestamp: new Date()
          }
        ]
      };
      
      return mockResponse.activities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  };

  // Function to show next activity with animation
  const showNextActivity = useCallback((items: ActivityItem[]) => {
    if (items.length === 0) return;

    // Get a random item from the list
    const randomIndex = Math.floor(Math.random() * items.length);
    const nextActivity = items[randomIndex];

    // Show the activity with animation
    setIsVisible(false);
    setTimeout(() => {
      setDisplayedActivity(nextActivity);
      setIsVisible(true);
    }, 500);

    // Schedule next activity display with random delay (3-7 seconds)
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
      showNextActivity(items);
    }, delay);
  }, []);

  // Polling effect
  useEffect(() => {
    const pollActivities = async () => {
      const newActivities = await fetchActivities();
      setActivities(newActivities);
    };

    // Initial fetch
    pollActivities();

    // Set up polling interval (15 seconds)
    const intervalId = setInterval(pollActivities, 15000);

    return () => clearInterval(intervalId);
  }, []);

  // Effect to start showing activities when they're available
  useEffect(() => {
    if (activities.length > 0 && !displayedActivity) {
      showNextActivity(activities);
    }
  }, [activities, displayedActivity, showNextActivity]);

  if (!displayedActivity) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm
          transform transition-all duration-500 ease-in-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {displayedActivity.employeeName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {displayedActivity.employeeName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {displayedActivity.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 