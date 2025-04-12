
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ProfileEditor from '@/components/ProfileEditor';
import { Edit, MapPin, Mail, Phone, Calendar, Building, School, Globe, Bell, History, Award, Settings, Zap, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock user data - in a real app, this would come from your user management system
const initialUserData = {
  id: '123456',
  fullName: 'Jordan Peterson',
  email: 'jordan.peterson@university.edu',
  phone: '(555) 123-4567',
  profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  bio: 'Biochemistry student with an interest in medical research. Frequently uses campus buggies to get between the lab and classes on time!',
  departmentId: 'sci',
  address: '123 College Ave, Campus View Apartments #405',
  studentId: 'STU-2023-0789',
  joinDate: new Date('2023-09-15'),
  preferredLanguage: 'English',
  notificationPreference: 'Push',
  totalRides: 47,
  membershipStatus: 'premium',
};

// Department mapping
const departmentMap = {
  'eng': 'Engineering',
  'sci': 'Science',
  'bus': 'Business',
  'art': 'Arts & Humanities',
  'med': 'Medicine',
  'law': 'Law',
};

// Mock recent rides data
const recentRides = [
  { id: 'R-1001', date: new Date(2025, 3, 8), from: 'Science Building', to: 'Student Center', driver: 'Thomas G.' },
  { id: 'R-1000', date: new Date(2025, 3, 7), from: 'Main Library', to: 'Engineering Complex', driver: 'Rebecca L.' },
  { id: 'R-0999', date: new Date(2025, 3, 5), from: 'Student Center', to: 'Campus Housing', driver: 'Michael K.' },
];

// Mock achievements data
const achievements = [
  { id: 1, name: 'Early Adopter', description: 'One of the first 100 users to join', icon: <Zap className="h-5 w-5 text-amber-500" />, date: 'Sep 2023' },
  { id: 2, name: 'Frequent Rider', description: 'Completed more than 25 rides', icon: <Award className="h-5 w-5 text-primary" />, date: 'Dec 2023' },
  { id: 3, name: 'Premium Member', description: 'Upgraded to premium membership', icon: <Award className="h-5 w-5 text-violet-500" />, date: 'Jan 2024' },
];

const Profile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleProfileUpdate = (updatedData: any) => {
    setUserData({ ...userData, ...updatedData });
    setIsEditing(false);
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero section with gradient background and profile image */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 pt-16 pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              {userData.profilePicture ? (
                <AvatarImage src={userData.profilePicture} alt={userData.fullName} />
              ) : (
                <AvatarFallback className="text-4xl">
                  {userData.fullName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <h1 className="text-3xl font-bold mt-4 mb-2">{userData.fullName}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-center">
              <Badge variant={userData.membershipStatus === 'premium' ? 'default' : 'outline'} className="px-3 py-1">
                {userData.membershipStatus === 'premium' ? 'Premium Member' : 'Standard Member'}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                {userData.totalRides} Rides
              </Badge>
              <Badge variant="outline" className="bg-secondary/10 px-3 py-1">
                {departmentMap[userData.departmentId as keyof typeof departmentMap]}
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={handleEditToggle}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16">
        {isEditing ? (
          <ProfileEditor 
            userData={userData}
            onSave={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mx-auto bg-background/80 backdrop-blur-sm shadow-sm">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="rides">Ride History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Information Card */}
                <Card className="md:col-span-2 overflow-hidden border border-border/50 shadow-sm">
                  <CardHeader className="bg-card/50">
                    <CardTitle className="text-xl flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Personal Information
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
                          <p className="font-medium">{userData.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium">{userData.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p className="font-medium">
                            {userData.departmentId ? departmentMap[userData.departmentId as keyof typeof departmentMap] : 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <School className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Student ID</p>
                          <p className="font-medium">{userData.studentId || 'Not specified'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Member Since</p>
                          <p className="font-medium">{formatDate(userData.joinDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Language</p>
                          <p className="font-medium">{userData.preferredLanguage || 'English'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium mb-2 flex items-center">
                        <span>About Me</span>
                        <div className="h-px flex-grow bg-border/50 ml-3"></div>
                      </h3>
                      <p className="text-muted-foreground">
                        {userData.bio || 'No bio information provided.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional Information Card */}
                <Card className="shadow-sm border border-border/50">
                  <CardHeader className="bg-card/50">
                    <CardTitle className="text-xl flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-primary" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Address</h3>
                      <div className="flex gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-primary/70" />
                        <p>{userData.address || 'No address provided'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Notification Preference</h3>
                      <div className="flex gap-2 text-muted-foreground">
                        <Bell className="h-5 w-5 flex-shrink-0 text-primary/70" />
                        <p>{userData.notificationPreference || 'Email'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Account Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">{userData.totalRides}</p>
                          <p className="text-sm text-muted-foreground">Total Rides</p>
                        </div>
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold">
                            {userData.membershipStatus === 'premium' ? 'Premium' : 'Standard'}
                          </p>
                          <p className="text-sm text-muted-foreground">Membership</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('rides')}>
                        <History className="mr-2 h-4 w-4" />
                        Ride History
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('achievements')}>
                        <Award className="mr-2 h-4 w-4" />
                        Achievements
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="rides">
              <Card className="shadow-sm border border-border/50">
                <CardHeader className="bg-card/50">
                  <CardTitle className="text-xl flex items-center">
                    <History className="h-5 w-5 mr-2 text-primary" />
                    Recent Rides
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentRides.map((ride) => (
                      <div key={ride.id} className="p-4 bg-muted/50 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Ride #{ride.id}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(ride.date)}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">From</div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{ride.from}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">To</div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-accent" />
                              <span>{ride.to}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                          Driver: {ride.driver}
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full">
                      View All Rides
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card className="shadow-sm border border-border/50">
                <CardHeader className="bg-card/50">
                  <CardTitle className="text-xl flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border/40">
                        <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.date}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="font-medium">More Achievements to Unlock</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Continue using CampusBuggy to earn more achievements!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="shadow-sm border border-border/50">
                <CardHeader className="bg-card/50">
                  <CardTitle className="text-xl flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Account settings options will appear here.
                    </p>
                    <Button variant="outline" onClick={handleEditToggle}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Profile;
