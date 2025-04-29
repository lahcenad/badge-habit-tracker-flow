
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";

// Create a new query client instance
const queryClient = new QueryClient();

// Determine which page to render based on the URL path
const getCurrentPage = () => {
  const path = window.location.pathname;
  
  // Map paths to page components
  switch (path) {
    case "/habits":
      return import("./pages/Habits").then(module => module.default);
    case "/statistics":
      return import("./pages/Statistics").then(module => module.default);
    case "/achievements":
      return import("./pages/Achievements").then(module => module.default);
    case "/":
      return Promise.resolve(Index);
    default:
      return import("./pages/NotFound").then(module => module.default);
  }
};

const App = () => {
  const [Page, setPage] = React.useState(() => Index);
  
  React.useEffect(() => {
    getCurrentPage().then(setPage);
    
    // Handle navigation via popstate events (browser back/forward buttons)
    const handlePopState = () => {
      getCurrentPage().then(setPage);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Page />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
