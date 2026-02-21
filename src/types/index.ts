// ============================================
// FleetFlow — Type Definitions
// ============================================

export type UserRole = "admin" | "manager" | "driver" | "viewer";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  serialNumber?: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  category: string;
  status: "active" | "maintenance" | "inactive";
  mileage: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  distance?: number;
  fuelUsed?: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  date: string;
  cost: number;
  status: "scheduled" | "in-progress" | "completed";
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  totalTrips: number;
  rating: number;
  status: "available" | "on-trip" | "off-duty";
}
