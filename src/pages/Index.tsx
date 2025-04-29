
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import HabitList from '@/components/HabitList';
import Calendar from '@/components/Calendar';
import Stats from '@/components/Stats';
import { HabitWithStats } from '@/types';
import { getHabits } from '@/utils/storageUtils';
import { enrichHabitsWithStats } from '@/utils/habitUtils';
import { format } from 'date-fns';

const Index = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [streaks, setStreaks] = useState<{habitId: string, days: number}[]>([]);
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = () => {
    const allHabits = getHabits();
    const enrichedHabits = enrichHabitsWithStats(allHabits);
    
    setHabits(enrichedHabits);
    setTodayCompleted(enrichedHabits.filter(h => h.todayCompleted).length);
    setTodayTotal(enrichedHabits.length);
    
    // Find the top streaks
    const habitStreaks = enrichedHabits
      .map(h => ({ habitId: h.id, days: h.streak }))
      .filter(s => s.days > 0)
      .sort((a, b) => b.days - a.days)
      .slice(0, 3);
    
    setStreaks(habitStreaks);
  };

  return (
    <Layout>
      <Navbar title="Dashboard" />
      
      <div className="space-y-6">
        {/* Progress summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Today</CardDescription>
              <CardTitle>{format(new Date(), 'EEEE, MMM d')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {todayCompleted}/{todayTotal}
              </p>
              <p className="text-sm text-muted-foreground">
                habits completed today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Habits</CardDescription>
              <CardTitle>Current Streaks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {streaks.length > 0 ? (
                streaks.map((streak, i) => {
                  const habit = habits.find(h => h.id === streak.habitId);
                  return habit ? (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm truncate flex-1">{habit.name}</span>
                      <span className="text-sm font-medium text-primary">
                        {streak.days} days
                      </span>
                    </div>
                  ) : null;
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active streaks yet
                </p>
              )}
              
              {streaks.length > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0 text-xs" 
                  onClick={() => navigate('/statistics')}
                >
                  View all stats
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Achievements</CardDescription>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge className="w-5 h-5 mr-2 text-primary" />
                  <span className="text-sm">Unlocked badges</span>
                </div>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0" 
                  onClick={() => navigate('/achievements')}
                >
                  View all
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Calendar & Today's Habits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Calendar />
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="today">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="all">All Habits</TabsTrigger>
                </TabsList>
                <Button size="sm" variant="outline" onClick={() => navigate('/habits')}>
                  Manage Habits
                </Button>
              </div>
              
              <TabsContent value="today" className="mt-0">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium">Today's Habits</h2>
                  <p className="text-sm text-muted-foreground">
                    Track your daily progress
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <HabitList />
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                <div className="space-y-1">
                  <h2 className="text-lg font-medium">All Habits</h2>
                  <p className="text-sm text-muted-foreground">
                    View and track all your habits
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <HabitList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div>
          <Stats />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
