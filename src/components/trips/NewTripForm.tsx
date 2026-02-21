"use client";

import React, { useState } from "react";
import { Input, Select } from "@/components/ui";

const vehicleOptions = [
  { value: "trailer-truck", label: "Trailer Truck" },
  { value: "mini-truck", label: "Mini Truck" },
  { value: "van", label: "Van" },
  { value: "pickup", label: "Pickup" },
  { value: "tanker", label: "Tanker" },
];

const driverOptions = [
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
  { value: "raj-kumar", label: "Raj Kumar" },
  { value: "amit-patel", label: "Amit Patel" },
];

export interface TripFormData {
  vehicle: string;
  cargoWeight: string;
  driver: string;
  originAddress: string;
  destination: string;
  estimatedFuelCost: string;
}

export default function NewTripForm() {
  const [form, setForm] = useState<TripFormData>({
    vehicle: "",
    cargoWeight: "",
    driver: "",
    originAddress: "",
    destination: "",
    estimatedFuelCost: "",
  });

  const updateField = (field: keyof TripFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dispatch trip:", form);
    setForm({
      vehicle: "",
      cargoWeight: "",
      driver: "",
      originAddress: "",
      destination: "",
      estimatedFuelCost: "",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Section header */}
      <h3 className="text-sm font-semibold text-gray-800 mb-5">
        New Trip Form
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Vehicle"
            options={vehicleOptions}
            value={form.vehicle}
            onChange={(e) => updateField("vehicle", e.target.value)}
            required
          />

          <Input
            label="Cargo Weight (Kg)"
            type="number"
            placeholder="e.g. 5000"
            value={form.cargoWeight}
            onChange={(e) => updateField("cargoWeight", e.target.value)}
            required
          />

          <Select
            label="Select Driver"
            options={driverOptions}
            value={form.driver}
            onChange={(e) => updateField("driver", e.target.value)}
            required
          />

          <Input
            label="Origin Address"
            type="text"
            placeholder="e.g. Mumbai, MH"
            value={form.originAddress}
            onChange={(e) => updateField("originAddress", e.target.value)}
            required
          />

          <Input
            label="Destination"
            type="text"
            placeholder="e.g. Pune, MH"
            value={form.destination}
            onChange={(e) => updateField("destination", e.target.value)}
            required
          />

          <Input
            label="Estimated Fuel Cost"
            type="number"
            placeholder="e.g. 4500"
            value={form.estimatedFuelCost}
            onChange={(e) => updateField("estimatedFuelCost", e.target.value)}
            required
          />
        </div>

        {/* Dispatch button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
          >
            Confirm &amp; Dispatch Trip
          </button>
        </div>
      </form>
    </div>
  );
}
