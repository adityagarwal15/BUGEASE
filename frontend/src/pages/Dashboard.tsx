
import React, { useState } from 'react';
import RideStatusCard from '@/components/RideStatusCard';
import LiveBuggyCard from '@/components/LiveBuggyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { mockBuggies, mockRideHistory } from '@/data/buggies';
import { Link } from 'react-router-dom';
import { LineChart, Activity, Navigation, CalendarDays, ArrowRight, Bell, FileText } from 'lucide-react';
import { useAuth } from '@/services/authService';

const Dashboard = () => {
  const { toast } = useToast();
  // No active ride by default
  const { getProfile } = useAuth();
  const [activeRide, setActiveRide] = useState(null);
  const [user, setUser] = useState(null);

  const handleCancelRide = () => {
    setActiveRide(null);
    toast({
      title: "Ride cancelled",
      description: "Your ride has been cancelled successfully.",
    });
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);


  // Filter ride history to only show if there are actual rides
  const hasRideHistory = mockRideHistory.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username ?? "User"}</h1>
            <p className="text-muted-foreground">
              Track your rides and campus buggies in real-time
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/book">
              <Button>
                Book a Ride <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Current ride status and statistics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Ride Card - Only show if there's an active ride */}
            {activeRide && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Current Ride</h2>
                <RideStatusCard ride={activeRide} onCancel={handleCancelRide} />
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Rides</p>
                    <p className="text-2xl font-bold">{mockRideHistory.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Available Buggies</p>
                    <p className="text-2xl font-bold">
                      {mockBuggies.filter(b => b.status === "available").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 p-4">
                <Link to="/tracking" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Navigation className="mr-2 h-4 w-4" />
                    View Map
                  </Button>
                </Link>
                <Link to="/history" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    History
                  </Button>
                </Link>
                <Link to="/alerts" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Alerts
                  </Button>
                </Link>
                <Link to="/stats" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <LineChart className="mr-2 h-4 w-4" />
                    Usage Stats
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity - Mobile Only - Only show if there's ride history */}
            {hasRideHistory && (
              <div className="lg:hidden">
                <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
                <Card className="glass-panel">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {mockRideHistory.slice(0, 2).map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{ride.pickupLocation.name} to {ride.dropoffLocation.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {ride.requestTime.toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">
                            {ride.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Right column - Live buggies and map preview */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Live Buggies</h2>
                <Link to="/tracking" className="text-sm text-primary hover:underline">
                  View Map
                </Link>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="busy">Busy</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockBuggies.map((buggy) => (
                      <LiveBuggyCard key={buggy.id} buggy={buggy} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="available" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockBuggies
                      .filter(buggy => buggy.status === "available")
                      .map((buggy) => (
                        <LiveBuggyCard key={buggy.id} buggy={buggy} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="busy" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockBuggies
                      .filter(buggy => buggy.status === "busy")
                      .map((buggy) => (
                        <LiveBuggyCard key={buggy.id} buggy={buggy} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Recent Activity - Desktop Only - Only show if there's ride history */}
            {hasRideHistory ? (
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
                <Card className="glass-panel">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {mockRideHistory.map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{ride.pickupLocation.name} to {ride.dropoffLocation.name}</p>
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-muted-foreground">
                                {ride.requestTime.toLocaleDateString()}
                              </p>
                              {ride.buggyName && (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Buggy:</span> {ride.buggyName}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${ride.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                            }`}>
                            {ride.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
                <Card className="glass-panel border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-lg mb-1">No ride history yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Your recent ride activity will appear here once you start using campus buggies
                    </p>
                    <Link to="/book">
                      <Button>Book Your First Ride</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
