
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
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "@/components/ui/use-toast";

// Create the query client once
const queryClient = new QueryClient();

const App = () => {
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
        } else {
          console.log('Supabase connection successful');
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
      }
    };

    checkConnection();
  }, []);

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
