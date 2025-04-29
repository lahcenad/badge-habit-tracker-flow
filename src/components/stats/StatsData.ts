
import { HabitLog } from "@/types";
import { getHabits } from "@/utils/storageUtils";
import { getCategoryName, getCategoryColor } from "@/utils/habitUtils";
import { format, subDays } from "date-fns";

export interface LogData {
  date: string;
  count: number;
  total: number;
  rate: number;
  formattedDate: string;
}

export const generateChartData = (logs: HabitLog[], days: number): LogData[] => {
  const data: LogData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const dateFormatted = format(date, days <= 7 ? 'EEE' : 'MM/dd');
    
    const dayLogs = logs.filter(log => log.date === dateString);
    const completed = dayLogs.filter(log => log.completed).length;
    
    data.push({
      date: dateString,
      count: completed,
      total: dayLogs.length,
      rate: dayLogs.length > 0 ? Math.round((completed / dayLogs.length) * 100) : 0,
      formattedDate: dateFormatted,
    });
  }
  
  return data;
};

export const generateCategoryData = (logs: HabitLog[]): {name: string, value: number, color: string}[] => {
  const habits = getHabits();
  const categories: Record<string, {count: number, color: string}> = {};
  
  logs.filter(log => log.completed).forEach(log => {
    const habit = habits.find(h => h.id === log.habitId);
    if (habit) {
      const categoryName = getCategoryName(habit.category);
      categories[categoryName] = categories[categoryName] || { 
        count: 0, 
        color: getCategoryColor(habit.category).replace('bg-', '') 
      };
      categories[categoryName].count++;
    }
  });
  
  return Object.entries(categories).map(([name, {count, color}]) => ({
    name,
    value: count,
    color
  }));
};

export const calculateCompletionRate = (logs: HabitLog[]): number => {
  if (logs.length > 0) {
    const completedLogs = logs.filter(log => log.completed);
    return Math.round((completedLogs.length / logs.length) * 100);
  }
  return 0;
};
