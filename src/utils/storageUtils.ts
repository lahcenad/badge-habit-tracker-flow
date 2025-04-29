
import { Habit, HabitLog, Achievement } from "../types";

const HABITS_KEY = 'habit-tracker-habits';
const LOGS_KEY = 'habit-tracker-logs';
const ACHIEVEMENTS_KEY = 'habit-tracker-achievements';

// Habits
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const getHabits = (): Habit[] => {
  const habits = localStorage.getItem(HABITS_KEY);
  return habits ? JSON.parse(habits) : [];
};

export const saveHabit = (habit: Habit): void => {
  const habits = getHabits();
  const existingIndex = habits.findIndex(h => h.id === habit.id);
  
  if (existingIndex >= 0) {
    habits[existingIndex] = habit;
  } else {
    habits.push(habit);
  }
  
  saveHabits(habits);
};

export const removeHabit = (habitId: string): void => {
  const habits = getHabits().filter(h => h.id !== habitId);
  saveHabits(habits);
  
  // Also remove associated logs
  const logs = getHabitLogs().filter(log => log.habitId !== habitId);
  saveHabitLogs(logs);
};

// Habit Logs
export const saveHabitLogs = (logs: HabitLog[]): void => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getHabitLogs = (): HabitLog[] => {
  const logs = localStorage.getItem(LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const saveHabitLog = (log: HabitLog): void => {
  const logs = getHabitLogs();
  const existingIndex = logs.findIndex(l => l.id === log.id);
  
  if (existingIndex >= 0) {
    logs[existingIndex] = log;
  } else {
    logs.push(log);
  }
  
  saveHabitLogs(logs);
};

export const getHabitLogsForDate = (date: string): HabitLog[] => {
  return getHabitLogs().filter(log => log.date === date);
};

export const getHabitLogsForHabit = (habitId: string): HabitLog[] => {
  return getHabitLogs().filter(log => log.habitId === habitId);
};

// Achievements
export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

export const getAchievements = (): Achievement[] => {
  const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  return achievements ? JSON.parse(achievements) : [];
};

export const unlockAchievement = (achievementId: string): Achievement | undefined => {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  
  if (achievement && !achievement.unlockedAt) {
    achievement.unlockedAt = new Date().toISOString();
    saveAchievements(achievements);
    return achievement;
  }
  
  return undefined;
};

export const initializeDefaultData = (): void => {
  // Only initialize if no data exists
  if (getHabits().length === 0) {
    // No need to initialize anything yet, will be done when user adds habits
  }
  
  if (getAchievements().length === 0) {
    const defaultAchievements: Achievement[] = [
      {
        id: "3-day-streak",
        name: "Getting Started",
        description: "Complete a habit for 3 days in a row",
        icon: "trending-up",
        unlockedAt: null,
        criteria: {
          type: "streak",
          value: 3
        }
      },
      {
        id: "7-day-streak",
        name: "Week Warrior",
        description: "Complete a habit for 7 days in a row",
        icon: "calendar-check",
        unlockedAt: null,
        criteria: {
          type: "streak",
          value: 7
        }
      },
      {
        id: "30-day-streak",
        name: "Monthly Master",
        description: "Complete a habit for 30 days in a row",
        icon: "award",
        unlockedAt: null,
        criteria: {
          type: "streak",
          value: 30
        }
      },
      {
        id: "health-5",
        name: "Health Enthusiast",
        description: "Complete health habits 5 times",
        icon: "activity",
        unlockedAt: null,
        criteria: {
          type: "category",
          value: 5,
          category: "health"
        }
      },
      {
        id: "mindfulness-5",
        name: "Mindfulness Guru",
        description: "Complete mindfulness habits 5 times",
        icon: "star",
        unlockedAt: null,
        criteria: {
          type: "category",
          value: 5,
          category: "mindfulness"
        }
      }
    ];
    
    saveAchievements(defaultAchievements);
  }
};
