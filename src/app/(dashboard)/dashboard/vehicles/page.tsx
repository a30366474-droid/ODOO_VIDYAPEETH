"use client";

import React, { useState } from "react";
import { VehicleTopBar, VehicleTable, NewVehicleForm } from "@/components/vehicles";

export default function VehicleRegistryPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top bar with search, filters, + New Vehicle */}
      <VehicleTopBar onNewVehicle={() => setShowForm(true)} />

      {/* Vehicle data table */}
      <VehicleTable
        onDelete={(id) => {
          console.log("Delete vehicle:", id);
        }}
      />

      {/* New Vehicle side panel */}
      <NewVehicleForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={(data) => {
          console.log("Save vehicle:", data);
        }}
      />
    </div>
  );
}
