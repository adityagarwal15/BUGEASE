import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RideRequest } from "@/data/buggies";
import { ArrowRight, Clock, MapPin, User, Car } from "lucide-react";

interface RideStatusCardProps {
  ride: RideRequest;
  onCancel?: () => void;
}

const RideStatusCard: React.FC<RideStatusCardProps> = ({ ride, onCancel }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadgeColor = () => {
    switch (ride.status) {
      case "pending":
        return "bg-amber-500/20 text-amber-500 border-amber-500/20";
      case "accepted":
        return "bg-blue-500/20 text-blue-500 border-blue-500/20";
      case "in-progress":
        return "bg-green-500/20 text-green-500 border-green-500/20";
      case "completed":
        return "bg-green-700/20 text-green-700 border-green-700/20";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusText = () => {
    switch (ride.status) {
      case "pending":
        return "Waiting for driver";
      case "accepted":
        return "Driver accepted";
      case "in-progress":
        return "On the way";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <Card
      className="glass-card overflow-hidden border-t-4 animate-fade-in"
      style={{ borderTopColor: "rgb(139, 92, 246)" }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">Your Ride</CardTitle>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor()}`}
          >
            {getStatusText()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          {ride.buggyId && (
            <div className="flex items-center space-x-3 text-sm">
              <Car className="h-4 w-4 text-primary" />
              <div>
                <span className="text-muted-foreground">Buggy:</span>{" "}
                {ride.buggyName}
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3 text-sm">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div>
              <span className="text-muted-foreground">From:</span>{" "}
              {ride.pickupLocation.name}
            </div>
          </div>

          <div className="flex items-start space-x-3 text-sm">
            <MapPin className="h-4 w-4 text-accent mt-0.5" />
            <div>
              <span className="text-muted-foreground">To:</span>{" "}
              {ride.dropoffLocation.name}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <Clock className="h-4 w-4 text-secondary" />
            <div>
              <span className="text-muted-foreground">Request time:</span>{" "}
              {formatTime(ride.requestTime)}
            </div>
          </div>

          {ride.estimatedArrival && (
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <span className="text-muted-foreground">
                  Estimated arrival:
                </span>{" "}
                {formatTime(ride.estimatedArrival)}
              </div>
            </div>
          )}

          {ride.estimatedDuration && (
            <div className="mt-2 bg-muted p-3 rounded-md text-center">
              <span className="text-muted-foreground">
                Estimated journey time:
              </span>
              <div className="text-xl font-semibold mt-1">
                {ride.estimatedDuration} mins
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {(ride.status === "pending" || ride.status === "accepted") && (
        <CardFooter className="pt-0">
          <Button variant="destructive" className="w-full" onClick={onCancel}>
            Cancel Ride
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RideStatusCard;
