
import React, { useEffect, useState } from 'react';

interface BuggyMarkerProps {
  map?: google.maps.Map;
  position: { lat: number; lng: number };
  buggyId: string;
  buggyName: string;
  status: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const BuggyMarkerOnMap = ({ 
  map, 
  position, 
  buggyId, 
  buggyName, 
  status, 
  onClick,
  isSelected = false 
}: BuggyMarkerProps) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map) return;

    // Get color based on status
    const getMarkerColor = () => {
      switch (status) {
        case 'available': return '#10B981'; // green
        case 'busy': return '#F59E0B'; // amber
        case 'maintenance': return '#EF4444'; // red
        default: return '#6B7280'; // gray
      }
    };
    
    const markerInstance = new google.maps.Marker({
      position,
      map,
      title: buggyName,
      animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: getMarkerColor(),
        fillOpacity: 0.8,
        strokeColor: isSelected ? '#FFFFFF' : getMarkerColor(),
        strokeWeight: isSelected ? 2 : 1,
        scale: isSelected ? 10 : 8
      }
    });

    // Create info window content for this marker
    const contentString = `
      <div style="padding: 8px; min-width: 150px;">
        <h3 style="margin: 0; font-weight: bold; color: #9b87f5;">${buggyName}</h3>
        <p style="margin: 4px 0;">Status: 
          <span style="color: ${getMarkerColor()}; font-weight: bold;">
            ${status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>
      </div>
    `;
    
    const infoWindowInstance = new google.maps.InfoWindow({
      content: contentString
    });
    
    markerInstance.addListener("click", () => {
      if (onClick) onClick();
      
      // Close all open info windows before opening this one
      if (map.get("openInfoWindow")) {
        (map.get("openInfoWindow") as google.maps.InfoWindow).close();
      }
      
      infoWindowInstance.open({
        anchor: markerInstance,
        map
      });
      
      // Store reference to currently open info window
      map.set("openInfoWindow", infoWindowInstance);
    });
    
    // If selected, open the info window
    if (isSelected) {
      infoWindowInstance.open({
        anchor: markerInstance,
        map
      });
      map.set("openInfoWindow", infoWindowInstance);
      
      // Center map on selected marker with animation
      map.panTo(position);
    }

    setMarker(markerInstance);
    setInfoWindow(infoWindowInstance);
    
    return () => {
      if (markerInstance) markerInstance.setMap(null);
      if (infoWindowInstance) infoWindowInstance.close();
    };
  }, [map, position, buggyId, buggyName, status, isSelected, onClick]);

  // Update marker position if changed
  useEffect(() => {
    if (marker && position) {
      marker.setPosition(position);
    }
  }, [marker, position]);

  // Update selected state
  useEffect(() => {
    if (!marker) return;
    
    marker.setAnimation(isSelected ? google.maps.Animation.BOUNCE : null);
    
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: status === 'available' ? '#10B981' : 
                status === 'busy' ? '#F59E0B' : 
                status === 'maintenance' ? '#EF4444' : '#6B7280',
      fillOpacity: 0.8,
      strokeColor: isSelected ? '#FFFFFF' : status === 'available' ? '#10B981' : 
                                  status === 'busy' ? '#F59E0B' : 
                                  status === 'maintenance' ? '#EF4444' : '#6B7280',
      strokeWeight: isSelected ? 2 : 1,
      scale: isSelected ? 10 : 8
    });
    
  }, [marker, isSelected, status]);

  return null; // This component doesn't render any visible React elements
};

export default BuggyMarkerOnMap;
