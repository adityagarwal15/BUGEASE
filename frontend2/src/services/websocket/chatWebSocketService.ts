
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useBaseWebSocket } from './baseWebSocketService';
import { ChatMessage } from './types';
import { WEBSOCKET_URL } from '@/config';

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();
  const { createConnection, sendMessage } = useBaseWebSocket('chat');
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // Try to connect and handle reconnection
    const connectWebSocket = () => {
      try {
        if (!token) {
          // Allow anonymous chat connection
          const socket = new WebSocket(`${WEBSOCKET_URL}/chat/`);
          socketRef.current = socket;
          
          socket.onopen = () => {
            console.log('Chat WebSocket connection established (anonymous)');
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
        } else {
          // Authenticated connection
          const socket = createConnection(
            token,
            // onOpen
            () => {
              setIsConnected(true);
            },
            // onMessage
            (data) => {
              setLastMessage(data);
            },
            // onClose
            (event) => {
              setIsConnected(false);
              
              // Try to reconnect after a delay
              setTimeout(() => {
                if (socketRef.current?.readyState === WebSocket.CLOSED) {
                  connectWebSocket();
                }
              }, 5000);
            },
            // onError
            (error) => {
              toast({
                title: "Connection Error",
                description: "Failed to connect to chat service",
                variant: "destructive"
              });
            }
          );
          
          socketRef.current = socket;
        }
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
  }, [createConnection, toast]);
  
  const sendChatMessage = (message: ChatMessage) => {
    if (sendMessage(socketRef.current, message)) {
      return true;
    } else {
      toast({
        title: "Connection Error",
        description: "Not connected to chat service",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    isConnected,
    lastMessage,
    sendMessage: sendChatMessage,
    socket: socketRef.current
  };
};
