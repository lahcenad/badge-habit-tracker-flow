
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Habits from "./pages/Habits";
import Statistics from "./pages/Statistics";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  const [CurrentPage, setCurrentPage] = useState<React.ComponentType>(() => Index);
  
  useEffect(() => {
    // Determine which page to render based on the URL path
    const loadCurrentPage = () => {
      const path = window.location.pathname;
      
      // Map paths to page components
      switch (path) {
        case "/habits":
          setCurrentPage(() => Habits);
          break;
        case "/statistics":
          setCurrentPage(() => Statistics);
          break;
        case "/achievements":
          setCurrentPage(() => Achievements);
          break;
        case "/":
          setCurrentPage(() => Index);
          break;
        default:
          setCurrentPage(() => NotFound);
          break;
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
