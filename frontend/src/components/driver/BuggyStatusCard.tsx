import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle } from "lucide-react";

interface BuggyDetails {
  id: number;
  number_plate: string;
  is_running: boolean;
}

interface BuggyStatusCardProps {
  buggy: BuggyDetails | null;
  isRunning: boolean;
  loading: boolean;
  onStatusToggle: (checked: boolean) => void;
}

const BuggyStatusCard: React.FC<BuggyStatusCardProps> = ({
  buggy,
  isRunning,
  loading,
  onStatusToggle,
}) => {
  const handleToggle = (checked: boolean) => {
    if (buggy) {
      onStatusToggle(checked);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Buggy Status</CardTitle>
        <CardDescription>Set your availability status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        ) : buggy ? (
          <>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Buggy Number</span>
                <span className="font-medium">{buggy.number_plate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Status</span>
                <Badge variant={isRunning ? "default" : "destructive"}>
                  {isRunning ? "Running" : "Idle"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2 border-t pt-6">
              <div>
                <h4 className="text-sm font-medium">Broadcasting Location</h4>
                <p className="text-xs text-muted-foreground">
                  {isRunning
                    ? "Your location is visible to students"
                    : "Set to running to broadcast your location"}
                </p>
              </div>
              <Switch checked={isRunning} onCheckedChange={handleToggle} />
            </div>

            {isRunning && (
              <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm flex items-center">
                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                <span>GPS Location broadcasting active</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-amber-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-80" />
            <p className="font-medium">No buggy assigned</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please contact an administrator
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuggyStatusCard;
