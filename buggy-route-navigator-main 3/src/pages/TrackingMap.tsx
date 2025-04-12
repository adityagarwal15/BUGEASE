
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockPendingRide } from '@/data/buggies'; // Keeping mock ride data for now until we have a real ride API
import LiveBuggyCard from '@/components/LiveBuggyCard';
import RideStatusCard from '@/components/RideStatusCard';
import { Eye, EyeOff, Layers, LucideIcon, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import GoogleMapsLoader from '@/components/GoogleMapsLoader';
import BuggyMarkerOnMap from '@/components/BuggyMarkerOnMap';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWebSocketLocations } from '@/services/websocketService';
import { trackingService, BuggyLocation } from '@/services/trackingService';
import { authService } from '@/services/authService';

interface MapLayer {
  id: string;
  name: string;
  active: boolean;
  icon: LucideIcon;
  disabled?: boolean;
}

// Campus coordinates from API or config
const CAMPUS_CENTER = { lat: 40.7128, lng: -74.006 }; // Default coordinates (should be replaced with actual campus center)

const TrackingMap = () => {
  const { toast } = useToast();
  const [activeRide] = useState(mockPendingRide); // We'll keep using mock ride data for now
  const [showControls, setShowControls] = useState(true);
  const [selectedBuggyId, setSelectedBuggyId] = useState<string | null>(null);
  const [showSidePanels, setShowSidePanels] = useState(true);
  const isMobile = useIsMobile();
  const [isRidePanelOpen, setIsRidePanelOpen] = useState(true);
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get all available buggies to subscribe to
  const [availableBuggyIds, setAvailableBuggyIds] = useState<number[]>([]);
  
  // Fetch available buggy IDs to subscribe to
  useEffect(() => {
    const fetchAvailableBuggyIds = async () => {
      try {
        const buggies = await trackingService.getAvailableBuggies();
        setAvailableBuggyIds(buggies.map(buggy => buggy.id));
      } catch (error) {
        console.error('Error fetching available buggy IDs:', error);
      }
    };
    
    fetchAvailableBuggyIds();
  }, []);
  
  // Get real-time driver locations from WebSocket
  const { locations: wsLocations, isConnected } = useWebSocketLocations(availableBuggyIds);
  
  // Store all locations from both API and WebSocket
  const [allLocations, setAllLocations] = useState<BuggyLocation[]>([]);
  
  // Fetch initial locations from API
  useEffect(() => {
    const fetchInitialLocations = async () => {
      if (!authService.isAuthenticated()) {
        // For demo purposes, allow viewing without auth
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const locations = await trackingService.getLiveLocations();
        setAllLocations(locations);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load buggy locations. Please try again.');
        toast({
          title: "Error loading locations",
          description: "Could not fetch buggy locations from server.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialLocations();
  }, [toast]);
  
  // Update locations when WebSocket data changes
  useEffect(() => {
    if (wsLocations.length > 0) {
      setAllLocations(prevLocations => {
        const newLocations = [...prevLocations];
        
        // Update or add locations from WebSocket
        wsLocations.forEach(wsLocation => {
          const existingIndex = newLocations.findIndex(
            loc => loc.buggy_number === wsLocation.buggy_number
          );
          
          if (existingIndex >= 0) {
            newLocations[existingIndex] = wsLocation;
          } else {
            newLocations.push(wsLocation);
          }
        });
        
        return newLocations;
      });
    }
  }, [wsLocations]);
  
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'buggies', name: 'Buggies', active: true, icon: Eye },
    { id: 'buildings', name: 'Buildings', active: false, icon: EyeOff, disabled: true },
    { id: 'routes', name: 'Routes', active: true, icon: Eye },
    { id: 'traffic', name: 'Traffic', active: false, icon: EyeOff, disabled: true },
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
        layer.id === id && !layer.disabled
          ? { ...layer, active: !layer.active, icon: layer.active ? EyeOff : Eye } 
          : layer
      )
    );
  };

  const handleBuggySelect = (id: string) => {
    setSelectedBuggyId(id);
    const buggy = allLocations.find(b => b.buggy_number === id);
    if (buggy) {
      toast({
        title: `Selected ${buggy.buggy_number}`,
        description: buggy.driver_name ? `Driver: ${buggy.driver_name}` : "No driver assigned",
      });
    }
  };
  
  // Convert BuggyLocation to format compatible with BuggyMarkerOnMap
  const transformLocationsForMap = (locations: BuggyLocation[]) => {
    return locations.map(location => ({
      buggyId: location.buggy_number,
      buggyName: location.buggy_number,
      position: { 
        lat: location.latitude, 
        lng: location.longitude 
      },
      status: location.status || 'offline',
      direction: location.direction || 0
    }));
  };

  // Modify the getBuggyForCard function to ensure status is properly mapped to the expected type
  const getBuggyForCard = (location: BuggyLocation) => {
    // Map the API status string to one of our allowed status values
    const mapStatus = (apiStatus?: string): "available" | "offline" | "busy" | "maintenance" => {
      if (!apiStatus) return "offline";
      
      switch(apiStatus.toLowerCase()) {
        case "available":
          return "available";
        case "busy":
          return "busy";
        case "maintenance":
          return "maintenance";
        default:
          return "offline";
      }
    };
    
    return {
      id: location.buggy_number,
      name: `Campus Cruiser ${location.buggy_number}`,
      status: mapStatus(location.status), // Apply the mapping function here
      driverName: location.driver_name || 'Unassigned',
      lastLocation: "Campus Area",
      location: { 
        lat: location.latitude, 
        lng: location.longitude 
      },
      capacity: 4, // Default capacity
      lastUpdated: new Date(location.last_updated)
    };
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Live Campus Map</h1>
          <p className="text-muted-foreground mt-1">
            Track buggies and rides in real-time across campus
            {isConnected && <span className="text-green-500 ml-2">• Live</span>}
          </p>
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}
        
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
                {mapLayers.find(l => l.id === 'buggies')?.active && 
                  transformLocationsForMap(allLocations).map((buggy) => (
                    <BuggyMarkerOnMap
                      key={buggy.buggyId}
                      buggyId={buggy.buggyId}
                      buggyName={buggy.buggyName}
                      position={buggy.position}
                      status={buggy.status}
                      onClick={() => handleBuggySelect(buggy.buggyId)}
                      isSelected={selectedBuggyId === buggy.buggyId}
                    />
                  ))
                }
              </GoogleMapsLoader>

              {/* WebSocket Connection Status */}
              <div className="absolute bottom-4 left-4 z-30 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                {isConnected ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Updates</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Static Data</span>
                  </div>
                )}
              </div>

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
                        className={`w-full justify-start text-xs h-8 ${layer.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => toggleLayer(layer.id)}
                        disabled={layer.disabled}
                      >
                        <layer.icon className="mr-2 h-3.5 w-3.5" />
                        {layer.name}
                        {layer.disabled && <span className="ml-auto text-xs text-muted-foreground">(Disabled)</span>}
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
                {isLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : allLocations.length > 0 ? (
                  <div className="space-y-3">
                    {allLocations
                      .filter(location => location.status === "available")
                      .map(location => (
                        <LiveBuggyCard 
                          key={location.buggy_number} 
                          buggy={getBuggyForCard(location)}
                          onSelect={() => handleBuggySelect(location.buggy_number)}
                          selected={selectedBuggyId === location.buggy_number}
                        />
                      ))
                    }
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No buggies available</p>
                    <p className="text-xs text-muted-foreground mt-1">Check back later or refresh</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
