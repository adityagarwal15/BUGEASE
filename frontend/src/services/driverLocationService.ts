// Mock implementation of a real-time driver location service
// In a real app, this would connect to a WebSocket or use Firebase Realtime Database

import { useEffect, useState } from "react";

// Define types for our location data
export interface DriverLocation {
  driverId: string;
  buggyId: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  status: "available" | "busy" | "maintenance" | "offline";
  heading: number; // Direction in degrees (0-359)
  speed: number; // km/h
  lastUpdated: Date;
}

// Initial mock data with driver locations
const initialDriverLocations: DriverLocation[] = [
  {
    driverId: "d1",
    buggyId: "B-101",
    name: "Campus Cruiser 1",
    position: { lat: 40.7128, lng: -74.006 },
    status: "available",
    heading: 45,
    speed: 15,
    lastUpdated: new Date(),
  },
  {
    driverId: "d2",
    buggyId: "B-102",
    name: "Campus Cruiser 2",
    position: { lat: 40.7138, lng: -74.008 },
    status: "busy",
    heading: 90,
    speed: 20,
    lastUpdated: new Date(),
  },
  {
    driverId: "d3",
    buggyId: "B-103",
    name: "Campus Cruiser 3",
    position: { lat: 40.7118, lng: -74.003 },
    status: "available",
    heading: 180,
    speed: 0,
    lastUpdated: new Date(),
  },
  {
    driverId: "d4",
    buggyId: "B-104",
    name: "Campus Cruiser 4",
    position: { lat: 40.7148, lng: -74.005 },
    status: "maintenance",
    heading: 270,
    speed: 0,
    lastUpdated: new Date(),
  },
  {
    driverId: "d5",
    buggyId: "B-105",
    name: "Campus Cruiser 5",
    position: { lat: 40.7158, lng: -74.009 },
    status: "available",
    heading: 135,
    speed: 10,
    lastUpdated: new Date(),
  },
];

// Simulate small movements for buggies to make the map look alive
const simulateMovement = (location: DriverLocation): DriverLocation => {
  // Only move if the buggy is available or busy and has non-zero speed
  if (
    (location.status === "available" || location.status === "busy") &&
    location.speed > 0
  ) {
    // Calculate movement based on heading and speed
    // This is a simplified model - in reality you'd use proper geolocation math
    const moveAmount = location.speed * 0.00001; // Scale speed to coordinate changes

    // Calculate new position based on heading
    const headingRad = (location.heading * Math.PI) / 180;
    const newLat = location.position.lat + Math.cos(headingRad) * moveAmount;
    const newLng = location.position.lng + Math.sin(headingRad) * moveAmount;

    // Randomly adjust heading occasionally to simulate turns
    let newHeading = location.heading;
    if (Math.random() > 0.8) {
      newHeading += (Math.random() - 0.5) * 30; // +/- 15 degrees
      newHeading = newHeading % 360;
      if (newHeading < 0) newHeading += 360;
    }

    // Randomly adjust speed occasionally
    let newSpeed = location.speed;
    if (Math.random() > 0.9) {
      newSpeed += (Math.random() - 0.5) * 5; // +/- 2.5 km/h
      if (newSpeed < 0) newSpeed = 0;
      if (newSpeed > 30) newSpeed = 30; // Cap at 30 km/h
    }

    return {
      ...location,
      position: { lat: newLat, lng: newLng },
      heading: newHeading,
      speed: newSpeed,
      lastUpdated: new Date(),
    };
  }

  // For maintenance or stopped buggies, just update timestamp
  return {
    ...location,
    lastUpdated: new Date(),
  };
};

// Custom hook to access driver locations with simulated updates
export const useDriverLocations = (updateInterval = 1000) => {
  const [locations, setLocations] = useState<DriverLocation[]>(
    initialDriverLocations
  );

  useEffect(() => {
    // Set up interval to simulate location updates
    const intervalId = setInterval(() => {
      setLocations(prevLocations =>
        prevLocations.map(location => simulateMovement(location))
      );
    }, updateInterval);

    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [updateInterval]);

  return { locations };
};

// Function to get a single driver's location by ID
export const getDriverLocationById = (
  id: string,
  locations: DriverLocation[]
) => {
  return locations.find(
    location => location.driverId === id || location.buggyId === id
  );
};

// Export service functions
export default {
  useDriverLocations,
  getDriverLocationById,
};
