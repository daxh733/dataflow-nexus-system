
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Box, User, Truck, Bug } from "lucide-react";

const stats = [
  {
    title: "Departments",
    value: "8",
    icon: <Users className="h-6 w-6 text-blue-500" />,
    link: "/departments",
  },
  {
    title: "Employees",
    value: "124",
    icon: <Users className="h-6 w-6 text-green-500" />,
    link: "/employees",
  },
  {
    title: "Products",
    value: "45",
    icon: <Package className="h-6 w-6 text-purple-500" />,
    link: "/products",
  },
  {
    title: "Raw Materials",
    value: "78",
    icon: <Box className="h-6 w-6 text-amber-500" />,
    link: "/raw-materials",
  },
  {
    title: "Customers",
    value: "245",
    icon: <User className="h-6 w-6 text-indigo-500" />,
    link: "/customers",
  },
  {
    title: "Suppliers",
    value: "32",
    icon: <Truck className="h-6 w-6 text-orange-500" />,
    link: "/suppliers",
  },
  {
    title: "Defects Reported",
    value: "14",
    icon: <Bug className="h-6 w-6 text-red-500" />,
    link: "/defects",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
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
