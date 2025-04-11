
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapsLoaderProps {
  onMapLoad?: (map: google.maps.Map) => void;
  mapOptions?: google.maps.MapOptions;
  className?: string;
  apiKey?: string;
  center?: {lat: number, lng: number};
  zoom?: number;
  children?: React.ReactNode;
}

const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({
  onMapLoad,
  mapOptions = {},
  className = 'w-full h-full rounded-lg',
  apiKey = 'AIzaSyCdvLhjaihWCrkkUL-5KPhdSdtAeyfFRas',
  center,
  zoom = 14,
  children
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Create the map instance
    const createMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (mapRef.current) {
          const mapOptions: google.maps.MapOptions = {
            center: center || { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
            zoom,
            mapTypeControl: false,
            fullscreenControl: true,
            streetViewControl: false,
            zoomControl: true,
          };
          
          const map = new google.maps.Map(mapRef.current, mapOptions);
          setMapInstance(map);
          
          if (onMapLoad) {
            onMapLoad(map);
          }
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setMapError("Failed to load Google Maps. Please try again later.");
      }
    };

    createMap();
  }, [apiKey, center, zoom, onMapLoad]);

  // Provide map instance to children components
  const childrenWithMap = React.Children.map(children, child => {
    // Only add the map prop to valid React elements
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { map: mapInstance });
    }
    return child;
  });

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg p-4 text-center">
        <p className="text-destructive">{mapError}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full"></div>
      {mapInstance && childrenWithMap}
    </div>
  );
};

export default GoogleMapsLoader;
