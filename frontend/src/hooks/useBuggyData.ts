import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  trackingService,
  Buggy,
  BuggyLocation,
  LocationHistory,
} from "@/services/trackingService";

/**
 * Custom hook for fetching and managing buggy data from the API
 */
export const useBuggyData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBuggies, setAvailableBuggies] = useState<Buggy[]>([]);
  const [liveLocations, setLiveLocations] = useState<BuggyLocation[]>([]);

  // Fetch available buggies
  const fetchAvailableBuggies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const buggies = await trackingService.getAvailableBuggies();
      setAvailableBuggies(buggies);
      return buggies;
    } catch (err: any) {
      setError("Failed to fetch available buggies");
      toast({
        title: "Error",
        description: err.message || "Could not fetch available buggies",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch live locations
  const fetchLiveLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locations = await trackingService.getLiveLocations();
      setLiveLocations(locations);
      return locations;
    } catch (err: any) {
      setError("Failed to fetch live locations");
      toast({
        title: "Error",
        description: err.message || "Could not fetch live buggy locations",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch location history for a specific buggy
  const fetchLocationHistory = async (
    buggyId: number,
    since = "1h"
  ): Promise<LocationHistory[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await trackingService.getLocationHistory(buggyId, since);
      return history;
    } catch (err: any) {
      setError("Failed to fetch location history");
      toast({
        title: "Error",
        description: err.message || "Could not fetch buggy location history",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Update buggy status
  const updateBuggyStatus = async (
    buggyId: number,
    isRunning: boolean
  ): Promise<Buggy | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedBuggy = await trackingService.updateBuggyStatus(
        buggyId,
        isRunning
      );

      // Update the available buggies list with the updated buggy
      setAvailableBuggies(prev =>
        prev.map(b => (b.id === buggyId ? updatedBuggy : b))
      );

      toast({
        title: isRunning ? "Buggy Active" : "Buggy Inactive",
        description: `Buggy ${updatedBuggy.number_plate} is now ${isRunning ? "active" : "inactive"}`,
        variant: "default",
      });

      return updatedBuggy;
    } catch (err: any) {
      setError("Failed to update buggy status");
      toast({
        title: "Error",
        description: err.message || "Could not update buggy status",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAvailableBuggies();
    fetchLiveLocations();
  }, []);

  return {
    isLoading,
    error,
    availableBuggies,
    liveLocations,
    fetchAvailableBuggies,
    fetchLiveLocations,
    fetchLocationHistory,
    updateBuggyStatus,
  };
};
