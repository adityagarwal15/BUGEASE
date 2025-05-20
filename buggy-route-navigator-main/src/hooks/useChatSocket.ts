
import { useEffect, useRef, useState } from 'react';
import { WEBSOCKET_URL } from '@/config';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessage {
  type: string;
  content?: string;
  action?: string;
  [key: string]: any;
}

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const connectWebSocket = () => {
      try {
        const wsUrl = token 
          ? `${WEBSOCKET_URL}/chat/?token=${token}`
          : `${WEBSOCKET_URL}/chat/`;
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;
        
        socket.onopen = () => {
          console.log('Chat WebSocket connection established');
          setIsConnected(true);
        };
        
        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLastMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        socket.onclose = (event) => {
          console.log('Chat WebSocket connection closed:', event);
          setIsConnected(false);
          
          // Try to reconnect after a delay
          setTimeout(() => {
            if (socketRef.current?.readyState === WebSocket.CLOSED) {
              connectWebSocket();
            }
          }, 5000);
        };
        
        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service",
          variant: "destructive"
        });
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [toast]);
  
  const sendMessage = (message: ChatMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      toast({
        title: "Connection Error",
        description: "Not connected to chat service",
        variant: "destructive"
      });
    }
  };
  
  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};
