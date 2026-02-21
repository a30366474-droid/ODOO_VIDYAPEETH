"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Clock, Package, User, Truck, Edit, Trash2, X, Eye, Navigation } from "lucide-react";
import { initialTrips, initialDrivers, initialVehicles, Trip, Driver, Vehicle } from "@/store/data";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import ExportButtons from "@/components/ui/ExportButtons";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/components/trips/TripMap"), { ssr: false });

const statusStyles: Record<string, string> = {
  "On Trip": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Scheduled": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Completed": "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  "Cancelled": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TripsPage() {
  const [trips, setTrips] = useLocalStorage<Trip[]>("fleetflow-trips", initialTrips);
  const [drivers, setDrivers] = useLocalStorage<Driver[]>("fleetflow-drivers", initialDrivers);
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>("fleetflow-vehicles", initialVehicles);
  
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  
  const [newTrip, setNewTrip] = useState({
    origin: "",
    destination: "",
    driver: "",
    vehicle: "",
    fleetType: "",
    cargoWeight: "",
    fuelCost: "",
  });

  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    model: "",
    type: "Truck",
    capacity: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTrip = () => {
    const trip: Trip = {
      id: trips.length + 1,
      origin: newTrip.origin,
      destination: newTrip.destination,
      driver: newTrip.driver,
      vehicle: newTrip.vehicle,
      fleetType: newTrip.fleetType,
      cargoWeight: parseInt(newTrip.cargoWeight) || 0,
      fuelCost: parseInt(newTrip.fuelCost) || 0,
      status: "Scheduled",
      createdAt: new Date(),
    };
    setTrips([...trips, trip]);
    setNewTrip({
      origin: "",
      destination: "",
      driver: "",
      vehicle: "",
      fleetType: "",
      cargoWeight: "",
      fuelCost: "",
    });
    setShowNewTripForm(false);
  };

  const handleUpdateTrip = () => {
    if (!editingTrip) return;
    setTrips(trips.map((t) => (t.id === editingTrip.id ? editingTrip : t)));
    setEditingTrip(null);
  };

  const handleDeleteTrip = (id: number) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      setTrips(trips.filter((t) => t.id !== id));
    }
  };

  const handleAddDriver = () => {
    const driver: Driver = {
      id: drivers.length + 1,
      name: newDriver.name,
      phone: newDriver.phone,
      licenseNumber: newDriver.licenseNumber,
      licenseExpiry: newDriver.licenseExpiry,
      status: "Active",
      completionRate: 100,
      safetyScore: 100,
      complaints: 0,
    };
    setDrivers([...drivers, driver]);
    setNewDriver({ name: "", phone: "", licenseNumber: "", licenseExpiry: "" });
    setShowAddDriverForm(false);
    setNewTrip({ ...newTrip, driver: driver.name });
  };

  const handleAddVehicle = () => {
    const vehicle: Vehicle = {
      id: vehicles.length + 1,
      plate: newVehicle.plate,
      model: newVehicle.model,
      type: newVehicle.type,
      capacity: newVehicle.capacity,
      status: "Idle",
      odometer: 0,
    };
    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ plate: "", model: "", type: "Truck", capacity: "" });
    setShowAddVehicleForm(false);
    setNewTrip({ ...newTrip, vehicle: vehicle.plate });
  };

  const exportColumns = [
    { key: "id" as const, header: "ID" },
    { key: "origin" as const, header: "Origin" },
    { key: "destination" as const, header: "Destination" },
    { key: "driver" as const, header: "Driver" },
    { key: "vehicle" as const, header: "Vehicle" },
    { key: "fleetType" as const, header: "Fleet Type" },
    { key: "cargoWeight" as const, header: "Cargo (kg)" },
    { key: "fuelCost" as const, header: "Fuel Cost" },
    { key: "status" as const, header: "Status" },
  ];

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Dispatcher</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track all fleet trips</p>
        </div>
        <div className="flex gap-3">
          <ExportButtons data={filteredTrips} filename="trips" title="Fleet Trips Report" columns={exportColumns} />
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <Navigation className="w-4 h-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </button>
          <button
            onClick={() => setShowNewTripForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>
      </div>

      {showMap && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Fleet Map</h3>
          <TripMap />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="On Trip">On Trip</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{trip.id}</span>
                  <span className={"px-2 py-1 rounded-full text-xs font-medium " + statusStyles[trip.status]}>
                    {trip.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{trip.fleetType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {trip.origin} → {trip.destination}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {trip.driver}
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" /> {trip.vehicle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" /> {trip.cargoWeight} kg
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> ₹{trip.fuelCost}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTrip(trip)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingTrip(trip)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTrips.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No trips found matching your criteria.
        </div>
      )}

      {showNewTripForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Trip</h2>
              <button onClick={() => setShowNewTripForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                  <input
                    type="text"
                    value={newTrip.origin}
                    onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g. Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g. Pune"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Driver</label>
                <select
                  value={newTrip.driver}
                  onChange={(e) => {
                    if (e.target.value === "__add_new__") {
                      setShowAddDriverForm(true);
                    } else {
                      setNewTrip({ ...newTrip, driver: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select Driver</option>
                  {drivers.filter(d => d.status === "Active").map((driver) => (
                    <option key={driver.id} value={driver.name}>{driver.name}</option>
                  ))}
                  <option value="__add_new__">+ Add New Driver...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle</label>
                <select
                  value={newTrip.vehicle}
                  onChange={(e) => {
                    if (e.target.value === "__add_new__") {
                      setShowAddVehicleForm(true);
                    } else {
                      setNewTrip({ ...newTrip, vehicle: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.filter(v => v.status === "Idle").map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.plate}>
                      {vehicle.model} ({vehicle.plate})
                    </option>
                  ))}
                  <option value="__add_new__">+ Add New Vehicle...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fleet Type</label>
                <select
                  value={newTrip.fleetType}
                  onChange={(e) => setNewTrip({ ...newTrip, fleetType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select Fleet Type</option>
                  <option value="Truck">Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Trailer">Trailer</option>
                  <option value="Van">Van</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={newTrip.cargoWeight}
                    onChange={(e) => setNewTrip({ ...newTrip, cargoWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Cost (₹)</label>
                  <input
                    type="number"
                    value={newTrip.fuelCost}
                    onChange={(e) => setNewTrip({ ...newTrip, fuelCost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="e.g. 4500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewTripForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTrip}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddDriverForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Driver</h2>
              <button onClick={() => setShowAddDriverForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Number *</label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. 1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Expiry *</label>
                <input
                  type="text"
                  value={newDriver.licenseExpiry}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. 22/28"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddDriverForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDriver}
                  disabled={!newDriver.name || !newDriver.phone || !newDriver.licenseNumber || !newDriver.licenseExpiry}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddVehicleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Vehicle</h2>
              <button onClick={() => setShowAddVehicleForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Plate *</label>
                <input
                  type="text"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. MH 12 AB 1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model *</label>
                <input
                  type="text"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. Tata 407"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Truck">Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Trailer">Trailer</option>
                  <option value="Van">Van</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity *</label>
                <input
                  type="text"
                  value={newVehicle.capacity}
                  onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="e.g. 5 tonn"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddVehicleForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVehicle}
                  disabled={!newVehicle.plate || !newVehicle.model || !newVehicle.capacity}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Trip #{editingTrip.id}</h2>
              <button onClick={() => setEditingTrip(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                  <input
                    type="text"
                    value={editingTrip.origin}
                    onChange={(e) => setEditingTrip({ ...editingTrip, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                  <input
                    type="text"
                    value={editingTrip.destination}
                    onChange={(e) => setEditingTrip({ ...editingTrip, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={editingTrip.status}
                  onChange={(e) => setEditingTrip({ ...editingTrip, status: e.target.value as Trip["status"] })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="On Trip">On Trip</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={editingTrip.cargoWeight}
                    onChange={(e) => setEditingTrip({ ...editingTrip, cargoWeight: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Cost (₹)</label>
                  <input
                    type="number"
                    value={editingTrip.fuelCost}
                    onChange={(e) => setEditingTrip({ ...editingTrip, fuelCost: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingTrip(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTrip}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Trip Details - #{selectedTrip.id}</h2>
              <button onClick={() => setSelectedTrip(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Origin</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.origin}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Destination</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.destination}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Driver</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.driver}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Vehicle</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.vehicle}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Fleet Type</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.fleetType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cargo Weight</span>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedTrip.cargoWeight} kg</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Cost</span>
                  <p className="font-medium text-gray-900 dark:text-white">₹{selectedTrip.fuelCost}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
