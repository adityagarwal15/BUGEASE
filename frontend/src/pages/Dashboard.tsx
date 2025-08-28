import React, { useState, useEffect } from "react";
import RideStatusCard from "@/components/RideStatusCard";
import LiveBuggyCard from "@/components/LiveBuggyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  LineChart,
  Activity,
  Navigation,
  CalendarDays,
  ArrowRight,
  Bell,
  FileText,
  Loader2,
} from "lucide-react";
import { UserProfile, useAuth } from "@/services/authService";
import {
  trackingService,
  Buggy,
  BuggyLocation,
} from "@/services/trackingService";

// Interface for the ride history
interface RideHistory {
  id: number;
  buggyName?: string;
  pickupLocation: { name: string };
  dropoffLocation: { name: string };
  requestTime: Date;
  status: string;
}

// Interface for dashboard buggy display
interface DashboardBuggy {
  id: string;
  name: string;
  driverName: string;
  status: "available" | "busy" | "offline" | "maintenance";
  location: { lat: number; lng: number };
  lastUpdated: Date;
  lastLocation: string;
  capacity: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [buggies, setBuggies] = useState<DashboardBuggy[]>([]);
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([]);

  // No active ride by default
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userProfile = await getProfile();
        setProfile(userProfile);

        // Fetch available buggies
        await fetchLiveBuggies();

        // In a real app, we would fetch ride history from backend
        // For now, we just set an empty array
        setRideHistory([]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchLiveBuggies = async () => {
    try {
      // Get live locations from the API
      const locations = await trackingService.getLiveLocations();

      // Transform to dashboard buggy format
      const dashboardBuggies = locations.map(transformLocationToBuggy);
      setBuggies(dashboardBuggies);
    } catch (error) {
      console.error("Error fetching live buggies:", error);
    }
  };

  // Transform location data to dashboard buggy format
  const transformLocationToBuggy = (
    location: BuggyLocation
  ): DashboardBuggy => {
    // Map the API status string to one of our allowed status values
    let status: "available" | "busy" | "offline" | "maintenance" = "offline";

    if (location.status === "available") {
      status = "available";
    } else if (location.status === "busy") {
      status = "busy";
    } else if (location.status === "maintenance") {
      status = "maintenance";
    }

    return {
      id: location.buggy_number,
      name: `Campus Cruiser ${location.buggy_number}`,
      driverName: location.driver_name || "Unassigned",
      status: status,
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
      lastUpdated: new Date(location.last_updated),
      lastLocation: "Campus Area",
      capacity: 4, // Default capacity
    };
  };

  const handleCancelRide = () => {
    setActiveRide(null);
    toast({
      title: "Ride cancelled",
      description: "Your ride has been cancelled successfully.",
    });
  };

  // Filter ride history to only show if there are actual rides
  const hasRideHistory = rideHistory.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile?.first_name || "Student"}
            </h1>
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
                    <p className="text-2xl font-bold">{rideHistory.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Available Buggies
                    </p>
                    <p className="text-2xl font-bold">
                      {buggies.filter(b => b.status === "available").length}
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

            {/* Recent Activity - Mobile Only */}
            {hasRideHistory && (
              <div className="lg:hidden">
                <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
                <Card className="glass-panel">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {rideHistory.slice(0, 2).map(ride => (
                        <div
                          key={ride.id}
                          className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">
                              {ride.pickupLocation.name} to{" "}
                              {ride.dropoffLocation.name}
                            </p>
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
                <Link
                  to="/tracking"
                  className="text-sm text-primary hover:underline"
                >
                  View Map
                </Link>
              </div>

              <div className="mt-0">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : buggies.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {buggies.map(buggy => (
                      <LiveBuggyCard key={buggy.id} buggy={buggy} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No buggies currently available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity - Desktop Only */}
            {hasRideHistory ? (
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
                <Card className="glass-panel">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {rideHistory.map(ride => (
                        <div
                          key={ride.id}
                          className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">
                              {ride.pickupLocation.name} to{" "}
                              {ride.dropoffLocation.name}
                            </p>
                            <div className="flex items-center gap-3">
                              <p className="text-sm text-muted-foreground">
                                {ride.requestTime.toLocaleDateString()}
                              </p>
                              {ride.buggyName && (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">
                                    Buggy:
                                  </span>{" "}
                                  {ride.buggyName}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              ride.status === "completed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
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
                    <h3 className="font-medium text-lg mb-1">
                      No ride history yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Your recent ride activity will appear here once you start
                      using campus buggies
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
