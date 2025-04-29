
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHabitLogs } from '@/utils/storageUtils';
import { HabitLog } from '@/types';

interface CalendarViewProps {
  habitId?: string;
  onDateClick?: (date: Date) => void;
}

const Calendar = ({ habitId, onDateClick }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState<HabitLog[]>([]);

  useEffect(() => {
    const allLogs = getHabitLogs();
    const filteredLogs = habitId 
      ? allLogs.filter(log => log.habitId === habitId)
      : allLogs;
    
    setLogs(filteredLogs);
  }, [habitId]);

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getDayStatus = (day: Date): { completed: boolean, existing: boolean } => {
    const dateString = format(day, 'yyyy-MM-dd');
    const log = logs.find(l => l.date === dateString && (!habitId || l.habitId === habitId));
    
    return {
      completed: log ? log.completed : false,
      existing: !!log
    };
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{format(currentMonth, 'MMMM yyyy')}</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={previousMonth} 
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth} 
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-xs text-center font-medium text-muted-foreground mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {daysInMonth.map((day, i) => {
            const { completed, existing } = getDayStatus(day);
            
            return (
              <Button
                key={i}
                variant="ghost"
                size="sm"
                onClick={() => onDateClick?.(day)}
                className={cn(
                  "h-9 w-full p-0 font-normal",
                  !isSameMonth(day, currentMonth) && "invisible",
                  isToday(day) && "border border-primary",
                  completed && "bg-primary/20 text-primary-foreground"
                )}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
                {existing && (
                  <div 
                    className={cn(
                      "w-1 h-1 mx-auto mt-1 rounded-full",
                      completed ? "bg-primary" : "bg-muted-foreground/50"
                    )}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
