
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
import HabitList from '@/components/HabitList';
import { useToast } from '@/components/ui/use-toast';

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
  const [name, setName] = useState(habit?.name || '');
  const [category, setCategory] = useState<Category>((habit?.category as Category) || 'health');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return; // Don't submit empty habits
    }
    
    const updatedHabit: Habit = habit 
      ? { ...habit, name, category }
      : { 
          id: `habit_${Date.now()}`,
          name,
          category
        };
        
    if (habit) {
      storageUtils.updateHabit(updatedHabit);
    } else {
      storageUtils.saveHabit(updatedHabit);
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">{habit ? 'Edit Habit' : 'New Habit'}</h2>
      
      <div className="space-y-2">
        <label htmlFor="habit-name" className="block text-sm font-medium">
          Habit Name
        </label>
        <input
          id="habit-name"
          type="text"
          className="w-full border rounded-md p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="habit-category" className="block text-sm font-medium">
          Category
        </label>
        <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {habit ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

// Main Habits Component
const Habits = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadHabits = useCallback(() => {
    console.log("Loading habits...");
    const allHabits = storageUtils.getHabits();
    setHabits(allHabits);
  }, []);

  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    loadHabits();
  }, [loadHabits]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits, refreshTrigger]);

  return (
    <Layout>
      <Navbar title="Manage Habits" />
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter:</span>
          <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>
      
      <HabitList 
        category={selectedCategory} 
        onHabitsChange={forceRefresh}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm onClose={() => {
            setIsDialogOpen(false);
            forceRefresh();
          }} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Habits;
