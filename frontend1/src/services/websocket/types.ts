
// WebSocket message types
export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

// Location WebSocket specific types
export interface LocationUpdate {
  type: 'location_update';
  buggy_id: number;
  latitude: number;
  longitude: number;
  direction: number | null;
}

export interface SubscriptionMessage {
  type: 'subscribe';
  buggy_ids: number[];
}

export interface SubscriptionConfirmed {
  type: 'subscription_confirmed';
  buggy_ids: number[];
}

export interface BroadcastLocationUpdate extends LocationUpdate {
  driver_name: string;
  timestamp: string;
}

// Chat WebSocket specific types
export interface ChatMessage {
  type: string;
  content?: string;
  action?: string;
  [key: string]: any;
}

// Buggy location type from tracking service
export interface BuggyLocation {
  buggy_number: string;
  latitude: number;
  longitude: number;
  direction: number | null;
  driver_name: string | null;
  last_updated: string;
  status?: string;
}
