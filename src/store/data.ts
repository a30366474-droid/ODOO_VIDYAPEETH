// Centralized mock data store for FleetFlow
// This acts as a simple in-memory database for the app

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  type: string;
  capacity: string;
  odometer: number;
  status: "Idle" | "On Trip" | "Maintenance" | "Retired";
}

export interface Trip {
  id: number;
  vehicle: string;
  driver: string;
  fleetType: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  fuelCost: number;
  status: "On Trip" | "Completed" | "Scheduled" | "Cancelled";
  createdAt: Date;
}

export interface ServiceLog {
  id: number;
  vehicle: string;
  issueService: string;
  date: string;
  cost: number;
  status: "New" | "In Progress" | "Completed" | "Cancelled";
}

export interface Expense {
  id: number;
  tripId: number;
  driver: string;
  distance: number;
  fuelExpense: number;
  miscExpense: number;
  status: "Done" | "Pending" | "In Review" | "Rejected";
}

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  completionRate: number;
  safetyScore: number;
  complaints: number;
  phone: string;
  status: "Active" | "On Leave" | "Suspended" | "Inactive";
}

// Initial mock data
export const initialVehicles: Vehicle[] = [
  { id: 1, plate: "MH DD 2017", model: "Ace", type: "Mini Truck", capacity: "1 tonn", odometer: 45000, status: "Idle" },
  { id: 2, plate: "MH 12 AB 3456", model: "Eicher Pro", type: "Truck", capacity: "5 tonn", odometer: 79000, status: "On Trip" },
  { id: 3, plate: "MH 14 CD 7890", model: "Tata 407", type: "Truck", capacity: "3 tonn", odometer: 62000, status: "Maintenance" },
  { id: 4, plate: "MH 04 EF 1234", model: "Mahindra Bolero", type: "Pickup", capacity: "1.5 tonn", odometer: 38000, status: "Idle" },
  { id: 5, plate: "MH 20 GH 5678", model: "Ashok Leyland", type: "Trailer", capacity: "15 tonn", odometer: 120000, status: "On Trip" },
  { id: 6, plate: "MH 43 IJ 9012", model: "Force Traveller", type: "Van", capacity: "2 tonn", odometer: 55000, status: "Idle" },
];

export const initialTrips: Trip[] = [
  { id: 1, vehicle: "MH 12 AB 3456", driver: "John Doe", fleetType: "Trailer Truck", origin: "Mumbai", destination: "Pune", cargoWeight: 5000, fuelCost: 4500, status: "On Trip", createdAt: new Date() },
  { id: 2, vehicle: "MH 20 GH 5678", driver: "Raj Kumar", fleetType: "Trailer", origin: "Delhi", destination: "Jaipur", cargoWeight: 12000, fuelCost: 8500, status: "On Trip", createdAt: new Date() },
  { id: 3, vehicle: "MH DD 2017", driver: "Amit Patel", fleetType: "Mini Truck", origin: "Pune", destination: "Nashik", cargoWeight: 800, fuelCost: 1200, status: "Completed", createdAt: new Date() },
  { id: 4, vehicle: "MH 04 EF 1234", driver: "Jane Smith", fleetType: "Pickup", origin: "Chennai", destination: "Bangalore", cargoWeight: 1200, fuelCost: 3200, status: "Scheduled", createdAt: new Date() },
];

export const initialServiceLogs: ServiceLog[] = [
  { id: 321, vehicle: "TATA 407", issueService: "Engine Issue", date: "2026-02-20", cost: 10000, status: "New" },
  { id: 322, vehicle: "Eicher Pro", issueService: "Oil Change", date: "2026-02-18", cost: 2500, status: "Completed" },
  { id: 323, vehicle: "Mahindra Bolero", issueService: "Brake Pads", date: "2026-02-15", cost: 4500, status: "In Progress" },
  { id: 324, vehicle: "Ashok Leyland", issueService: "Tire Replacement", date: "2026-02-12", cost: 18000, status: "Completed" },
  { id: 325, vehicle: "Force Traveller", issueService: "AC Repair", date: "2026-02-10", cost: 6500, status: "Cancelled" },
];

export const initialExpenses: Expense[] = [
  { id: 1, tripId: 321, driver: "John", distance: 1000, fuelExpense: 79000, miscExpense: 3000, status: "Done" },
  { id: 2, tripId: 322, driver: "Raj Kumar", distance: 850, fuelExpense: 65000, miscExpense: 2500, status: "Pending" },
  { id: 3, tripId: 323, driver: "Amit Patel", distance: 1200, fuelExpense: 92000, miscExpense: 4000, status: "In Review" },
  { id: 4, tripId: 324, driver: "Jane Smith", distance: 450, fuelExpense: 35000, miscExpense: 1500, status: "Done" },
  { id: 5, tripId: 325, driver: "Priya Sharma", distance: 780, fuelExpense: 58000, miscExpense: 2000, status: "Rejected" },
  { id: 6, tripId: 326, driver: "Suresh Kumar", distance: 920, fuelExpense: 71000, miscExpense: 3500, status: "Pending" },
];

export const initialDrivers: Driver[] = [
  { id: 1, name: "John Doe", licenseNumber: "2322322", licenseExpiry: "22/36", completionRate: 92, safetyScore: 89, complaints: 4, phone: "+91 98765 43210", status: "Active" },
  { id: 2, name: "John Smith", licenseNumber: "2122322", licenseExpiry: "22/36", completionRate: 42, safetyScore: 94, complaints: 0, phone: "+91 98765 43211", status: "Active" },
  { id: 3, name: "John Kumar", licenseNumber: "3312821", licenseExpiry: "21/38", completionRate: 42, safetyScore: 94, complaints: 0, phone: "+91 98765 43212", status: "Active" },
  { id: 4, name: "Raj Kumar", licenseNumber: "4521789", licenseExpiry: "15/27", completionRate: 88, safetyScore: 91, complaints: 2, phone: "+91 98765 43213", status: "Active" },
  { id: 5, name: "Amit Patel", licenseNumber: "6789012", licenseExpiry: "08/28", completionRate: 95, safetyScore: 97, complaints: 1, phone: "+91 98765 43214", status: "Active" },
  { id: 6, name: "Jane Smith", licenseNumber: "1234567", licenseExpiry: "30/29", completionRate: 78, safetyScore: 85, complaints: 3, phone: "+91 98765 43215", status: "On Leave" },
  { id: 7, name: "Priya Sharma", licenseNumber: "8901234", licenseExpiry: "12/27", completionRate: 91, safetyScore: 93, complaints: 0, phone: "+91 98765 43216", status: "Active" },
  { id: 8, name: "Suresh Kumar", licenseNumber: "5678901", licenseExpiry: "25/28", completionRate: 85, safetyScore: 88, complaints: 2, phone: "+91 98765 43217", status: "Active" },
  { id: 9, name: "Vikram Singh", licenseNumber: "3456789", licenseExpiry: "18/26", completionRate: 72, safetyScore: 79, complaints: 5, phone: "+91 98765 43218", status: "Suspended" },
  { id: 10, name: "Deepak Verma", licenseNumber: "9012345", licenseExpiry: "05/29", completionRate: 96, safetyScore: 98, complaints: 0, phone: "+91 98765 43219", status: "Active" },
  { id: 11, name: "Rahul Gupta", licenseNumber: "7890123", licenseExpiry: "28/27", completionRate: 83, safetyScore: 86, complaints: 1, phone: "+91 98765 43220", status: "Active" },
  { id: 12, name: "Sanjay Mishra", licenseNumber: "4567890", licenseExpiry: "10/28", completionRate: 89, safetyScore: 92, complaints: 2, phone: "+91 98765 43221", status: "Inactive" },
  { id: 13, name: "Anil Yadav", licenseNumber: "2345678", licenseExpiry: "15/29", completionRate: 94, safetyScore: 95, complaints: 0, phone: "+91 98765 43222", status: "Active" },
  { id: 14, name: "Manoj Tiwari", licenseNumber: "0123456", licenseExpiry: "22/27", completionRate: 77, safetyScore: 82, complaints: 4, phone: "+91 98765 43223", status: "Active" },
];

// Driver options for trip form
export const drivers = [
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
  { value: "raj-kumar", label: "Raj Kumar" },
  { value: "amit-patel", label: "Amit Patel" },
  { value: "priya-sharma", label: "Priya Sharma" },
];

// Vehicle types for filters
export const vehicleTypes = [
  { value: "", label: "All Types" },
  { value: "Truck", label: "Truck" },
  { value: "Mini Truck", label: "Mini Truck" },
  { value: "Trailer", label: "Trailer" },
  { value: "Van", label: "Van" },
  { value: "Pickup", label: "Pickup" },
];

// Status options
export const vehicleStatuses = [
  { value: "", label: "All Status" },
  { value: "Idle", label: "Idle" },
  { value: "On Trip", label: "On Trip" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Retired", label: "Retired" },
];

export const tripStatuses = [
  { value: "", label: "All Status" },
  { value: "On Trip", label: "On Trip" },
  { value: "Completed", label: "Completed" },
  { value: "Scheduled", label: "Scheduled" },
  { value: "Cancelled", label: "Cancelled" },
];

export const serviceStatuses = [
  { value: "", label: "All Status" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export const expenseStatuses = [
  { value: "", label: "All Status" },
  { value: "Done", label: "Done" },
  { value: "Pending", label: "Pending" },
  { value: "In Review", label: "In Review" },
  { value: "Rejected", label: "Rejected" },
];

export const driverStatuses = [
  { value: "", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "On Leave", label: "On Leave" },
  { value: "Suspended", label: "Suspended" },
  { value: "Inactive", label: "Inactive" },
];

export const costRanges = [
  { value: "", label: "All Costs" },
  { value: "0-5000", label: "₹0 - ₹5,000" },
  { value: "5000-10000", label: "₹5,000 - ₹10,000" },
  { value: "10000+", label: "₹10,000+" },
];

// Sort options
export const sortOptions = [
  { value: "", label: "Default" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

// Group by options
export const groupByOptions = [
  { value: "", label: "No Grouping" },
  { value: "status", label: "By Status" },
  { value: "type", label: "By Type" },
];
