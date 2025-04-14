
import { API_BASE_URL } from '@/config';

// Types for buggy tracking
export interface Buggy {
  id: number;
  number_plate: string;
  is_running: boolean;
}

// Add driverPhone to BuggyLocation interface if API were to return it
export interface BuggyLocation {
  buggy_number: string;
  latitude: number;
  longitude: number;
  direction: number | null;
  driver_name: string | null;
  last_updated: string;
  status?: string; // We'll derive this for frontend display
  driver_phone?: string; // Note: This is not actually returned by the API based on docs
}

export interface LocationHistory {
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Tracking service functions
export const trackingService = {
  // Get all available buggies
  getAvailableBuggies: async (): Promise<Buggy[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/available-buggies/`, {
        method: 'GET',
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch available buggies');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching available buggies:', error);
      throw error;
    }
  },
  
  // Get live locations of all buggies
  getLiveLocations: async (): Promise<BuggyLocation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/live-location/`, {
        method: 'GET',
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch live locations');
      }
      
      const locations = await response.json();
      
      // Add a derived status field for frontend display
      return locations.map((location: BuggyLocation) => ({
        ...location,
        // Determine status based on driver availability (customize as needed)
        status: location.driver_name ? 'available' : 'offline'
      }));
    } catch (error) {
      console.error('Error fetching live locations:', error);
      throw error;
    }
  },
  
  // Get location history for a specific buggy
  getLocationHistory: async (buggyId: number, since = '1h'): Promise<LocationHistory[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tracking/location-history/?buggy_id=${buggyId}&since=${since}`, 
        { 
          method: 'GET', 
          credentials: 'include' // Include cookies for authentication
        }
      );
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch location history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching location history:', error);
      throw error;
    }
  },
  
  // Update buggy running status
  updateBuggyStatus: async (buggyId: number, isRunning: boolean): Promise<Buggy> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/update-buggy-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_running: isRunning
        }),
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update buggy status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating buggy status:', error);
      throw error;
    }
  },
  
  // Get assigned buggy for a driver
  getAssignedBuggy: async (): Promise<Buggy | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking/assigned-buggy/`, {
        method: 'GET',
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // No buggy assigned
          return null;
        }
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch assigned buggy');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching assigned buggy:', error);
      throw error;
    }
  }
};
