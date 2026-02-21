"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface VehicleRow {
  id: number;
  plate: string;
  model: string;
  type: string;
  capacity: string;
  odometer: number;
  status: "Idle" | "On Trip" | "Maintenance" | "Retired";
}

const sampleData: (VehicleRow | null)[] = [
  {
    id: 1,
    plate: "MH DD 2017",
    model: "Mini",
    type: "Truck",
    capacity: "5 tonn",
    odometer: 79000,
    status: "Idle",
  },
  null,
  null,
  null,
  null,
  null,
];

const statusStyles: Record<string, string> = {
  Idle: "bg-gray-50 text-gray-600 border border-gray-200",
  "On Trip": "bg-orange-50 text-orange-700 border border-orange-200",
  Maintenance: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Retired: "bg-red-50 text-red-600 border border-red-200",
};

interface VehicleTableProps {
  onDelete?: (id: number) => void;
}

export default function VehicleTable({ onDelete }: VehicleTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-14">
              NO
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Plate
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Model
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Type
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Capacity
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">
              Odometer
            </th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">
              Status
            </th>
            <th className="text-center px-4 py-3 font-semibold text-gray-600 w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b border-gray-100 last:border-0",
                row ? "hover:bg-gray-50 transition-colors" : ""
              )}
            >
              {row ? (
                <>
                  <td className="px-4 py-3.5 text-gray-800 font-medium">
                    {row.id}
                  </td>
                  <td className="px-4 py-3.5 text-gray-800 font-mono text-xs">
                    {row.plate}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{row.model}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.type}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.capacity}</td>
                  <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">
                    {row.odometer.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 text-xs font-medium rounded-full",
                        statusStyles[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => onDelete?.(row.id)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete vehicle"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-14 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-3 w-14 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3.5" />
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
