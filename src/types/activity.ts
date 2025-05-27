export interface ActivityItem {
  employeeId: string;
  employeeName: string;
  description: string;
  timestamp?: Date;
}

export interface ActivityResponse {
  activities: ActivityItem[];
} 