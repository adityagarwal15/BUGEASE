
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Buggy } from '@/data/buggies';
import { CheckCircle2, Battery, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveBuggyCardProps {
  buggy: Buggy;
  onSelect?: () => void;
  selected?: boolean;
}

const LiveBuggyCard: React.FC<LiveBuggyCardProps> = ({ buggy, onSelect, selected }) => {
  const getStatusColor = () => {
    switch (buggy.status) {
      case "available":
        return "bg-green-500 text-white";
      case "busy":
        return "bg-amber-500 text-white";
      case "offline":
        return "bg-gray-500 text-white";
      case "maintenance":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getBatteryColor = () => {
    if (buggy.batteryLevel > 70) return "text-green-500";
    if (buggy.batteryLevel > 30) return "text-amber-500";
    return "text-red-500";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn(
      "glass-card transition-all duration-300 hover:border-primary/50",
      selected && "border-primary border-2"
    )}>
      <CardHeader className="flex flex-row justify-between items-center p-4 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{buggy.name}</h3>
          <p className="text-sm text-muted-foreground">{buggy.driverName}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {buggy.status}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>{buggy.capacity} seats</span>
            </div>
            <div className="flex items-center">
              <Battery className={`h-4 w-4 mr-1.5 ${getBatteryColor()}`} />
              <span className={getBatteryColor()}>{buggy.batteryLevel}%</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1.5" />
            <span>Updated: {formatTime(buggy.lastUpdated)}</span>
          </div>
        </div>
        
        {onSelect && buggy.status === "available" && (
          <Button 
            className="w-full mt-4" 
            onClick={onSelect}
            variant={selected ? "secondary" : "outline"}
          >
            {selected ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Selected</>
            ) : (
              "Select Buggy"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveBuggyCard;
