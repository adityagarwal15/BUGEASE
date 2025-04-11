
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile, useAuth } from '@/services/authService';
import DriverProfileCard from '@/components/driver/DriverProfileCard';
import BuggyStatusCard from '@/components/driver/BuggyStatusCard';
import CampusMapCard from '@/components/driver/CampusMapCard';
import QuickLinksCard from '@/components/driver/QuickLinksCard';
import StatsCard from '@/components/driver/StatsCard';
import { useDriverLocation } from '@/hooks/useDriverLocation';

interface BuggyDetails {
  id: number;
  number_plate: string;
  is_running: boolean;
}

// API endpoint for updating buggy status
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Updated to use actual backend URL

const DriverDashboard = () => {
  const { toast } = useToast();
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [buggy, setBuggy] = useState<BuggyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  
  // Get user profile and assigned buggy
  useEffect(() => {
    const fetchProfileAndBuggy = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
        
        // Fetch assigned buggy from API
        // For now still using mock data until we have a driver-buggy assignment API
        // In a real implementation, this would come from an API endpoint like:
        // const response = await fetch(`${API_BASE_URL}/driver/assigned-buggy/`, { 
        //   headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` }
        // });
        // const buggyData = await response.json();
        
        // Using mock data until we have the real API
        const mockBuggy = {
          id: 1,
          number_plate: "CB-001",
          is_running: false
        };
        setBuggy(mockBuggy);
        setIsRunning(mockBuggy.is_running);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileAndBuggy();
  }, [getProfile, toast]);
  
  // Setup location tracking via custom hook
  useDriverLocation(buggy, isRunning);
  
  const handleStatusToggle = async (checked: boolean) => {
    setIsRunning(checked);
    
    // Update buggy status
    if (buggy) {
      setBuggy({
        ...buggy,
        is_running: checked
      });
      
      // In a real implementation, update the server
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // This would be the real API call:
          // await fetch(`${API_BASE_URL}/driver/update-buggy-status/`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Token ${token}`
          //   },
          //   body: JSON.stringify({
          //     buggy_id: buggy.id,
          //     is_running: checked
          //   })
          // });
          
          // For now, just log the action that would be sent to the API
          console.log(`Would update buggy ${buggy.id} status to ${checked ? 'running' : 'not running'}`);
        }
      } catch (error) {
        console.error("Error updating buggy status:", error);
        // Don't show an error toast here as it's not critical
      }
    }
    
    toast({
      title: checked ? "Started Service" : "Ended Service",
      description: checked 
        ? "Your location is now being broadcast to students" 
        : "Your location is no longer being broadcast",
      variant: checked ? "default" : "destructive"
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Driver Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your campus buggy and update your status
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Profile and status */}
          <div className="lg:col-span-4 space-y-6">
            <DriverProfileCard 
              profile={profile} 
              loading={loading} 
            />
            
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
