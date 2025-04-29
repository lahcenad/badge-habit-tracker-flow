
import { useState } from 'react';
import { Check, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import CategoryBadge from '@/components/CategoryBadge';
import StreakCounter from '@/components/StreakCounter';
import { HabitWithStats } from '@/types';
import { toggleHabitCompletion } from '@/utils/habitUtils';

interface HabitCardProps {
  habit: HabitWithStats;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
  onToggle: () => void;
}

const HabitCard = ({ habit, onEdit, onDelete, onToggle }: HabitCardProps) => {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  
  const handleToggleCompletion = () => {
    setIsChecking(true);
    try {
      toggleHabitCompletion(habit.id);
      
      // Trigger the callback to refresh the parent components
      onToggle();
      
      if (!habit.todayCompleted) {
        toast({
          title: "Habit completed!",
          description: habit.streak > 0 
            ? `You're on a ${habit.streak + 1} day streak!` 
            : "Keep it up!",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not update habit status",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <button 
            onClick={handleToggleCompletion}
            disabled={isChecking}
            className={`relative flex items-center justify-center w-6 h-6 mr-3 rounded-full border ${
              habit.todayCompleted 
                ? 'bg-primary border-primary' 
                : 'bg-white border-gray-300 hover:border-primary/70'
            } transition-colors`}
          >
            {habit.todayCompleted && (
              <Check className="w-4 h-4 text-white" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-base truncate">{habit.name}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(habit)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(habit.id)}
                    className="text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <CategoryBadge category={habit.category} />
              <StreakCounter streak={habit.streak} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
