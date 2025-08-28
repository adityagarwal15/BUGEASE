import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, useAuth } from "@/services/authService";
import DriverProfileCard from "@/components/driver/DriverProfileCard";
import BuggyStatusCard from "@/components/driver/BuggyStatusCard";
import CampusMapCard from "@/components/driver/CampusMapCard";
import QuickLinksCard from "@/components/driver/QuickLinksCard";
import StatsCard from "@/components/driver/StatsCard";
import { useDriverLocation } from "@/hooks/useDriverLocation";
import { trackingService } from "@/services/trackingService";

interface BuggyDetails {
  id: number;
  number_plate: string;
  is_running: boolean;
}

const DriverDashboard = () => {
  const { toast } = useToast();
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [buggy, setBuggy] = useState<BuggyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  // Get user profile and assigned buggy - FIXED DEPENDENCY ARRAY
  useEffect(() => {
    const fetchProfileAndBuggy = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);

        // Fetch assigned buggy from the API
        try {
          const assignedBuggy = await trackingService.getAssignedBuggy();
          if (assignedBuggy) {
            setBuggy(assignedBuggy);
            setIsRunning(assignedBuggy.is_running);
          }
        } catch (error) {
          console.error("Error fetching assigned buggy:", error);
          toast({
            title: "Error",
            description: "Failed to load your assigned buggy information",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBuggy();
  }, []); // Empty dependency array to run only once on mount

  // Setup location tracking via custom hook
  useDriverLocation(buggy, isRunning);

  const handleStatusToggle = async (checked: boolean) => {
    if (!buggy) return;

    try {
      // Update local state immediately for responsiveness
      setIsRunning(checked);

      // Update buggy status on the server
      const updatedBuggy = await trackingService.updateBuggyStatus(
        buggy.id,
        checked
      );

      // Update local state with server response
      setBuggy(updatedBuggy);
      setIsRunning(updatedBuggy.is_running);

      toast({
        title: checked ? "Started Service" : "Ended Service",
        description: checked
          ? "Your location is now being broadcast to students"
          : "Your location is no longer being broadcast",
        variant: checked ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating buggy status:", error);

      // Revert the UI state change if server update fails
      setIsRunning(!checked);

      toast({
        title: "Update Failed",
        description: "Could not update your buggy status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your campus buggy and update your status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Profile and status */}
          <div className="lg:col-span-4 space-y-6">
            <DriverProfileCard profile={profile} loading={loading} />

            <BuggyStatusCard
              buggy={buggy}
              isRunning={isRunning}
              loading={loading}
              onStatusToggle={handleStatusToggle}
            />
          </div>

          {/* Right column - Quick actions and guides */}
          <div className="lg:col-span-8 space-y-6">
            <CampusMapCard isRunning={isRunning} />

            {/* Quick Actions and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuickLinksCard />
              <StatsCard isRunning={isRunning} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
