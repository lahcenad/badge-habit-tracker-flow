
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart, Award, CheckCheck, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import HabitForm from '@/components/HabitForm';
import { initializeDefaultData } from '@/utils/storageUtils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  
  useEffect(() => {
    initializeDefaultData();
  }, []);
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 w-full border-t bg-background z-20 sm:hidden">
        <nav className="flex justify-around py-2">
          <NavLink to="/" icon={<Home className="w-5 h-5" />} label="Home" isActive={currentPath === '/'} />
          <NavLink to="/habits" icon={<CheckCheck className="w-5 h-5" />} label="Habits" isActive={currentPath === '/habits'} />
          <NavButton
            onClick={() => setIsDialogOpen(true)}
            icon={<Plus className="w-5 h-5" />}
          />
          <NavLink to="/statistics" icon={<BarChart className="w-5 h-5" />} label="Stats" isActive={currentPath === '/statistics'} />
          <NavLink to="/achievements" icon={<Award className="w-5 h-5" />} label="Badges" isActive={currentPath === '/achievements'} />
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden sm:flex flex-col w-64 border-r p-4">
        <div className="flex items-center gap-2 mb-10">
          <User className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Habit Flow</h1>
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarLink to="/" icon={<Home className="w-5 h-5" />} label="Dashboard" isActive={currentPath === '/'} />
          <SidebarLink to="/habits" icon={<CheckCheck className="w-5 h-5" />} label="Manage Habits" isActive={currentPath === '/habits'} />
          <SidebarLink to="/statistics" icon={<BarChart className="w-5 h-5" />} label="Statistics" isActive={currentPath === '/statistics'} />
          <SidebarLink to="/achievements" icon={<Award className="w-5 h-5" />} label="Achievements" isActive={currentPath === '/achievements'} />
        </nav>
        <Button onClick={() => setIsDialogOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 pb-20 sm:pb-0">
        <div className="container max-w-4xl mx-auto p-4">
          {children}
        </div>
      </div>

      {/* Add habit dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm onClose={closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink = ({ to, icon, label, isActive }: NavLinkProps) => (
  <Link 
    to={to}
    className={cn(
      "flex flex-col items-center justify-center px-2 py-1 rounded-md text-xs",
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
    )}
  >
    <div className="mb-1">{icon}</div>
    {label}
  </Link>
);

interface NavButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
}

const NavButton = ({ onClick, icon }: NavButtonProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center px-2"
  >
    <div className="bg-primary text-white p-3 rounded-full -mt-6">
      {icon}
    </div>
  </button>
);

const SidebarLink = ({ to, icon, label, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Layout;
