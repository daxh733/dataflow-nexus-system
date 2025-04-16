
import { AppLayout } from "@/components/AppLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, Grid3X3, Package, User } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your manufacturing management system dashboard
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">View production analytics and insights</p>
              <Button asChild>
                <Link to="/analytics">
                  Go to Analytics <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid3X3 className="mr-2 h-5 w-5" />
                Material Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage product-material relationships</p>
              <Button asChild>
                <Link to="/material-mapping">
                  Go to Material Mapping <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Recent Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Recently added employees</p>
              <Button asChild variant="outline">
                <Link to="/employees">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Recently added products</p>
              <Button asChild variant="outline">
                <Link to="/products">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid3X3 className="mr-2 h-5 w-5" />
                Recent Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Recently added departments</p>
              <Button asChild variant="outline">
                <Link to="/departments">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
