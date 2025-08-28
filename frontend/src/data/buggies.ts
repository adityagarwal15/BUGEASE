export interface Buggy {
  id: string;
  name: string;
  driverName: string;
  status: "available" | "busy" | "offline" | "maintenance";
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  batteryLevel: number;
  lastUpdated: Date;
}

export interface RideRequest {
  id: string;
  userId: string;
  userName: string;
  pickupLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  requestTime: Date;
  buggyId?: string;
  buggyName?: string;
  estimatedArrival?: Date;
  estimatedDuration?: number;
}

export const mockBuggies: Buggy[] = [
  {
    id: "buggy-001",
    name: "Campus Hopper",
    driverName: "Alex Johnson",
    status: "available",
    location: { lat: 40.7128, lng: -74.006 },
    capacity: 4,
    batteryLevel: 85,
    lastUpdated: new Date(),
  },
  {
    id: "buggy-002",
    name: "Quad Runner",
    driverName: "Jamie Smith",
    status: "busy",
    location: { lat: 40.7138, lng: -74.009 },
    capacity: 6,
    batteryLevel: 72,
    lastUpdated: new Date(),
  },
  {
    id: "buggy-003",
    name: "Library Express",
    driverName: "Taylor Williams",
    status: "available",
    location: { lat: 40.7118, lng: -74.003 },
    capacity: 4,
    batteryLevel: 92,
    lastUpdated: new Date(),
  },
  {
    id: "buggy-004",
    name: "Science Shuttle",
    driverName: "Morgan Lee",
    status: "offline",
    location: { lat: 40.7148, lng: -74.008 },
    capacity: 6,
    batteryLevel: 45,
    lastUpdated: new Date(),
  },
  {
    id: "buggy-005",
    name: "Dorm Dasher",
    driverName: "Casey Brown",
    status: "maintenance",
    location: { lat: 40.7158, lng: -74.011 },
    capacity: 4,
    batteryLevel: 23,
    lastUpdated: new Date(),
  },
];

export const mockRideHistory: RideRequest[] = [
  {
    id: "ride-001",
    userId: "user-001",
    userName: "Jordan Peterson",
    pickupLocation: {
      name: "Student Union",
      lat: 40.7128,
      lng: -74.006,
    },
    dropoffLocation: {
      name: "Engineering Building",
      lat: 40.7138,
      lng: -74.009,
    },
    status: "completed",
    requestTime: new Date(Date.now() - 86400000), // 1 day ago
    buggyId: "buggy-002",
    buggyName: "Quad Runner",
    estimatedDuration: 8,
  },
  {
    id: "ride-002",
    userId: "user-001",
    userName: "Jordan Peterson",
    pickupLocation: {
      name: "Library",
      lat: 40.7118,
      lng: -74.003,
    },
    dropoffLocation: {
      name: "Student Housing",
      lat: 40.7148,
      lng: -74.008,
    },
    status: "completed",
    requestTime: new Date(Date.now() - 172800000), // 2 days ago
    buggyId: "buggy-001",
    buggyName: "Campus Hopper",
    estimatedDuration: 12,
  },
  {
    id: "ride-003",
    userId: "user-001",
    userName: "Jordan Peterson",
    pickupLocation: {
      name: "Recreation Center",
      lat: 40.7158,
      lng: -74.011,
    },
    dropoffLocation: {
      name: "Student Union",
      lat: 40.7128,
      lng: -74.006,
    },
    status: "cancelled",
    requestTime: new Date(Date.now() - 259200000), // 3 days ago
  },
];

export const mockPendingRide: RideRequest = {
  id: "ride-004",
  userId: "user-001",
  userName: "Jordan Peterson",
  pickupLocation: {
    name: "Student Housing",
    lat: 40.7148,
    lng: -74.008,
  },
  dropoffLocation: {
    name: "Library",
    lat: 40.7118,
    lng: -74.003,
  },
  status: "in-progress",
  requestTime: new Date(),
  buggyId: "buggy-003",
  buggyName: "Library Express",
  estimatedArrival: new Date(Date.now() + 300000), // 5 minutes from now
  estimatedDuration: 10,
};

export const campusLocations = [
  { name: "Student Union", lat: 40.7128, lng: -74.006 },
  { name: "Engineering Building", lat: 40.7138, lng: -74.009 },
  { name: "Library", lat: 40.7118, lng: -74.003 },
  { name: "Student Housing", lat: 40.7148, lng: -74.008 },
  { name: "Recreation Center", lat: 40.7158, lng: -74.011 },
  { name: "Science Complex", lat: 40.7135, lng: -74.012 },
  { name: "Arts Center", lat: 40.7115, lng: -74.009 },
  { name: "Health Services", lat: 40.7145, lng: -74.005 },
  { name: "Administration Building", lat: 40.7125, lng: -74.001 },
  { name: "Sports Field", lat: 40.7165, lng: -74.007 },
];
