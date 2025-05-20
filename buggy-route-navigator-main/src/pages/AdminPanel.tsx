
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBuggies, mockRideHistory } from '@/data/buggies';
import { LineChart, BarChart, Activity, Users, Map, Settings, Wrench, AlertTriangle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Get buggy stats
  const availableBuggies = mockBuggies.filter(b => b.status === "available").length;
  const busyBuggies = mockBuggies.filter(b => b.status === "busy").length;
  const maintenanceBuggies = mockBuggies.filter(b => b.status === "maintenance").length;
  const offlineBuggies = mockBuggies.filter(b => b.status === "offline").length;
  const totalBuggies = mockBuggies.length;
  
  // Get ride stats
  const completedRides = mockRideHistory.filter(r => r.status === "completed").length;
  const cancelledRides = mockRideHistory.filter(r => r.status === "cancelled").length;
  
  const handleActionClick = (action: string, buggyId: string) => {
    const buggy = mockBuggies.find(b => b.id === buggyId);
    
    toast({
      title: `${action} action triggered`,
      description: `Action performed on buggy ${buggy?.name}`,
    });
  };
  
  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-500";
    if (level > 30) return "text-amber-500";
    return "text-red-500";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 hover:bg-green-500/30';
      case 'busy':
        return 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30';
      case 'maintenance':
        return 'bg-red-500/20 text-red-500 hover:bg-red-500/30';
      case 'offline':
        return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage campus buggies, drivers, and ride requests
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[500px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="buggies">Buggies</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Total Buggies</p>
                      <p className="text-3xl font-bold">{totalBuggies}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Map className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-medium">{availableBuggies + busyBuggies} / {totalBuggies}</span>
                    </div>
                    <Progress value={(availableBuggies + busyBuggies) / totalBuggies * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="text-3xl font-bold">{availableBuggies}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Availability Rate</span>
                      <span className="font-medium">{Math.round(availableBuggies / totalBuggies * 100)}%</span>
                    </div>
                    <Progress value={availableBuggies / totalBuggies * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">In Maintenance</p>
                      <p className="text-3xl font-bold">{maintenanceBuggies}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Maintenance Rate</span>
                      <span className="font-medium">{Math.round(maintenanceBuggies / totalBuggies * 100)}%</span>
                    </div>
                    <Progress value={maintenanceBuggies / totalBuggies * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-panel">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">Total Rides</p>
                      <p className="text-3xl font-bold">{completedRides + cancelledRides}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{Math.round(completedRides / (completedRides + cancelledRides) * 100)}%</span>
                    </div>
                    <Progress value={completedRides / (completedRides + cancelledRides) * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* System Status and Route Optimization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Backend API</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Operational</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>WebSockets</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Connected</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Map Services</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span>Database</span>
                    </div>
                    <span className="text-sm text-muted-foreground">High Load</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">AI Route Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground mb-2">Performance Analysis</p>
                      <div className="h-40 flex items-center justify-center bg-muted rounded-md">
                        <div className="text-center">
                          <LineChart className="h-10 w-10 text-primary/40 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Route optimization performance visualization
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Average Time Saved</p>
                        <p className="text-xl font-bold">4.2 min</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Efficiency Gain</p>
                        <p className="text-xl font-bold">18%</p>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Recalculate Optimal Routes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="buggies" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Buggy Fleet</CardTitle>
                <Button size="sm">
                  Add New Buggy
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Buggy</th>
                        <th className="py-3 px-4 text-left font-medium">Driver</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Battery</th>
                        <th className="py-3 px-4 text-left font-medium">Last Updated</th>
                        <th className="py-3 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockBuggies.map((buggy) => (
                        <tr key={buggy.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{buggy.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {buggy.id}</div>
                          </td>
                          <td className="py-3 px-4">{buggy.driverName}</td>
                          <td className="py-3 px-4">
                            <Badge className={cn("font-normal", getStatusColor(buggy.status))}>
                              {buggy.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className={getBatteryColor(buggy.batteryLevel)}>
                                {buggy.batteryLevel}%
                              </span>
                              <div className="ml-2 h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    buggy.batteryLevel > 70 ? "bg-green-500" : 
                                    buggy.batteryLevel > 30 ? "bg-amber-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${buggy.batteryLevel}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                              <span>{buggy.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Manage Buggy</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleActionClick("View", buggy.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleActionClick("Track", buggy.id)}>
                                  Track Location
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleActionClick("Assign", buggy.id)}>
                                  Assign Driver
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleActionClick("Maintenance", buggy.id)}>
                                  Schedule Maintenance
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drivers" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Driver Management</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
                    <p className="text-lg font-medium mb-2">Driver Management</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      This section would display a list of drivers, their assigned buggies, schedules, and performance metrics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Ride Requests</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-center h-48 bg-muted rounded-md">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mb-3 mx-auto" />
                    <p className="text-lg font-medium mb-2">Request Management</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      This section would display current and pending ride requests, allowing admins to manage and prioritize rides.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
