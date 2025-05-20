
import { useEffect, useRef, useState } from 'react';
import { WEBSOCKET_URL } from '@/config';
import { BuggyLocation } from './trackingService';

// Types
interface LocationUpdate {
  type: 'location_update';
  buggy_id: number;
  latitude: number;
  longitude: number;
  direction: number | null;
  driver_name: string;
  timestamp: string;
}

interface SubscriptionConfirmed {
  type: 'subscription_confirmed';
  buggy_ids: number[];
}

type WebSocketMessage = LocationUpdate | SubscriptionConfirmed;

// WebSocket service for real-time updates
export const createWebSocketConnection = (token: string | null) => {
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const socket = new WebSocket(`${WEBSOCKET_URL}/location/updates/?token=${token}`);
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};

// Subscribe to specific buggy IDs
export const subscribeToBuggies = (socket: WebSocket, buggyIds: number[]) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'subscribe',
      buggy_ids: buggyIds
    }));
  } else {
    console.error('WebSocket is not open. Current state:', socket.readyState);
  }
};

// For drivers to send location updates
export const sendLocationUpdate = (
  socket: WebSocket, 
  buggyId: number, 
  latitude: number, 
  longitude: number, 
  direction: number | null = null
) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'location_update',
      buggy_id: buggyId,
      latitude,
      longitude,
      direction
    }));
  } else {
    console.error('WebSocket is not open. Current state:', socket.readyState);
  }
};

// Custom hook to use WebSocket for location updates
export const useWebSocketLocations = (initialBuggyIds: number[] = []) => {
  const [locations, setLocations] = useState<BuggyLocation[]>([]);
  const [subscribedBuggyIds, setSubscribedBuggyIds] = useState<number[]>(initialBuggyIds);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    // Create WebSocket connection
    try {
      const socket = createWebSocketConnection(token);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setIsConnected(true);
        
        // Subscribe to initial buggy IDs
        if (initialBuggyIds.length > 0) {
          subscribeToBuggies(socket, initialBuggyIds);
        }
      };
      
      socket.onclose = () => {
        setIsConnected(false);
      };
      
      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
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
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [initialBuggyIds]);
  
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
    subscribe 
  };
};
