
import { useState, useEffect } from 'react';
import { Habit, HabitWithStats } from '@/types';
import { enrichHabitsWithStats } from '@/utils/habitUtils';
import { getHabits } from '@/utils/storageUtils';
import HabitCard from './HabitCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import HabitForm from './HabitForm';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { removeHabit } from '@/utils/storageUtils';
import { useToast } from '@/components/ui/use-toast';

interface HabitListProps {
  category?: string;
  onHabitsChange?: () => void;
}

const HabitList = ({ category, onHabitsChange }: HabitListProps) => {
  const { toast } = useToast();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithStats | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const loadHabits = () => {
    const allHabits = getHabits();
    const filteredHabits = category 
      ? allHabits.filter(habit => habit.category === category)
      : allHabits;
    
    const enrichedHabits = enrichHabitsWithStats(filteredHabits);
    setHabits(enrichedHabits);
    
    // Notify parent component that habits have changed
    if (onHabitsChange) {
      onHabitsChange();
    }
  };

  useEffect(() => {
    loadHabits();
  }, [category]);

  const handleEdit = (habit: HabitWithStats) => {
    setSelectedHabit(habit);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedHabit(null);
    setIsDialogOpen(false);
    loadHabits();
  };

  const handleDeleteClick = (habitId: string) => {
    setHabitToDelete(habitId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (habitToDelete) {
      removeHabit(habitToDelete);
      toast({
        title: "Habit deleted",
        description: "The habit has been removed from your list."
      });
      setIsDeleteAlertOpen(false);
      setHabitToDelete(null);
      loadHabits();
      
      // Notify parent about changes
      if (onHabitsChange) {
        onHabitsChange();
      }
    }
  };

  return (
    <div className="space-y-3">
      {habits.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No habits found. Start by adding a new habit!
        </div>
      ) : (
        habits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onToggle={() => {
              loadHabits();
              if (onHabitsChange) onHabitsChange();
            }}
          />
        ))
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm
            habit={selectedHabit}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all its tracking history.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HabitList;
