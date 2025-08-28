import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  isRunning: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ isRunning }) => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Today's Trips</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hours Active</span>
            <span className="font-medium">0h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={isRunning ? "default" : "destructive"}>
              {isRunning ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
