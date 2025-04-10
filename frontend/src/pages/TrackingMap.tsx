import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockBuggies, mockPendingRide } from '@/data/buggies';
import LiveBuggyCard from '@/components/LiveBuggyCard';
import RideStatusCard from '@/components/RideStatusCard';
import { Eye, EyeOff, Layers, LucideIcon, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import GoogleMapsLoader from '@/components/GoogleMapsLoader';
import BuggyMarkerOnMap from '@/components/BuggyMarkerOnMap';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useDriverLocations } from '@/services/driverLocationService';

interface MapLayer {
  id: string;
  name: string;
  active: boolean;
  icon: LucideIcon;
}

// Simulating campus coordinates - replace with actual campus coordinates
const CAMPUS_CENTER = { lat:13.3473, lng: 74.7933 }; // Example: Manipal, India

const TrackingMap = () => {
  const { toast } = useToast();
  const [activeRide] = useState(mockPendingRide);
  const [showControls, setShowControls] = useState(true);
  const [selectedBuggyId, setSelectedBuggyId] = useState<string | null>(null);
  const [showSidePanels, setShowSidePanels] = useState(true);
  const isMobile = useIsMobile();
  const [isRidePanelOpen, setIsRidePanelOpen] = useState(true);
  
  // Get real-time driver locations
  const { locations: driverLocations } = useDriverLocations(1000);
  
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'buggies', name: 'Buggies', active: true, icon: Eye },
    { id: 'buildings', name: 'Buildings', active: true, icon: Eye },
    { id: 'routes', name: 'Routes', active: true, icon: Eye },
    { id: 'traffic', name: 'Traffic', active: false, icon: EyeOff },
  ]);
  
  const handleCancelRide = () => {
    toast({
      title: "Ride cancelled",
      description: "Your ride has been cancelled successfully.",
    });
  };
  
  const toggleLayer = (id: string) => {
    setMapLayers(layers => 
      layers.map(layer => 
        layer.id === id 
          ? { ...layer, active: !layer.active, icon: layer.active ? EyeOff : Eye } 
          : layer
      )
    );
  };

  const handleBuggySelect = (id: string) => {
    setSelectedBuggyId(id);
    const buggy = mockBuggies.find(b => b.id === id);
    toast({
      title: `Selected ${buggy?.name}`,
      description: `Driver: ${buggy?.driverName}`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Live Campus Map</h1>
          <p className="text-muted-foreground mt-1">Track buggies and rides in real-time across campus</p>
        </div>
        
        {/* Main layout container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar - Only visible on desktop */}
          {!isMobile && showSidePanels && (
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <Collapsible open={isRidePanelOpen} onOpenChange={setIsRidePanelOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full flex justify-between items-center mb-2"
                  >
                    <span>Active Ride</span>
                    <span>{isRidePanelOpen ? '−' : '+'}</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="sticky top-24">
                    <RideStatusCard ride={activeRide} onCancel={handleCancelRide} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
          
          {/* Map Container - Takes full width on mobile, center space on desktop */}
          <div className={cn(
            "lg:col-span-6",
            !showSidePanels && "lg:col-span-12",
            isMobile && !showSidePanels && "col-span-1"
          )}>
            <Card className="glass-panel h-[calc(100vh-200px)] md:h-[600px] w-full relative overflow-hidden border-primary/10">
              {/* Toggle Panels Button for Mobile */}
              {isMobile && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowSidePanels(!showSidePanels)}
                  className="absolute top-4 left-4 z-30 opacity-80 hover:opacity-100"
                >
                  {showSidePanels ? "Hide Panels" : "Show Panels"}
                </Button>
              )}
              
              {/* Google Maps Integration */}
              <GoogleMapsLoader 
                className="w-full h-full"
                center={CAMPUS_CENTER}
                zoom={16}
              >
                {mapLayers.find(l => l.id === 'buggies')?.active && driverLocations.map((driver) => (
                  <BuggyMarkerOnMap
                    key={driver.buggyId}
                    buggyId={driver.buggyId}
                    buggyName={driver.name}
                    position={driver.position}
                    status={driver.status}
                    onClick={() => handleBuggySelect(driver.buggyId)}
                    isSelected={selectedBuggyId === driver.buggyId}
                  />
                ))}
              </GoogleMapsLoader>

              {/* Map Controls */}
              <div className={`absolute top-4 right-4 transition-all duration-300 ${showControls ? 'translate-x-0' : 'translate-x-full'}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -left-12 bg-card/80 backdrop-blur-sm border border-border shadow-md"
                  onClick={() => setShowControls(!showControls)}
                >
                  {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                
                <Card className="glass-panel w-[220px] shadow-lg">
                  <CardHeader className="p-3 pb-1.5">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4" /> Map Layers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 space-y-2">
                    {mapLayers.map(layer => (
                      <Button
                        key={layer.id}
                        variant={layer.active ? "secondary" : "outline"}
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => toggleLayer(layer.id)}
                      >
                        <layer.icon className="mr-2 h-3.5 w-3.5" />
                        {layer.name}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Mobile View Toggle Button */}
              {!isMobile && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSidePanels(!showSidePanels)}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-sm"
                >
                  {showSidePanels ? "Expand Map" : "Show Panels"}
                </Button>
              )}
            </Card>
            
            {/* Mobile: Active Ride Panel (only shown when panels are visible) */}
            {isMobile && showSidePanels && (
              <div className="mt-6">
                <Collapsible open={isRidePanelOpen} onOpenChange={setIsRidePanelOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex justify-between items-center mb-2"
                    >
                      <span>Active Ride</span>
                      <span>{isRidePanelOpen ? '−' : '+'}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <RideStatusCard ride={activeRide} onCancel={handleCancelRide} />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
          
          {/* Right sidebar - Only visible on desktop or mobile when panels are shown */}
          <div className={cn(
            "lg:col-span-3",
            !showSidePanels && "hidden lg:hidden",
            isMobile && !showSidePanels && "hidden"
          )}>
            <Card className="glass-panel sticky top-24">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Available Buggies</CardTitle>
                <Link to="/book" className="text-xs text-primary hover:underline flex items-center">
                  Book a Ride
                </Link>
              </CardHeader>
              <CardContent className="p-4 pt-2 max-h-[500px] md:max-h-[550px] overflow-y-auto">
                <div className="space-y-3">
                  {/* Convert driver locations to a format compatible with LiveBuggyCard */}
                  {driverLocations
                    .filter(driver => driver.status === "available")
                    .map(driver => {
                      const buggy = {
                        id: driver.buggyId,
                        name: driver.name,
                        status: driver.status,
                        driverName: `Driver ${driver.driverId.replace('d', '')}`,
                        batteryLevel: Math.floor(Math.random() * 100),
                        lastLocation: "Campus Area",
                        // Add the missing properties required by Buggy interface
                        location: driver.position,
                        capacity: 4, // Default capacity
                        lastUpdated: driver.lastUpdated
                      };
                      
                      return (
                        <LiveBuggyCard 
                          key={buggy.id} 
                          buggy={buggy} 
                          onSelect={() => handleBuggySelect(buggy.id)}
                          selected={selectedBuggyId === buggy.id}
                        />
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
