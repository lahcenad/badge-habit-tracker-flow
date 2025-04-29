
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Navbar from '@/components/Navbar';
import AchievementBadge from '@/components/AchievementBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Achievement } from '@/types';
import { getAchievements } from '@/utils/storageUtils';

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  
  useEffect(() => {
    loadAchievements();
  }, []);
  
  const loadAchievements = () => {
    const allAchievements = getAchievements();
    setAchievements(allAchievements);
    setUnlockedCount(allAchievements.filter(a => a.unlockedAt).length);
    setTotalCount(allAchievements.length);
  };

  return (
    <Layout>
      <Navbar title="Achievements" />
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your Progress</CardDescription>
            <CardTitle>Achievement Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold">
                  {unlockedCount} / {totalCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  badges unlocked
                </p>
              </div>
              <div className="w-full sm:w-64 h-2 bg-accent rounded overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center">
                  <AchievementBadge achievement={achievement} />
                  <p className="mt-2 text-xs font-medium text-center">{achievement.name}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unlocked" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {achievements
                .filter(a => a.unlockedAt)
                .map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <AchievementBadge achievement={achievement} />
                    <p className="mt-2 text-xs font-medium text-center">{achievement.name}</p>
                  </div>
                ))
              }
              
              {achievements.filter(a => a.unlockedAt).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  You haven't unlocked any achievements yet. Start tracking habits to earn badges!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="locked" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {achievements
                .filter(a => !a.unlockedAt)
                .map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <AchievementBadge achievement={achievement} />
                    <p className="mt-2 text-xs font-medium text-center">{achievement.name}</p>
                  </div>
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Achievements;
