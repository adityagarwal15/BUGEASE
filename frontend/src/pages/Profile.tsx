import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Loader2 } from "lucide-react";
import { UserProfile, useAuth } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config";

const Profile = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinDate, setJoinDate] = useState<string | null>(null);
  const { getProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const profile = await getProfile();
        setUserData(profile);

        // Try to get joined date if available
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${API_BASE_URL}/user/get-doj`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setJoinDate(data.joined_date);
          }
        } catch (error) {
          console.error("Error fetching join date:", error);
          // Set a fallback date if fetching fails
          setJoinDate("April 2025");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [getProfile, toast]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero section with gradient background and profile image */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarFallback className="text-4xl font-medium bg-primary text-primary-foreground">
                {userData?.first_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 mb-2">
              {userData?.first_name} {userData?.last_name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                Student
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="bg-card/50">
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">
                    {userData?.email || "No email provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {joinDate ? formatDate(joinDate) : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
