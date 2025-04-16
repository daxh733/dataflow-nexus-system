
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Box, User, Truck, Bug } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const [counts, setCounts] = useState({
    departments: "0",
    employees: "0",
    products: "0",
    raw_materials: "0",
    customers: "0",
    suppliers: "0",
    defects: "0",
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        // Fetch all counts in parallel
        const [
          departmentsResult,
          employeesResult,
          productsResult,
          materialsResult,
          customersResult,
          suppliersResult,
          defectsResult
        ] = await Promise.all([
          supabase.from('departments').select('*', { count: 'exact', head: true }),
          supabase.from('employees').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('raw_materials').select('*', { count: 'exact', head: true }),
          supabase.from('customers').select('*', { count: 'exact', head: true }),
          supabase.from('suppliers').select('*', { count: 'exact', head: true }),
          supabase.from('defects').select('*', { count: 'exact', head: true })
        ]);

        console.log('Dashboard stats fetched:', {
          departments: departmentsResult.count,
          employees: employeesResult.count,
          products: productsResult.count,
          materials: materialsResult.count,
        });

        setCounts({
          departments: departmentsResult.count?.toString() || "0",
          employees: employeesResult.count?.toString() || "0",
          products: productsResult.count?.toString() || "0",
          raw_materials: materialsResult.count?.toString() || "0",
          customers: customersResult.count?.toString() || "0",
          suppliers: suppliersResult.count?.toString() || "0",
          defects: defectsResult.count?.toString() || "0",
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      title: "Departments",
      value: counts.departments,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      link: "/departments",
    },
    {
      title: "Employees",
      value: counts.employees,
      icon: <Users className="h-6 w-6 text-green-500" />,
      link: "/employees",
    },
    {
      title: "Products",
      value: counts.products,
      icon: <Package className="h-6 w-6 text-purple-500" />,
      link: "/products",
    },
    {
      title: "Raw Materials",
      value: counts.raw_materials,
      icon: <Box className="h-6 w-6 text-amber-500" />,
      link: "/raw-materials",
    },
    {
      title: "Customers",
      value: counts.customers,
      icon: <User className="h-6 w-6 text-indigo-500" />,
      link: "/customers",
    },
    {
      title: "Suppliers",
      value: counts.suppliers,
      icon: <Truck className="h-6 w-6 text-orange-500" />,
      link: "/suppliers",
    },
    {
      title: "Defects Reported",
      value: counts.defects,
      icon: <Bug className="h-6 w-6 text-red-500" />,
      link: "/defects",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                stat.value
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <a href={stat.link} className="text-blue-500 hover:underline">
                View all
              </a>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
