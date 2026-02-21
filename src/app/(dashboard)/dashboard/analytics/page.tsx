"use client";

import React, { useState } from "react";
import { APP_NAME } from "@/constants";

// KPI Card data
const kpiCards = [
  { label: "Total Fuel Cost", value: "Rs. 2.6 L", trend: "+8.2%" },
  { label: "Fleet ROI", value: "+12.5%", trend: "+3.1%" },
  { label: "Utilisation Rate", value: "82%", trend: "+5.4%" },
];

// Fuel efficiency data (monthly)
const fuelEfficiencyData = [
  { month: "Jan", year: 2025, value: 18 },
  { month: "Feb", year: 2025, value: 20 },
  { month: "Mar", year: 2025, value: 19 },
  { month: "Apr", year: 2025, value: 22 },
  { month: "May", year: 2025, value: 24 },
  { month: "Jun", year: 2025, value: 23 },
  { month: "Jul", year: 2025, value: 26 },
  { month: "Aug", year: 2025, value: 25 },
  { month: "Sep", year: 2025, value: 28 },
  { month: "Oct", year: 2025, value: 27 },
  { month: "Nov", year: 2025, value: 30 },
  { month: "Dec", year: 2025, value: 29 },
  { month: "Jan", year: 2026, value: 31 },
  { month: "Feb", year: 2026, value: 34 },
];

// Top 5 costliest vehicles
const costliestVehicles = [
  { id: "VAN-03", cost: 85000 },
  { id: "TRK-01", cost: 72000 },
  { id: "TRK-02", cost: 68000 },
  { id: "TRL-05", cost: 54000 },
  { id: "PKP-02", cost: 45000 },
];

// Financial summary data
const financialData = [
  { month: "January", revenue: 1700000, fuelCost: 600000, maintenance: 200000, netProfit: 900000 },
  { month: "February", revenue: 1850000, fuelCost: 650000, maintenance: 180000, netProfit: 1020000 },
  { month: "March", revenue: 1620000, fuelCost: 580000, maintenance: 250000, netProfit: 790000 },
  { month: "April", revenue: 1900000, fuelCost: 700000, maintenance: 150000, netProfit: 1050000 },
  { month: "May", revenue: 2100000, fuelCost: 750000, maintenance: 220000, netProfit: 1130000 },
];

const formatCurrency = (value: number) => {
  if (value >= 100000) return `Rs. ${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  if (value >= 1000) return `Rs. ${(value / 1000).toFixed(0)}k`;
  return `Rs. ${value}`;
};

export default function AnalyticsPage() {
  const [showFinancials, setShowFinancials] = useState(true);

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = 100;
  const maxEfficiency = Math.max(...fuelEfficiencyData.map(d => d.value));
  const minEfficiency = Math.min(...fuelEfficiencyData.map(d => d.value));
  const maxCost = Math.max(...costliestVehicles.map(v => v.cost));

  // Generate line chart path
  const getLinePath = () => {
    const points = fuelEfficiencyData.map((d, i) => {
      const x = (i / (fuelEfficiencyData.length - 1)) * 100;
      const y = 100 - ((d.value - minEfficiency) / (maxEfficiency - minEfficiency)) * 100;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{APP_NAME}</h1>
          <div className="w-3 h-3 rounded-full bg-green-500" title="Online" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="bg-white border-2 border-green-200 rounded-xl p-5 hover:border-green-400 transition-colors"
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-green-600">{card.value}</p>
              <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                {card.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Efficiency Trend Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Fuel Efficiency Trend (km/L)</h3>
          <div className="relative h-52">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-xs text-gray-400">
              <span>{maxEfficiency}</span>
              <span>{Math.round((maxEfficiency + minEfficiency) / 2)}</span>
              <span>{minEfficiency}</span>
            </div>
            {/* Chart area */}
            <div className="ml-10 h-full">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-44">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />
                {/* Line chart */}
                <path
                  d={getLinePath()}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data points */}
                {fuelEfficiencyData.map((d, i) => {
                  const x = (i / (fuelEfficiencyData.length - 1)) * 100;
                  const y = 100 - ((d.value - minEfficiency) / (maxEfficiency - minEfficiency)) * 100;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="#2563eb"
                      className="hover:r-3 transition-all"
                    />
                  );
                })}
              </svg>
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                {fuelEfficiencyData.filter((_, i) => i % 3 === 0 || i === fuelEfficiencyData.length - 1).map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Costliest Vehicles Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top 5 Costliest Vehicles</h3>
          <div className="h-52 flex items-end justify-between gap-4 px-4">
            {costliestVehicles.map((vehicle, index) => {
              const heightPercent = (vehicle.cost / maxCost) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{formatCurrency(vehicle.cost)}</span>
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${heightPercent * 1.6}px` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 font-medium">{vehicle.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header Button */}
        <button
          onClick={() => setShowFinancials(!showFinancials)}
          className="w-full px-5 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-teal-600 hover:to-teal-700 transition-all cursor-pointer"
        >
          <span>Financial Summary of Month</span>
          <svg
            className={`w-4 h-4 transition-transform ${showFinancials ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Financial Table */}
        {showFinancials && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Month</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Revenue</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Fuel Cost</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Maintenance</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{row.month}</td>
                  <td className="px-5 py-3.5 text-gray-600">{formatCurrency(row.revenue)}</td>
                  <td className="px-5 py-3.5 text-red-600">{formatCurrency(row.fuelCost)}</td>
                  <td className="px-5 py-3.5 text-orange-600">{formatCurrency(row.maintenance)}</td>
                  <td className="px-5 py-3.5 text-green-600 font-semibold">{formatCurrency(row.netProfit)}</td>
                </tr>
              ))}
            </tbody>
            {/* Summary row */}
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td className="px-5 py-3.5 text-gray-800 font-bold">Total (YTD)</td>
                <td className="px-5 py-3.5 text-gray-800 font-bold">
                  {formatCurrency(financialData.reduce((sum, r) => sum + r.revenue, 0))}
                </td>
                <td className="px-5 py-3.5 text-red-600 font-bold">
                  {formatCurrency(financialData.reduce((sum, r) => sum + r.fuelCost, 0))}
                </td>
                <td className="px-5 py-3.5 text-orange-600 font-bold">
                  {formatCurrency(financialData.reduce((sum, r) => sum + r.maintenance, 0))}
                </td>
                <td className="px-5 py-3.5 text-green-600 font-bold">
                  {formatCurrency(financialData.reduce((sum, r) => sum + r.netProfit, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Avg. Trip Distance</p>
          <p className="text-lg font-bold text-gray-800">847 km</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Trips (MTD)</p>
          <p className="text-lg font-bold text-gray-800">156</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Active Vehicles</p>
          <p className="text-lg font-bold text-gray-800">24 / 30</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Driver Rating</p>
          <p className="text-lg font-bold text-gray-800">4.6 ⭐</p>
        </div>
      </div>
    </div>
  );
}
