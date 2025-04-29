
import { Badge as BadgeIcon, Award, Star, TrendingUp, CalendarCheck, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

const AchievementBadge = ({ achievement, size = 'md' }: AchievementBadgeProps) => {
  const { name, description, icon, unlockedAt } = achievement;
  const isUnlocked = !!unlockedAt;
  
  const getIcon = () => {
    switch (icon) {
      case 'badge':
      case 'badge-check':
        return <BadgeIcon />;
      case 'award':
        return <Award />;
      case 'star':
        return <Star />;
      case 'trending-up':
        return <TrendingUp />;
      case 'calendar-check':
        return <CalendarCheck />;
      case 'activity':
        return <Activity />;
      default:
        return <BadgeIcon />;
    }
  };
  
  const sizeClasses = {
    sm: {
      card: 'w-16 h-16',
      icon: 'w-8 h-8'
    },
    md: {
      card: 'w-24 h-24',
      icon: 'w-10 h-10'
    },
    lg: {
      card: 'w-32 h-32',
      icon: 'w-14 h-14'
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`${sizeClasses[size].card} ${isUnlocked ? 'badge-unlocked' : 'opacity-40'}`}>
            <CardContent className="flex items-center justify-center h-full p-0">
              <div className="text-center">
                <div className={`${sizeClasses[size].icon} mx-auto ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getIcon()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
            {isUnlocked && (
              <p className="text-xs mt-1 text-primary">
                Unlocked on {format(parseISO(unlockedAt), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AchievementBadge;
