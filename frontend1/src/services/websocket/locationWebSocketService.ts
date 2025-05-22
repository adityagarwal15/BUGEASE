
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useBaseWebSocket } from './baseWebSocketService';
import { BuggyLocation, LocationUpdate, SubscriptionMessage } from './types';

// For drivers to send location updates
export const sendLocationUpdate = (
  socket: WebSocket, 
  buggyId: number, 
  latitude: number, 
  longitude: number, 
  direction: number | null = null
): boolean => {
  if (socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not open. Current state:', socket.readyState);
    return false;
  }
  
  const message: LocationUpdate = {
    type: 'location_update',
    buggy_id: buggyId,
    latitude,
    longitude,
    direction
  };
  
  try {
    socket.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error sending location update:', error);
    return false;
  }
};

// Subscribe to specific buggy IDs
export const subscribeToBuggies = (socket: WebSocket, buggyIds: number[]): boolean => {
  if (socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not open. Current state:', socket.readyState);
    return false;
  }
  
  const message: SubscriptionMessage = {
    type: 'subscribe',
    buggy_ids: buggyIds
  };
  
  try {
    socket.send(JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Error subscribing to buggies:', error);
    return false;
  }
};

// Custom hook to use WebSocket for location updates
export const useWebSocketLocations = (initialBuggyIds: number[] = []) => {
  const [locations, setLocations] = useState<BuggyLocation[]>([]);
  const [subscribedBuggyIds, setSubscribedBuggyIds] = useState<number[]>(initialBuggyIds);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const { createConnection } = useBaseWebSocket('location/updates');
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    // Create WebSocket connection
    try {
      const socket = createConnection(
        token,
        // onOpen
        () => {
          setIsConnected(true);
          
          // Subscribe to initial buggy IDs
          if (initialBuggyIds.length > 0) {
            subscribeToBuggies(socket, initialBuggyIds);
          }
        },
        // onMessage
        (message) => {
          if (message.type === 'subscription_confirmed') {
            console.log('Subscribed to buggies:', message.buggy_ids);
            setSubscribedBuggyIds(message.buggy_ids);
          } else if (message.type === 'location_update') {
            // Update locations with new data
            setLocations(prevLocations => {
              // Find if we already have this buggy in our locations
              const existingIndex = prevLocations.findIndex(
                loc => loc.buggy_number === message.buggy_id.toString()
              );
              
              // Create new location object from the message
              const newLocation: BuggyLocation = {
                buggy_number: message.buggy_id.toString(),
                latitude: message.latitude,
                longitude: message.longitude,
                direction: message.direction,
                driver_name: message.driver_name,
                last_updated: message.timestamp,
                // Derive status (customize as needed)
                status: 'available'
              };
              
              // If we already have this buggy, update it, otherwise add it
              if (existingIndex >= 0) {
                const newLocations = [...prevLocations];
                newLocations[existingIndex] = newLocation;
                return newLocations;
              } else {
                return [...prevLocations, newLocation];
              }
            });
          }
        },
        // onClose
        () => {
          setIsConnected(false);
        },
        // onError
        (error) => {
          toast({
            title: "WebSocket Error",
            description: "Failed to connect to location service",
            variant: "destructive"
          });
        }
      );
      
      socketRef.current = socket;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to location service",
        variant: "destructive"
      });
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [initialBuggyIds, createConnection, toast]);
  
  // Function to subscribe to additional buggy IDs
  const subscribe = (buggyIds: number[]) => {
    if (socketRef.current && isConnected) {
      subscribeToBuggies(socketRef.current, buggyIds);
    }
  };
  
  return { 
    locations, 
    isConnected, 
    subscribedBuggyIds, 
    subscribe,
    socket: socketRef.current
  };
};
