
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Departments from "./pages/Departments";
import Employees from "./pages/Employees";
import Products from "./pages/Products";
import RawMaterials from "./pages/RawMaterials";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Defects from "./pages/Defects";
import Analytics from "./pages/Analytics";
import MaterialMapping from "./pages/MaterialMapping";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { SupabaseSetupGuide } from "./components/SupabaseSetupGuide";

// Create the query client once
const queryClient = new QueryClient();

const App = () => {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Supabase connection
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('departments').select('count', { count: 'exact', head: true });
        if (error) {
          console.error('Supabase connection error:', error);
          toast({
            title: "Database Connection Error",
            description: "Could not connect to the database. Please check your Supabase configuration.",
            variant: "destructive",
          });
          setIsSupabaseConfigured(false);
        } else {
          console.log('Supabase connection successful');
          setIsSupabaseConfigured(true);
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setIsSupabaseConfigured(false);
      }
    };

    checkConnection();
  }, []);

  // Show loading state while checking Supabase config
  if (isSupabaseConfigured === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Checking Supabase connection...</p>
        </div>
      </div>
    );
  }

  // Show setup guide if Supabase is not configured
  if (isSupabaseConfigured === false) {
    return <SupabaseSetupGuide />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/products" element={<Products />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/defects" element={<Defects />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/material-mapping" element={<MaterialMapping />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
