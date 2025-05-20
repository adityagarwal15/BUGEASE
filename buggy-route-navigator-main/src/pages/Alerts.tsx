
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Clock, Info, AlertCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    title: 'Your buggy is arriving',
    message: 'Buggy #B-102 will arrive at Science Building in approximately 3 minutes',
    type: 'info',
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    read: false,
  },
  {
    id: '2',
    title: 'Ride canceled',
    message: 'Your scheduled ride to Student Union has been canceled by the driver',
    type: 'warning',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: '3',
    title: 'Campus alert',
    message: 'Heavy traffic near Library complex due to ongoing event. Expect delays.',
    type: 'danger',
    time: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: false,
  },
  {
    id: '4',
    title: 'Ride completed',
    message: 'Your ride from Dorm C to Cafeteria has been completed',
    type: 'success',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

// Alert settings
const alertCategories = [
  { id: 'ride_updates', name: 'Ride Updates', enabled: true },
  { id: 'buggy_location', name: 'Buggy Location', enabled: true },
  { id: 'campus_alerts', name: 'Campus Alerts', enabled: true },
  { id: 'system_updates', name: 'System Updates', enabled: false },
  { id: 'promotions', name: 'Promotions', enabled: false },
];

const Alerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [settings, setSettings] = useState(alertCategories);
  
  // Format time to relative (e.g., "5 mins ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };
  
  // Mark all alerts as read
  const markAllAsRead = () => {
    const updatedAlerts = alerts.map(alert => ({ ...alert, read: true }));
    setAlerts(updatedAlerts);
    toast({
      title: "All alerts marked as read",
      description: "You have successfully marked all alerts as read",
    });
  };
  
  // Clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
    toast({
      title: "All alerts cleared",
      description: "You have successfully cleared all alerts",
    });
  };
  
  // Mark a single alert as read
  const markAsRead = (id: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    );
    setAlerts(updatedAlerts);
  };
  
  // Delete a single alert
  const deleteAlert = (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
  };
  
  // Toggle notification category
  const toggleCategory = (categoryId: string) => {
    const updatedSettings = settings.map(category => 
      category.id === categoryId ? { ...category, enabled: !category.enabled } : category
    );
    setSettings(updatedSettings);
    
    const category = settings.find(c => c.id === categoryId);
    if (category) {
      toast({
        title: `${category.name} notifications ${category.enabled ? 'disabled' : 'enabled'}`,
        description: `You will ${category.enabled ? 'no longer' : 'now'} receive ${category.name.toLowerCase()} notifications`,
      });
    }
  };
  
  // Get icon based on alert type
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'danger': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest campus buggy information
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              disabled={alerts.length === 0 || alerts.every(a => a.read)}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllAlerts}
              disabled={alerts.length === 0}
            >
              <X className="mr-1 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="alerts">
          <TabsList className="mb-6">
            <TabsTrigger value="alerts" className="relative">
              Alerts
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="mt-0">
            <div className="grid gap-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`transition-all hover:shadow-md ${!alert.read ? 'border-l-4 border-l-primary' : ''}`}
                  >
                    <CardContent className="p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h3 className={`font-medium ${!alert.read ? 'text-primary' : ''}`}>
                            {alert.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.message}
                          </p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(alert.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!alert.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => markAsRead(alert.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <BellOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">No alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      You're all caught up! New alerts will appear here when available.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for {category.name.toLowerCase()}
                        </p>
                      </div>
                      <Switch 
                        checked={category.enabled} 
                        onCheckedChange={() => toggleCategory(category.id)} 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Alerts;
