"use client";

import React from "react";

interface KpiCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

const kpiData: KpiCard[] = [
  {
    label: "Active Fleet",
    value: 320,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M5 11l1.5-4.5A1 1 0 017.44 6h9.12a1 1 0 01.94.5L19 11M5 11h14M5 11a2 2 0 00-2 2v3a1 1 0 001 1h1m14-4a2 2 0 012 2v3a1 1 0 01-1 1h-1" />
      </svg>
    ),
  },
  {
    label: "Maintenance Alert",
    value: 180,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.84 21H3.16a1 1 0 01-.82-1.41L12 3z" />
      </svg>
    ),
  },
  {
    label: "Pending Cargo",
    value: 20,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpiData.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              {card.label}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              {card.icon}
            </div>
          </div>
          <span className="text-2xl font-bold text-green-600 tracking-tight">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
}
