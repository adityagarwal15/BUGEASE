
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { sendLocationUpdate, websocketService } from '@/services/websocketService';
import { WEBSOCKET_URL } from '@/config';

interface BuggyDetails {
  id: number;
  number_plate: string;
  is_running: boolean;
}

export const useDriverLocation = (buggy: BuggyDetails | null, isRunning: boolean) => {
  const { toast } = useToast();
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Setup WebSocket connection
  useEffect(() => {
    if (!buggy) return;
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to continue",
        variant: "destructive"
      });
      return;
    }
    
    // Create WebSocket connection
    const socket = new WebSocket(`${WEBSOCKET_URL}/location/updates/?token=${token}`);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWebsocket(socket);
      setIsConnected(true);
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setWebsocket(null);
      setIsConnected(false);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection",
        variant: "destructive"
      });
    };
    
    // Cleanup function
    return () => {
      socket.close();
    };
  }, [buggy, toast]);
  
  // Handle GPS location tracking and sending updates
  useEffect(() => {
    if (!isRunning || !websocket || !buggy) return;
    
    let watchId: number | null = null;
    
    const startLocationTracking = () => {
      if (!navigator.geolocation) {
        toast({
          title: "Error",
          description: "Geolocation is not supported by your browser",
          variant: "destructive"
        });
        return;
      }
      
      // Watch position and send updates
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Calculate direction (heading) if available
          const direction = position.coords.heading || null;
          
          // Send location update via WebSocket
          sendLocationUpdate(
            websocket,
            buggy.id,
            latitude,
            longitude,
            direction
          );
          
          console.log("Location sent:", latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: `Could not access your location: ${error.message}`,
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
    };
    
    startLocationTracking();
    
    // Cleanup function
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRunning, websocket, buggy, toast]);
  
  return { 
    isConnected
  };
};
