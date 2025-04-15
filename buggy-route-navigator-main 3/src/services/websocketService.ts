import { WEBSOCKET_URL } from "@/config";
import { useState, useEffect } from 'react';
import { BuggyLocation } from './trackingService'; // Import BuggyLocation from trackingService instead of redefining it

type MessageCallback = (message: any) => void;
type StatusCallback = (status: 'connected' | 'disconnected' | 'error') => void;

// WebSocket service for handling real-time communication with the server
class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private statusCallbacks: StatusCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;
  
  // Connect to WebSocket server using cookie-based authentication
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket is already connected or connecting');
      return;
    }
    
    try {
      // Create WebSocket connection
      // Cookies will be automatically sent with the WebSocket handshake
      this.socket = new WebSocket(`${WEBSOCKET_URL}/location/updates/`);
      
      // Event handlers
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.notifyStatus('error');
    }
  }
  
  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.reconnectAttempts = 0;
  }
  
  // Send a message to the WebSocket server
  sendMessage(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.warn('Cannot send message, WebSocket is not open');
    }
  }
  
  // Subscribe to messages from the WebSocket server
  onMessage(callback: MessageCallback) {
    this.messageCallbacks.push(callback);
  }
  
  // Subscribe to connection status changes
  onStatus(callback: StatusCallback) {
    this.statusCallbacks.push(callback);
  }
  
  // WebSocket event handlers
  private handleOpen() {
    console.log('WebSocket connection established');
    this.reconnectAttempts = 0;
    this.notifyStatus('connected');
  }
  
  private handleClose(event: CloseEvent) {
    console.log('WebSocket connection closed:', event);
    this.notifyStatus('disconnected');
    
    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
  }
  
  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.notifyMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, event.data);
    }
  }
  
  private handleError(event: Event) {
    console.error('WebSocket error:', event);
    this.notifyStatus('error');
  }
  
  // Helper methods
  private notifyMessage(data: any) {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in WebSocket message callback:', error);
      }
    });
  }
  
  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in WebSocket status callback:', error);
      }
    });
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${delay / 1000} seconds (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Subscribe to buggies (for students)
  subscribeToBuggies(buggyIds: number[]) {
    const message = {
      type: 'subscribe',
      buggy_ids: buggyIds
    };
    this.sendMessage(message);
  }
}

// Create a singleton instance of the WebSocket service
export const websocketService = new WebSocketService();

// Function to send location updates via WebSocket (for drivers)
export const sendLocationUpdate = (
  socket: WebSocket,
  buggyId: number,
  latitude: number,
  longitude: number,
  direction: number | null
) => {
  try {
    const message = {
      type: 'location_update',
      buggy_id: buggyId,
      latitude,
      longitude,
      direction
    };
    socket.send(JSON.stringify(message));
  } catch (error) {
    console.error('Error sending location update:', error);
  }
};

// Hook for subscribing to and receiving real-time buggy locations
export function useWebSocketLocations(buggyIds: number[]) {
  const [isConnected, setIsConnected] = useState(false);
  const [locations, setLocations] = useState<BuggyLocation[]>([]);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to WebSocket messages
    const handleMessage = (message: any) => {
      if (message.type === 'location_update') {
        setLocations(prev => {
          // Check if we already have this buggy in our locations
          const existingIndex = prev.findIndex(
            loc => loc.buggy_number === String(message.buggy_id)
          );
          
          // Create the new location object
          const newLocation: BuggyLocation = {
            buggy_number: String(message.buggy_id),
            latitude: message.latitude,
            longitude: message.longitude,
            direction: message.direction,
            driver_name: message.driver_name || null, // Ensure null is used when undefined
            last_updated: message.timestamp || new Date().toISOString(),
            status: 'available' // Default status
          };
          
          // Either update existing or add new location
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newLocation;
            return updated;
          } else {
            return [...prev, newLocation];
          }
        });
      }
    };

    // Handle connection status changes
    const handleStatus = (status: 'connected' | 'disconnected' | 'error') => {
      setIsConnected(status === 'connected');
      
      // If connected and we have buggy IDs, subscribe to them
      if (status === 'connected' && buggyIds.length > 0) {
        websocketService.subscribeToBuggies(buggyIds);
      }
    };

    // Register handlers
    websocketService.onMessage(handleMessage);
    websocketService.onStatus(handleStatus);

    // Clean up function
    return () => {
      // We'll keep the websocket connection alive, just remove our handlers
      const emptyCallback = () => {};
      websocketService.onMessage(emptyCallback);
      websocketService.onStatus(emptyCallback);
    };
  }, [buggyIds]); // Re-run if buggyIds change

  return { locations, isConnected };
}
