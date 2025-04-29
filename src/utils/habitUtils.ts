
import { format, isToday, subDays, parseISO, isSameDay, differenceInDays, isAfter } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { 
  Habit, 
  HabitLog, 
  HabitWithStats, 
  StatsPeriod,
  Category,
  Achievement
} from "../types";
import { 
  getHabits, 
  getHabitLogs, 
  getHabitLogsForHabit,
  saveHabitLog,
  unlockAchievement,
  getAchievements
} from "./storageUtils";

export const createHabit = (
  name: string,
  description: string,
  category: Category,
  frequency: 'daily' | 'weekly' | 'monthly'
): Habit => {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name,
    description,
    category,
    frequency,
    createdAt: now,
    updatedAt: now
  };
};

export const createHabitLog = (
  habitId: string,
  completed: boolean,
  date: Date = new Date(),
  notes?: string
): HabitLog => {
  return {
    id: uuidv4(),
    habitId,
    completed,
    date: format(date, 'yyyy-MM-dd'),
    notes
  };
};

export const toggleHabitCompletion = (habitId: string, date: Date = new Date()): HabitLog => {
  const dateString = format(date, 'yyyy-MM-dd');
  const logs = getHabitLogs();
  const existingLog = logs.find(log => log.habitId === habitId && log.date === dateString);
  
  const newLog = existingLog
    ? { ...existingLog, completed: !existingLog.completed }
    : createHabitLog(habitId, true, date);
  
  saveHabitLog(newLog);
  
  // Check for achievements
  checkAchievements(habitId);
  
  return newLog;
};

export const getHabitStreak = (habitId: string): number => {
  const logs = getHabitLogsForHabit(habitId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (logs.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  const today = format(currentDate, 'yyyy-MM-dd');
  
  // Check if the most recent log is from today or yesterday
  const mostRecentLog = logs[0];
  if (mostRecentLog.date !== today && differenceInDays(currentDate, parseISO(mostRecentLog.date)) > 1) {
    // The most recent log is older than yesterday, so the streak is broken
    return 0;
  }
  
  // If no log for today, check if there's one for yesterday
  if (mostRecentLog.date !== today) {
    const yesterdayLog = logs.find(log => 
      log.date === format(subDays(currentDate, 1), 'yyyy-MM-dd') && log.completed
    );
    
    if (!yesterdayLog) return 0;
  } else if (!mostRecentLog.completed) {
    // Today's log exists but is not completed
    return 0;
  }
  
  // Count consecutive days backwards
  for (let i = 0; i <= logs.length; i++) {
    const checkDate = format(subDays(currentDate, i), 'yyyy-MM-dd');
    const log = logs.find(l => l.date === checkDate);
    
    if (log && log.completed) {
      streak++;
    } else if (i === 0 && !log) {
      // No log for today, don't break streak but don't count it
      continue;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getCompletionRate = (habitId: string, period: StatsPeriod = 'all'): number => {
  const logs = getHabitLogsForHabit(habitId);
  
  if (logs.length === 0) return 0;
  
  let filteredLogs = [...logs];
  
  if (period !== 'all') {
    const cutoffDate = getCutoffDate(period);
    filteredLogs = logs.filter(log => isAfter(parseISO(log.date), cutoffDate));
  }
  
  if (filteredLogs.length === 0) return 0;
  
  const completedCount = filteredLogs.filter(log => log.completed).length;
  return Math.round((completedCount / filteredLogs.length) * 100);
};

export const getTodayCompletionStatus = (habitId: string): boolean => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLog = getHabitLogs().find(log => log.habitId === habitId && log.date === today);
  return !!todayLog && todayLog.completed;
};

export const enrichHabitsWithStats = (habits: Habit[]): HabitWithStats[] => {
  return habits.map(habit => ({
    ...habit,
    streak: getHabitStreak(habit.id),
    completionRate: getCompletionRate(habit.id, 'all'),
    todayCompleted: getTodayCompletionStatus(habit.id)
  }));
};

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    health: 'bg-habit-health',
    work: 'bg-habit-work',
    learning: 'bg-habit-learning',
    social: 'bg-habit-social',
    creativity: 'bg-habit-creativity',
    mindfulness: 'bg-habit-mindfulness',
    finance: 'bg-habit-finance'
  };
  
  return colors[category] || 'bg-gray-400';
};

export const getCategoryName = (category: Category): string => {
  const names: Record<Category, string> = {
    health: 'Health & Fitness',
    work: 'Work & Productivity',
    learning: 'Education & Skills',
    social: 'Social & Relationships',
    creativity: 'Creative & Hobbies',
    mindfulness: 'Mindfulness & Wellbeing',
    finance: 'Finance & Resources'
  };
  
  return names[category] || 'Other';
};

const getCutoffDate = (period: StatsPeriod): Date => {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return subDays(now, 7);
    case 'month':
      return subDays(now, 30);
    case 'year':
      return subDays(now, 365);
    default:
      return new Date(0); // Beginning of time
  }
};

export const checkAchievements = (habitId: string): Achievement[] => {
  const habit = getHabits().find(h => h.id === habitId);
  if (!habit) return [];
  
  const streak = getHabitStreak(habitId);
  const achievements = getAchievements();
  const unlockedAchievements: Achievement[] = [];
  
  // Check streak achievements
  const streakAchievements = achievements.filter(
    a => a.criteria.type === 'streak' && !a.unlockedAt && a.criteria.value <= streak
  );
  
  // Check category achievements
  const categoryLogs = getHabitLogs().filter(
    log => log.completed && getHabits().find(h => h.id === log.habitId)?.category === habit.category
  );
  
  const categoryAchievements = achievements.filter(
    a => a.criteria.type === 'category' && 
         !a.unlockedAt && 
         a.criteria.category === habit.category &&
         a.criteria.value <= categoryLogs.length
  );
  
  // Unlock achievements
  [...streakAchievements, ...categoryAchievements].forEach(achievement => {
    const unlocked = unlockAchievement(achievement.id);
    if (unlocked) unlockedAchievements.push(unlocked);
  });
  
  return unlockedAchievements;
};
