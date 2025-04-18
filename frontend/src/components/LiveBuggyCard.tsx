
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Truck, User, MapPin } from 'lucide-react';

// Buggy interface
interface Buggy {
  id: string;
  name: string;
  driverName: string;
  status: "available" | "busy" | "offline" | "maintenance";
  lastLocation: string;
  lastUpdated: Date;
  location?: { lat: number; lng: number };
  capacity: number;
  selected?: boolean;
}

interface LiveBuggyCardProps {
  buggy: Buggy;
  onSelect?: () => void;
  selected?: boolean;
}

const LiveBuggyCard: React.FC<LiveBuggyCardProps> = ({ buggy, onSelect, selected = false }) => {
  // Get status badge styling based on buggy status
  const getStatusBadge = () => {
    switch (buggy.status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'busy':
        return <Badge variant="destructive">In Transit</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      case 'offline':
      default:
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

  // Format the last updated time as relative (e.g., "5 minutes ago")
  const lastUpdatedRelative = formatDistanceToNow(buggy.lastUpdated, { addSuffix: true });

  return (
    <Card className={`hover:shadow-md transition-all ${selected ? 'border-primary' : ''} cursor-pointer`} onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex flex-row items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{buggy.name}</h3>
              <p className="text-xs text-muted-foreground">
                ID: {buggy.id}
              </p>
            </div>
          </div>
          <div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Driver</span>
            </div>
            <span className="font-medium">{buggy.driverName}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Location</span>
            </div>
            <span className="font-medium">{buggy.lastLocation}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex justify-between items-center">
          <span>Updated {lastUpdatedRelative}</span>
          <span>Capacity: {buggy.capacity}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBuggyCard;
