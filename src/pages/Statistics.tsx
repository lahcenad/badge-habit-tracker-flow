
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import Calendar from '@/components/Calendar';
import Stats from '@/components/Stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getHabits } from '@/utils/storageUtils';
import { enrichHabitsWithStats } from '@/utils/habitUtils';
import { HabitWithStats } from '@/types';

const Statistics = () => {
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
  const [longestStreak, setLongestStreak] = useState({ id: '', name: '', days: 0 });
  const [highestCompletion, setHighestCompletion] = useState({ id: '', name: '', rate: 0 });
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = () => {
    const allHabits = getHabits();
    const enrichedHabits = enrichHabitsWithStats(allHabits);
    setHabits(enrichedHabits);
    
    // Find longest streak and highest completion rate
    let maxStreak = { id: '', name: '', days: 0 };
    let maxCompletion = { id: '', name: '', rate: 0 };
    
    enrichedHabits.forEach(habit => {
      if (habit.streak > maxStreak.days) {
        maxStreak = { id: habit.id, name: habit.name, days: habit.streak };
      }
      
      if (habit.completionRate > maxCompletion.rate) {
        maxCompletion = { id: habit.id, name: habit.name, rate: habit.completionRate };
      }
    });
    
    setLongestStreak(maxStreak);
    setHighestCompletion(maxCompletion);
  };

  return (
    <Layout>
      <Navbar title="Statistics & Insights" />
      
      <div className="space-y-6">
        {/* Top metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Best</CardDescription>
              <CardTitle className="text-base">Longest Streak</CardTitle>
            </CardHeader>
            <CardContent>
              {longestStreak.days > 0 ? (
                <>
                  <p className="text-2xl font-semibold">{longestStreak.days} days</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {longestStreak.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No streaks yet. Start completing habits!
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Most Consistent</CardDescription>
              <CardTitle className="text-base">Highest Completion</CardTitle>
            </CardHeader>
            <CardContent>
              {highestCompletion.rate > 0 ? (
                <>
                  <p className="text-2xl font-semibold">{highestCompletion.rate}%</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {highestCompletion.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No completion data yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Statistics */}
        <Tabs defaultValue="overall">
          <TabsList>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="byHabit">By Habit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Calendar />
              </div>
              <div className="md:col-span-2">
                <Stats />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="byHabit" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Select a Habit</CardTitle>
                <CardDescription>View detailed statistics for each habit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {habits.map(habit => (
                    <div 
                      key={habit.id}
                      onClick={() => setSelectedHabitId(habit.id)}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedHabitId === habit.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {habit.streak > 0 ? `${habit.streak} day streak` : 'No current streak'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {selectedHabitId && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Calendar habitId={selectedHabitId} />
                </div>
                <div className="md:col-span-2">
                  <Stats habitId={selectedHabitId} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Statistics;
