"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui";

interface NewServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: ServiceFormData) => void;
}

export interface ServiceFormData {
  vehicleName: string;
  issueService: string;
  date: string;
}

export default function NewServiceForm({ open, onClose, onSave }: NewServiceFormProps) {
  const [form, setForm] = useState<ServiceFormData>({
    vehicleName: "",
    issueService: "",
    date: "",
  });

  const updateField = (field: keyof ServiceFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    setForm({
      vehicleName: "",
      issueService: "",
      date: "",
    });
    onClose();
  };

  const handleCancel = () => {
    setForm({
      vehicleName: "",
      issueService: "",
      date: "",
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
      <div className="fixed top-0 left-56 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            New Service
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Input
            label="Vehicle Name"
            type="text"
            placeholder="e.g. TATA Ace"
            value={form.vehicleName}
            onChange={(e) => updateField("vehicleName", e.target.value)}
            required
          />

          <Input
            label="Issue/Service"
            type="text"
            placeholder="e.g. Engine Issue, Oil Change"
            value={form.issueService}
            onChange={(e) => updateField("issueService", e.target.value)}
            required
          />

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
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
            Create
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
