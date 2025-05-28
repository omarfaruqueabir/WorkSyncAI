import { useState, useEffect, useCallback } from 'react';
import { ActivityItem } from '@/types/activity';

interface VisibleActivity extends ActivityItem {
  id: string;
  isVisible: boolean;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<VisibleActivity[]>([]);

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

  const removeActivity = useCallback((id: string) => {
    setVisibleActivities(prev => {
      const activityIndex = prev.findIndex(a => a.id === id);
      if (activityIndex === -1) return prev;

      const newActivities = [...prev];
      newActivities[activityIndex] = { ...newActivities[activityIndex], isVisible: false };
      
      // Remove the activity after the fade-out animation
      setTimeout(() => {
        setVisibleActivities(current => current.filter(a => a.id !== id));
      }, 500);

      return newActivities;
    });
  }, []);

  const addActivity = useCallback((activity: ActivityItem) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newVisibleActivity: VisibleActivity = {
      ...activity,
      id,
      isVisible: true,
    };

    setVisibleActivities(prev => [newVisibleActivity, ...prev].slice(0, 5));

    // Remove the activity after 5 seconds
    setTimeout(() => {
      removeActivity(id);
    }, 5000);
  }, [removeActivity]);

  // Function to show activities
  const showActivities = useCallback((items: ActivityItem[]) => {
    if (items.length === 0) return;

    // Add a new activity every 1-3 seconds
    const addRandomActivity = () => {
      const randomIndex = Math.floor(Math.random() * items.length);
      const activity = items[randomIndex];
      addActivity(activity);

      // Schedule next activity
      const delay = 1000 + Math.random() * 2000;
      setTimeout(addRandomActivity, delay);
    };

    addRandomActivity();
  }, [addActivity]);

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
    if (activities.length > 0 && visibleActivities.length === 0) {
      showActivities(activities);
    }
  }, [activities, visibleActivities.length, showActivities]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
      {visibleActivities.map((activity, index) => (
        <div
          key={activity.id}
          className={`
            bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm
            transform transition-all duration-500 ease-in-out
            ${activity.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}
          style={{
            zIndex: visibleActivities.length - index,
            marginBottom: `${index * 0.25}rem`
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {activity.employeeName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {activity.employeeName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activity.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 