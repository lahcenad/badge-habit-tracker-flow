
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  const [CurrentPage, setCurrentPage] = useState<React.ComponentType>(() => Index);
  
  useEffect(() => {
    // Determine which page to render based on the URL path
    const loadCurrentPage = async () => {
      const path = window.location.pathname;
      
      // Map paths to page components
      try {
        switch (path) {
          case "/habits":
            const HabitsModule = await import("./pages/Habits");
            setCurrentPage(() => HabitsModule.default);
            break;
          case "/statistics":
            const StatisticsModule = await import("./pages/Statistics");
            setCurrentPage(() => StatisticsModule.default);
            break;
          case "/achievements":
            const AchievementsModule = await import("./pages/Achievements");
            setCurrentPage(() => AchievementsModule.default);
            break;
          case "/":
            setCurrentPage(() => Index);
            break;
          default:
            const NotFoundModule = await import("./pages/NotFound");
            setCurrentPage(() => NotFoundModule.default);
            break;
        }
      } catch (error) {
        console.error("Error loading page:", error);
        setCurrentPage(() => Index); // Fallback to index if there's an error
      }
    };
    
    loadCurrentPage();
    
    // Handle navigation via popstate events (browser back/forward buttons)
    const handlePopState = () => {
      loadCurrentPage();
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CurrentPage />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
