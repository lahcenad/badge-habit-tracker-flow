
import { Calendar, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  streak: number;
  className?: string;
}

const StreakCounter = ({ streak, className }: StreakCounterProps) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {streak > 0 && (
        <span className={cn(
          "text-sm font-medium flex items-center",
          streak >= 30 ? "text-primary" : "text-foreground/80"
        )}>
          <CheckCheck className="h-4 w-4 mr-1" />
          {streak} {streak === 1 ? 'day' : 'days'}
        </span>
      )}
      
      {streak >= 3 && (
        <span className={cn(
          "px-1.5 py-0.5 text-xs font-bold rounded",
          streak >= 30 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          🔥 {streak}
        </span>
      )}
    </div>
  );
};

export default StreakCounter;
