
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Habits from "./pages/Habits";
import Statistics from "./pages/Statistics";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import { isNativePlatform } from "./capacitor";

// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  // Adjust app for mobile platforms when running in Capacitor
  useEffect(() => {
    if (isNativePlatform()) {
      // Apply any mobile-specific adjustments here
      document.documentElement.classList.add('capacitor-app');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
