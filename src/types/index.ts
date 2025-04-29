
export type Category = 
  | 'health' 
  | 'work' 
  | 'learning' 
  | 'social' 
  | 'creativity' 
  | 'mindfulness' 
  | 'finance';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: Category;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  completed: boolean;
  date: string; // ISO date string 'YYYY-MM-DD'
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  criteria: {
    type: 'streak' | 'completion' | 'category';
    value: number;
    category?: Category;
  };
}

export interface HabitWithStats extends Habit {
  streak: number;
  completionRate: number;
  todayCompleted: boolean;
}

export type StatsPeriod = 'week' | 'month' | 'year' | 'all';
