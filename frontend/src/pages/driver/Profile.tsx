import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, useAuth } from "@/services/authService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Key, AlertTriangle } from "lucide-react";

const DriverProfile = () => {
  const { toast } = useToast();
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [changePassword, setChangePassword] = useState(false);

  // Get user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getProfile, toast]);

  const togglePasswordChange = () => {
    setChangePassword(!changePassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    // In a real app, you would save changes to the server here
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Driver Profile</h1>
            <p className="text-muted-foreground">
              View and update your account information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Basic profile info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-muted rounded-full w-20 mx-auto"></div>
                    <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                  </div>
                ) : profile ? (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{profile.username}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>

                    <div className="mt-6 flex justify-center">
                      <Badge variant="success">Driver Account</Badge>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border text-left">
                      <div className="text-sm flex justify-between my-2">
                        <span className="text-muted-foreground">
                          Account ID:
                        </span>
                        <span>{profile.id}</span>
                      </div>
                      <div className="text-sm flex justify-between my-2">
                        <span className="text-muted-foreground">
                          User Type:
                        </span>
                        <span>Driver</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                    <p>Failed to load profile information</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Edit profile */}
          <div className="lg:col-span-8">
            <Card className="glass-panel">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Username field */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue={profile?.username || ""}
                      disabled={loading}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your username was created by the administrator and cannot
                      be changed.
                    </p>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue={profile?.email || ""}
                      disabled={loading}
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email was set by the administrator and cannot be
                      changed.
                    </p>
                  </div>

                  {/* Password fields */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Password
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={togglePasswordChange}
                      >
                        {changePassword ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    {changePassword && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <Input id="currentPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm Password
                          </Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverProfile;
