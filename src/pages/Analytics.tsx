
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const productionData = [
    { name: 'Jan', production: 65, target: 70 },
    { name: 'Feb', production: 59, target: 65 },
    { name: 'Mar', production: 80, target: 75 },
    { name: 'Apr', production: 81, target: 80 },
    { name: 'May', production: 56, target: 60 },
    { name: 'Jun', production: 55, target: 55 },
    { name: 'Jul', production: 40, target: 45 },
  ];

  const defectData = [
    { name: 'Manufacturing', value: 35 },
    { name: 'Design', value: 15 },
    { name: 'Material', value: 20 },
    { name: 'Electrical', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const materialDistribution = [
    { name: 'Stainless Steel', value: 40 },
    { name: 'Copper Wire', value: 25 },
    { name: 'Nylon Polymer', value: 15 },
    { name: 'Silicon Wafer', value: 12 },
    { name: 'Aluminum Sheets', value: 8 },
  ];

  const departmentProductivity = [
    { name: 'Production', value: 85 },
    { name: 'R&D', value: 70 },
    { name: 'QA', value: 90 },
    { name: 'Logistics', value: 75 },
    { name: 'Admin', value: 65 },
  ];

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Manufacturing performance and insights dashboard
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Production Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Production Performance</CardTitle>
              <CardDescription>Monthly production vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="production" fill="#8884d8" name="Actual" />
                    <Bar dataKey="target" fill="#82ca9d" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Defect Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Defect Analysis</CardTitle>
              <CardDescription>Defect categories distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={defectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {defectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Material Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Material Distribution</CardTitle>
              <CardDescription>Raw material usage by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {materialDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Productivity */}
          <Card>
            <CardHeader>
              <CardTitle>Department Productivity</CardTitle>
              <CardDescription>Productivity score by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={departmentProductivity}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Productivity Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Overall manufacturing performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">On-Time Delivery</h3>
                <div className="text-3xl font-bold text-green-600">92%</div>
                <p className="text-sm text-muted-foreground">+2% from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Defect Rate</h3>
                <div className="text-3xl font-bold text-red-600">3.2%</div>
                <p className="text-sm text-muted-foreground">-0.5% from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Production Efficiency</h3>
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <p className="text-sm text-muted-foreground">+1% from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Material Utilization</h3>
                <div className="text-3xl font-bold text-purple-600">94%</div>
                <p className="text-sm text-muted-foreground">+3% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;
