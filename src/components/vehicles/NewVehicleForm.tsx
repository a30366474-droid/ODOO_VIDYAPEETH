"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui";

interface NewVehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: VehicleFormData) => void;
}

export interface VehicleFormData {
  licensePlate: string;
  maxPayload: string;
  initialOdometer: string;
  type: string;
  model: string;
}

export default function NewVehicleForm({ open, onClose, onSave }: NewVehicleFormProps) {
  const [form, setForm] = useState<VehicleFormData>({
    licensePlate: "",
    maxPayload: "",
    initialOdometer: "",
    type: "",
    model: "",
  });

  const updateField = (field: keyof VehicleFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    setForm({
      licensePlate: "",
      maxPayload: "",
      initialOdometer: "",
      type: "",
      model: "",
    });
    onClose();
  };

  const handleCancel = () => {
    setForm({
      licensePlate: "",
      maxPayload: "",
      initialOdometer: "",
      type: "",
      model: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={handleCancel}
      />

      {/* Side panel */}
      <div className="fixed top-0 left-56 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            New Vehicle Registration
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Input
            label="License Plate"
            type="text"
            placeholder="e.g. MH 12 AB 3456"
            value={form.licensePlate}
            onChange={(e) => updateField("licensePlate", e.target.value)}
            required
          />

          <Input
            label="Max Payload"
            type="text"
            placeholder="e.g. 5 tonn"
            value={form.maxPayload}
            onChange={(e) => updateField("maxPayload", e.target.value)}
            required
          />

          <Input
            label="Initial Odometer"
            type="number"
            placeholder="e.g. 0"
            value={form.initialOdometer}
            onChange={(e) => updateField("initialOdometer", e.target.value)}
            required
          />

          <Input
            label="Type"
            type="text"
            placeholder="e.g. Truck, Van, Mini"
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
            required
          />

          <Input
            label="Model"
            type="text"
            placeholder="e.g. Tata Ace, Eicher Pro"
            value={form.model}
            onChange={(e) => updateField("model", e.target.value)}
            required
          />
        </form>

        {/* Footer buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          <button
            type="submit"
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
