
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Clock, MapPin, Activity, Calendar, Users, TrendingUp, Archive } from 'lucide-react';

// Mock data for usage statistics
const dailyUsageData = [
  { name: '12 AM', rides: 8 },
  { name: '3 AM', rides: 3 },
  { name: '6 AM', rides: 12 },
  { name: '9 AM', rides: 43 },
  { name: '12 PM', rides: 35 },
  { name: '3 PM', rides: 52 },
  { name: '6 PM', rides: 38 },
  { name: '9 PM', rides: 23 },
];

const weeklyUsageData = [
  { name: 'Mon', rides: 125 },
  { name: 'Tue', rides: 98 },
  { name: 'Wed', rides: 112 },
  { name: 'Thu', rides: 143 },
  { name: 'Fri', rides: 156 },
  { name: 'Sat', rides: 87 },
  { name: 'Sun', rides: 65 },
];

const locationUsageData = [
  { name: 'Student Center', value: 240 },
  { name: 'Library', value: 186 },
  { name: 'Dining Hall', value: 165 },
  { name: 'Sports Complex', value: 123 },
  { name: 'Science Building', value: 98 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const weekComparison = [
  { name: 'Mon', current: 125, previous: 110 },
  { name: 'Tue', current: 98, previous: 85 },
  { name: 'Wed', current: 112, previous: 105 },
  { name: 'Thu', current: 143, previous: 125 },
  { name: 'Fri', current: 156, previous: 145 },
  { name: 'Sat', current: 87, previous: 95 },
  { name: 'Sun', current: 65, previous: 60 },
];

const UsageStats = () => {
  const [timeRange, setTimeRange] = useState('week');
  
  // Summary statistics
  const totalRides = 786;
  const avgDailyRides = 112;
  const growthRate = 15.3;
  const mostActiveHour = '3 PM';
  const mostPopularLocation = 'Student Center';
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Usage Statistics</h1>
            <p className="text-muted-foreground">
              Analyze campus buggy usage patterns and trends
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select
              value={timeRange}
              onValueChange={value => setTimeRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-panel col-span-2 md:col-span-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <h3 className="text-2xl font-bold">{totalRides}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Archive className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel col-span-2 md:col-span-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Daily Average</p>
                <h3 className="text-2xl font-bold">{avgDailyRides}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel col-span-2 md:col-span-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <h3 className="text-2xl font-bold">+{growthRate}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-panel col-span-2 md:col-span-1">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Users</p>
                <h3 className="text-2xl font-bold">342</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="location">Location Analysis</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Weekly Usage Comparison</CardTitle>
                  <CardDescription>Current week vs. Previous week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={weekComparison}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" name="Current Week" fill="#8884d8" />
                      <Bar dataKey="previous" name="Previous Week" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Popular Pickup Locations</CardTitle>
                  <CardDescription>Most requested pickup points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={locationUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {locationUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Peak Hours</p>
                        <p className="font-medium">{mostActiveHour}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Popular Location</p>
                        <p className="font-medium">{mostPopularLocation}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Busiest Day</p>
                        <p className="font-medium">Friday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Time Analysis Tab */}
          <TabsContent value="time" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Usage Distribution</CardTitle>
                  <CardDescription>Number of rides requested per hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={dailyUsageData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rides" name="Number of Rides" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Trends</CardTitle>
                  <CardDescription>Ride patterns throughout the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={weeklyUsageData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rides" name="Number of Rides" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Location Analysis Tab */}
          <TabsContent value="location" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Pickup Locations</CardTitle>
                  <CardDescription>Most requested pickup points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={locationUsageData}
                      margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                      }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Number of Rides" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UsageStats;
