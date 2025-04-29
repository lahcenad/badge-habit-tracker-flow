
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Category, HabitWithStats } from '@/types';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import HabitForm from '@/components/HabitForm';
import HabitList from '@/components/HabitList';
import { getHabits } from '@/utils/storageUtils';
import { enrichHabitsWithStats, getCategoryName } from '@/utils/habitUtils';

const Habits = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [categories, setCategories] = useState<{value: string, label: string}[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const loadHabits = useCallback(() => {
    console.log("Loading habits...");
    const allHabits = getHabits();
    const enrichedHabits = enrichHabitsWithStats(allHabits);
    setHabits(enrichedHabits);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(allHabits.map(h => h.category))];
    const categoryOptions = uniqueCategories.map(category => ({
      value: category,
      label: getCategoryName(category as Category)
    }));
    
    setCategories(categoryOptions);
  }, []);
  
  useEffect(() => {
    loadHabits();
  }, [loadHabits, refreshTrigger]);
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all' ? null : value);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    loadHabits(); // Reload habits when dialog closes
  };

  // Force a full refresh of the component
  const forceRefresh = useCallback(() => {
    console.log("Force refreshing habits page");
    // Increment the refresh trigger to force a re-render
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <Layout>
      <Navbar title="Manage Habits" />
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Your Habits</h2>
            <p className="text-sm text-muted-foreground">
              Create, edit and organize your habits
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select onValueChange={handleCategoryChange} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <HabitList 
            category={selectedCategory || undefined} 
            onHabitsChange={forceRefresh}
          />
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm onClose={closeDialog} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Habits;
