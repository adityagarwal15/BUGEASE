
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { API_BASE_URL } from '@/config';

export const useNearestBuggy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const findNearestBuggy = async () => {
    setIsLoading(true);
    
    try {
      // Get user's current location
      const position = await getCurrentPosition();
      
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/buggies/nearest/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Token ${token}` } : {})
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      
      return {
        buggyId: data.buggy_id,
        distance: data.distance,
        eta: data.eta,
        driverName: data.driver_name,
        location: data.location
      };
      
    } catch (error) {
      console.error('Error finding nearest buggy:', error);
      setIsLoading(false);
      
      toast({
        title: "Location Error",
        description: error instanceof GeolocationPositionError 
          ? "Couldn't access your location. Please enable location services." 
          : "Failed to find nearest buggy.",
        variant: "destructive"
      });
      
      throw error;
    }
  };
  
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  return {
    findNearestBuggy,
    isLoading
  };
};
