
// Base URL for API calls
const API_BASE_URL = 'http://localhost:8000/api'; // Replace with your actual API base URL

// Types for buggy tracking
export interface Buggy {
  id: number;
  number_plate: string;
  is_running: boolean;
}

export interface BuggyLocation {
  buggy_number: string;
  latitude: number;
  longitude: number;
  direction: number | null;
  driver_name: string | null;
  last_updated: string;
  status?: string; // We'll derive this for frontend display
}

export interface LocationHistory {
  latitude: number;
  longitude: number;
  timestamp: string;
}

// Helper function to get the authentication token
const getAuthHeaders = (): Headers => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  });
  
  return headers;
};

// Tracking service functions
export const trackingService = {
  // Get all available buggies
  getAvailableBuggies: async (): Promise<Buggy[]> => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/tracking/available-buggies/`, {
        method: 'GET',
        headers
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
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/tracking/live-location/`, {
        method: 'GET',
        headers
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
      const headers = getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/tracking/location-history/?buggy_id=${buggyId}&since=${since}`, 
        { method: 'GET', headers }
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
  }
};
