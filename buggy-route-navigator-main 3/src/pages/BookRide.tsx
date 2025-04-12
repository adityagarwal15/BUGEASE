import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { mockBuggies, campusLocations, RideRequest } from '@/data/buggies';
import LiveBuggyCard from '@/components/LiveBuggyCard';
import { MapPin, CalendarClock, Clock, ChevronRight, Route } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Helper function to adapt data buggies to the format LiveBuggyCard expects
const adaptBuggyForCard = (buggy) => ({
  ...buggy,
  id: buggy.id.toString(),
  lastLocation: "Campus Area", // Provide default lastLocation
  driverName: buggy.driverName || "Unassigned",
  status: buggy.status || "offline"
});

const BookRide = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const availableBuggies = mockBuggies
    .filter(buggy => buggy.status === "available")
    .map(adaptBuggyForCard); // Transform buggies to match LiveBuggyCard's expectations
  
  const [bookingStep, setBookingStep] = useState<1|2|3>(1);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedBuggy, setSelectedBuggy] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleContinue = () => {
    if (bookingStep === 1) {
      if (!pickup || !dropoff) {
        toast({
          title: "Missing information",
          description: "Please select pickup and dropoff locations",
          variant: "destructive"
        });
        return;
      }
      
      if (pickup === dropoff) {
        toast({
          title: "Invalid selection",
          description: "Pickup and dropoff locations must be different",
          variant: "destructive"
        });
        return;
      }
      
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!selectedBuggy) {
        toast({
          title: "Missing information",
          description: "Please select a buggy for your ride",
          variant: "destructive"
        });
        return;
      }
      
      setBookingStep(3);
    } else {
      handleBookRide();
    }
  };
  
  const handleBack = () => {
    if (bookingStep > 1) {
      setBookingStep(prev => (prev - 1) as 1|2|3);
    }
  };
  
  const handleBookRide = () => {
    setIsProcessing(true);
    
    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Ride booked successfully!",
        description: "Your ride has been booked and a buggy is on the way.",
      });
      navigate("/dashboard");
    }, 1500);
  };
  
  const renderStepContent = () => {
    switch(bookingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <Select value={pickup} onValueChange={setPickup}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    {campusLocations.map(location => (
                      <SelectItem key={`pickup-${location.name}`} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Dropoff Location</label>
                <Select value={dropoff} onValueChange={setDropoff}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select dropoff location" />
                  </SelectTrigger>
                  <SelectContent>
                    {campusLocations.map(location => (
                      <SelectItem key={`dropoff-${location.name}`} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {pickup && dropoff && pickup !== dropoff && (
              <Card className="bg-muted border-none">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Route className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Estimated Info</p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>~10 mins</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>0.8 miles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select an available buggy for your ride from {pickup} to {dropoff}
            </p>
            
            <div className="grid gap-4">
              {availableBuggies.length > 0 ? (
                availableBuggies.map(buggy => (
                  <LiveBuggyCard
                    key={buggy.id}
                    buggy={buggy}
                    onSelect={() => setSelectedBuggy(buggy.id)}
                    selected={selectedBuggy === buggy.id}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No buggies available at the moment.</p>
                </div>
              )}
            </div>
          </div>
        );
      
      case 3:
        const selectedBuggyData = availableBuggies.find(b => b.id === selectedBuggy);
        const pickupLocation = campusLocations.find(loc => loc.name === pickup);
        const dropoffLocation = campusLocations.find(loc => loc.name === dropoff);

        const rideDetails: RideRequest = {
          id: `ride-${Date.now()}`,
          userId: "user-001",
          userName: "Jordan Peterson",
          pickupLocation: {
            name: pickup,
            lat: pickupLocation?.lat || 0,
            lng: pickupLocation?.lng || 0,
          },
          dropoffLocation: {
            name: dropoff,
            lat: dropoffLocation?.lat || 0,
            lng: dropoffLocation?.lng || 0,
          },
          status: "pending",
          requestTime: new Date(),
          buggyId: selectedBuggy,
          buggyName: selectedBuggyData?.name,
          estimatedArrival: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
          estimatedDuration: 10,
        };
        
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ride Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{pickup}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{dropoff}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CalendarClock className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">Now</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Duration</p>
                    <p className="font-medium">10 minutes</p>
                  </div>
                </div>
              </div>
              
              <Card className="bg-muted border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Selected Buggy</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedBuggyData?.name}</p>
                      <p className="text-xs text-muted-foreground">Driver: {selectedBuggyData?.driverName}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedBuggyData?.status === 'available' ? 'bg-green-500/20 text-green-500' : ''
                    }`}>
                      {selectedBuggyData?.status}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-1">Book a Campus Buggy</h1>
          <p className="text-muted-foreground mb-6">Schedule a ride around campus</p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === bookingStep
                      ? "bg-primary text-primary-foreground"
                      : step < bookingStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step}
                </div>
                {step < 3 && (
                  <ChevronRight 
                    className={cn(
                      "w-5 h-5 mx-1",
                      step < bookingStep ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center text-xs">
            <div className={bookingStep === 1 ? "text-primary font-medium" : "text-muted-foreground"}>
              Locations
            </div>
            <div className={bookingStep === 2 ? "text-primary font-medium" : "text-muted-foreground"}>
              Select Buggy
            </div>
            <div className={bookingStep === 3 ? "text-primary font-medium" : "text-muted-foreground"}>
              Confirm
            </div>
          </div>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between">
              {bookingStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button 
                onClick={handleContinue}
                disabled={isProcessing}
              >
                {bookingStep === 3 ? (
                  isProcessing ? "Processing..." : "Confirm Booking"
                ) : (
                  "Continue"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookRide;
