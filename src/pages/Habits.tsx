// src/pages/Habits.tsx
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';

// Types
interface Habit {
  id: string;
  name: string;
  category: string;
}

interface HabitWithStats extends Habit {
  stats: { completed: number; streak: number };
}

type Category = 'health' | 'work' | 'personal' | 'other';

// Mock storageUtils
const storageUtils = {
  habits: [] as Habit[],

  getHabits: (): Habit[] => {
    return storageUtils.habits;
  },

  saveHabit: (habit: Habit) => {
    storageUtils.habits.push(habit);
  },

  updateHabit: (updatedHabit: Habit) => {
    storageUtils.habits = storageUtils.habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
  },

  deleteHabit: (habitId: string) => {
    storageUtils.habits = storageUtils.habits.filter(
      (habit) => habit.id !== habitId
    );
  },
};

// Mock habitUtils
const habitUtils = {
  enrichHabitsWithStats: (habits: Habit[]): HabitWithStats[] => {
    return habits.map((habit) => ({
      ...habit,
      stats: { completed: 0, streak: 0 }, // Mock stats
    }));
  },

  getCategoryName: (category: Category): string => {
    const categoryNames: Record<Category, string> = {
      health: 'Health',
      work: 'Work',
      personal: 'Personal',
      other: 'Other',
    };
    return categoryNames[category] || 'Other';
  },
};

// HabitForm Component
interface HabitFormProps {
  onClose: () => void;
  habit?: Habit; // Optional for editing
}

const HabitForm = ({ onClose, habit }: HabitFormProps) => {
  const [name, setName] = useState(h