
import { useToast } from '@/components/ui/use-toast';
import { WebSocketMessage } from './types';
import { WEBSOCKET_URL } from '@/config';

export const createWebSocketConnection = (
  endpoint: string,
  token: string | null,
  onOpen?: () => void,
  onMessage?: (data: any) => void,
  onClose?: (event: CloseEvent) => void,
  onError?: (error: Event) => void
): WebSocket => {
  if (!token) {
    throw new Error('No authentication token found');
  }

  const wsUrl = `${WEBSOCKET_URL}/${endpoint}?token=${token}`;
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log(`WebSocket connection established to ${endpoint}`);
    if (onOpen) onOpen();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onclose = (event) => {
    console.log(`WebSocket connection closed: ${endpoint}`, event);
    if (onClose) onClose(event);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) onError(error);
  };

  return socket;
};

export const useBaseWebSocket = (endpoint: string) => {
  const { toast } = useToast();

  const sendMessage = (socket: WebSocket | null, message: WebSocketMessage) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "Not connected to WebSocket service",
        variant: "destructive"
      });
      return false;
    }

    try {
      socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      toast({
        title: "Send Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createConnection: (
      token: string | null,
      onOpen?: () => void,
      onMessage?: (data: any) => void,
      onClose?: (event: CloseEvent) => void,
      onError?: (error: Event) => void
    ) => createWebSocketConnection(endpoint, token, onOpen, onMessage, onClose, onError),
    sendMessage
  };
};
