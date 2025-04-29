
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import HabitForm from '@/components/HabitForm';
import { Plus, ChevronLeft } from 'lucide-react';
import MainNav from './MainNav';

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Navbar = ({ title, showBackButton = false, onBack }: NavbarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    }
  };
  
  return (
    <div className="border-b mb-6">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        
        {location.pathname !== '/habits' && (
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            New Habit
          </Button>
        )}
      </div>
      
      <div className="py-2 hidden md:block">
        <MainNav />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <HabitForm onClose={closeDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
