import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { HabitLog, StatsPeriod } from '@/types';
import { getHabitLogs, getHabits } from '@/utils/storageUtils';
import { getCategoryName, getCategoryColor } from '@/utils/habitUtils';

interface StatsProps {
  habitId?: string;
}

interface LogData {
  date: string;
  count: number;
  total: number;
  rate: number;
  formattedDate: string;
}

// Move CustomTooltip out of the Stats component so it can be used by other components
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="text-sm font-semibold">{data.formattedDate}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} of {data.total} habits completed
        </p>
        <p className="text-sm font-medium text-primary">
          {data.rate}% completion
        </p>
      </div>
    );
  }
  
  return null;
};

const Stats = ({ habitId }: StatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('week');
  const [chartData, setChartData] = useState<LogData[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [categoryData, setCategoryData] = useState<{name: string, value: number, color: string}[]>([]);
  
  useEffect(() => {
    loadData();
  }, [selectedPeriod, habitId]);
  
  const loadData = () => {
    // Get logs within the selected period
    const now = new Date();
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const startDate = subDays(now, days);
    
    const allLogs = getHabitLogs();
    const filteredLogs = allLogs.filter(log => {
      const logDate = parseISO(log.date);
      return logDate >= startDate && (!habitId || log.habitId === habitId);
    });
    
    generateChartData(filteredLogs, days);
    
    // Calculate completion rate
    if (filteredLogs.length > 0) {
      const completedLogs = filteredLogs.filter(log => log.completed);
      setCompletionRate(Math.round((completedLogs.length / filteredLogs.length) * 100));
    } else {
      setCompletionRate(0);
    }
    
    // If not filtering for a specific habit, generate category breakdown
    if (!habitId) {
      generateCategoryData(filteredLogs);
    }
  };
  
  const generateChartData = (logs: HabitLog[], days: number) => {
    const data: LogData[] = [];
    const now = new Date();
    
    // Generate data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dateString = format(date, 'yyyy-MM-dd');
      const dateFormatted = format(date, selectedPeriod === 'week' ? 'EEE' : 'MM/dd');
      
      const dayLogs = logs.filter(log => log.date === dateString);
      const completed = dayLogs.filter(log => log.completed).length;
      
      data.push({
        date: dateString,
        count: completed,
        total: dayLogs.length,
        rate: dayLogs.length > 0 ? Math.round((completed / dayLogs.length) * 100) : 0,
        formattedDate: dateFormatted,
      });
    }
    
    setChartData(data);
  };
  
  const generateCategoryData = (logs: HabitLog[]) => {
    const habits = getHabits();
    const categories: Record<string, {count: number, color: string}> = {};
    
    logs.filter(log => log.completed).forEach(log => {
      const habit = habits.find(h => h.id === log.habitId);
      if (habit) {
        const categoryName = getCategoryName(habit.category);
        categories[categoryName] = categories[categoryName] || { 
          count: 0, 
          color: getCategoryColor(habit.category).replace('bg-', '') 
        };
        categories[categoryName].count++;
      }
    });
    
    const data = Object.entries(categories).map(([name, {count, color}]) => ({
      name,
      value: count,
      color
    }));
    
    setCategoryData(data);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Habit Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" onValueChange={(value) => setSelectedPeriod(value as StatsPeriod)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-4">
            <CompletionRateCard rate={completionRate} />
            <ChartCard data={chartData} />
            {!habitId && categoryData.length > 0 && (
              <CategoryBreakdownCard data={categoryData} />
            )}
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            <CompletionRateCard rate={completionRate} />
            <ChartCard data={chartData} />
            {!habitId && categoryData.length > 0 && (
              <CategoryBreakdownCard data={categoryData} />
            )}
          </TabsContent>
          
          <TabsContent value="year" className="space-y-4">
            <CompletionRateCard rate={completionRate} />
            <ChartCard data={chartData} />
            {!habitId && categoryData.length > 0 && (
              <CategoryBreakdownCard data={categoryData} />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        Statistics are based on completed habits in the selected period.
      </CardFooter>
    </Card>
  );
};

const CompletionRateCard = ({ rate }: { rate: number }) => (
  <div className="p-4 bg-accent rounded-lg flex items-center justify-center">
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">Overall Completion Rate</p>
      <p className="text-3xl font-semibold">{rate}%</p>
    </div>
  </div>
);

const ChartCard = ({ data }: { data: LogData[] }) => (
  <div className="bg-white rounded-lg">
    <p className="text-xs text-muted-foreground mb-2">Habit Completion</p>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CategoryBreakdownCard = ({ data }: { data: {name: string, value: number, color: string}[] }) => (
  <div className="bg-white rounded-lg">
    <p className="text-xs text-muted-foreground mb-2">Category Breakdown</p>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: `rgb(var(--${item.color}-rgb))` }}
          />
          <span className="text-sm flex-1">{item.name}</span>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Stats;
