"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TripRow {
  id: number;
  vehicle: string;
  driver: string;
  status: "On Trip" | "Completed" | "Scheduled" | "Cancelled";
}

const sampleData: (TripRow | null)[] = [
  { id: 1, vehicle: "TRK-4521-MH-12", driver: "John Doe", status: "On Trip" },
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

const statusStyles: Record<string, string> = {
  "On Trip": "bg-orange-50 text-orange-700 border border-orange-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default function DataTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Table header */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-16">
              Trip
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">
              Vehicle
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600">
              Driver
            </th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-32">
              Status
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
                  <td className="px-5 py-3.5 text-gray-800 font-medium">
                    {row.id}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">
                    {row.vehicle}
                  </td>
                  <td className="px-5 py-3.5 text-gray-800">{row.driver}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 text-xs font-medium rounded-full",
                        statusStyles[row.status]
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-5 py-3.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
