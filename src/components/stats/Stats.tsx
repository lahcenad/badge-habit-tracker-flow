
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays } from 'date-fns';
import { StatsPeriod } from '@/types';
import { getHabitLogs } from '@/utils/storageUtils';
import { parseISO } from 'date-fns';
import CompletionRateCard from './CompletionRateCard';
import ChartCard from './ChartCard';
import CategoryBreakdownCard from './CategoryBreakdownCard';
import { 
  generateChartData, 
  generateCategoryData,
  calculateCompletionRate,
  LogData
} from './StatsData';

interface StatsProps {
  habitId?: string;
}

const Stats = ({ habitId }: StatsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('week');
  const [chartData, setChartData] = useState<LogData[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [categoryData, setCategoryData] = useState<{name: string, value: number, color: string}[]>([]);
  
  useEffect(() => {
    loadData();
  }, [selectedPeriod, habitId]);
  
  const loadData = () => {
    const now = new Date();
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const startDate = subDays(now, days);
    
    const allLogs = getHabitLogs();
    const filteredLogs = allLogs.filter(log => {
      const logDate = parseISO(log.date);
      return logDate >= startDate && (!habitId || log.habitId === habitId);
    });
    
    const data = generateChartData(filteredLogs, days);
    setChartData(data);
    
    setCompletionRate(calculateCompletionRate(filteredLogs));
    
    if (!habitId) {
      setCategoryData(generateCategoryData(filteredLogs));
    }
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

export default Stats;
