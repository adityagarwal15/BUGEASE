import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { UserProfile } from "@/services/authService";

interface DriverProfileCardProps {
  profile: UserProfile | null;
  loading: boolean;
}

const DriverProfileCard: React.FC<DriverProfileCardProps> = ({
  profile,
  loading,
}) => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Driver Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        ) : profile ? (
          <>
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile.username}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">User Type</span>
                <Badge variant="default">Driver</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account ID</span>
                <span>{profile.id}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            Failed to load profile information
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverProfileCard;
