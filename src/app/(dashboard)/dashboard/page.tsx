"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/constants";
import { 
  initialVehicles, 
  initialTrips, 
  initialServiceLogs,
  tripStatuses,
  sortOptions,
  groupByOptions,
  Vehicle,
  Trip
} from "@/store";
import { cn } from "@/lib/utils";

function calculateKPIs(vehicles: Vehicle[], trips: Trip[], serviceLogs: typeof initialServiceLogs) {
  const activeFleet = vehicles.filter(v => v.status !== "Retired").length;
  const maintenanceAlerts = serviceLogs.filter(s => s.status === "New" || s.status === "In Progress").length;
  const pendingCargo = trips.filter(t => t.status === "Scheduled").length;
  return { activeFleet, maintenanceAlerts, pendingCargo };
}

const statusStyles: Record<string, string> = {
  "On Trip": "bg-orange-50 text-orange-700 border border-orange-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const vehicles = initialVehicles;
  const trips = initialTrips;
  const serviceLogs = initialServiceLogs;
  
  const kpis = useMemo(() => calculateKPIs(vehicles, trips, serviceLogs), [vehicles, trips, serviceLogs]);

  const filteredTrips = useMemo(() => {
    let result = [...trips];
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(t => 
        t.vehicle.toLowerCase().includes(query) ||
        t.driver.toLowerCase().includes(query) ||
        t.origin.toLowerCase().includes(query) ||
        t.destination.toLowerCase().includes(query)
      );
    }
    if (statusFilter) {
      result = result.filter(t => t.status === statusFilter);
    }
    if (sortBy === "newest") {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.driver.localeCompare(b.driver));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.driver.localeCompare(a.driver));
    }
    return result;
  }, [trips, search, statusFilter, sortBy]);

  const groupedTrips = useMemo(() => {
    if (!groupBy) return null;
    const groups: Record<string, Trip[]> = {};
    filteredTrips.forEach(trip => {
      const key = groupBy === "status" ? trip.status : trip.fleetType;
      if (!groups[key]) groups[key] = [];
      groups[key].push(trip);
    });
    return groups;
  }, [filteredTrips, groupBy]);

  const closeAllDropdowns = () => {
    setShowFilterDropdown(false);
    setShowSortDropdown(false);
    setShowGroupDropdown(false);
  };

  return (
    <div className="space-y-6" onClick={closeAllDropdowns}>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{APP_NAME}</h1>
          <div className="w-3 h-3 rounded-full bg-green-500" title="Online" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search trips, vehicles, drivers…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", groupBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>
                Group by {groupBy && `(${groupBy})`}
              </button>
              {showGroupDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {groupByOptions.map(opt => (<button key={opt.value} onClick={() => { setGroupBy(opt.value); setShowGroupDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowGroupDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", statusFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>
                Filter {statusFilter && `(${statusFilter})`}
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {tripStatuses.map(opt => (<button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowGroupDropdown(false); setShowFilterDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", sortBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>
                Sort by…
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {sortOptions.map(opt => (<button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/dashboard/trips")} className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">New Trip</button>
            <button onClick={() => router.push("/dashboard/vehicles")} className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">New Vehicle</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div onClick={() => router.push("/dashboard/vehicles")} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Active Fleet</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h.01M16 17h.01M5 11l1.5-4.5A1 1 0 017.44 6h9.12a1 1 0 01.94.5L19 11M5 11h14M5 11a2 2 0 00-2 2v3a1 1 0 001 1h1m14-4a2 2 0 012 2v3a1 1 0 01-1 1h-1" /></svg>
            </div>
          </div>
          <span className="text-2xl font-bold text-green-600 tracking-tight">{kpis.activeFleet}</span>
        </div>
        <div onClick={() => router.push("/dashboard/maintenance")} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Maintenance Alert</span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.84 21H3.16a1 1 0 01-.82-1.41L12 3z" /></svg>
            </div>
          </div>
          <span className="text-2xl font-bold text-orange-600 tracking-tight">{kpis.maintenanceAlerts}</span>
        </div>
        <div onClick={() => router.push("/dashboard/trips")} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Pending Cargo</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600 tracking-tight">{kpis.pendingCargo}</span>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {groupedTrips ? (
          Object.entries(groupedTrips).map(([group, groupTrips]) => (
            <div key={group}>
              <div className="bg-gray-100 px-5 py-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{group} ({groupTrips.length})</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {groupTrips.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-800 font-medium w-16">{row.id}</td>
                      <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{row.vehicle}</td>
                      <td className="px-5 py-3.5 text-gray-800">{row.driver}</td>
                      <td className="px-5 py-3.5"><span className={cn("inline-block px-2.5 py-1 text-xs font-medium rounded-full", statusStyles[row.status])}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 w-16">Trip</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Vehicle</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Driver</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? filteredTrips.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-800 font-medium">{row.id}</td>
                  <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{row.vehicle}</td>
                  <td className="px-5 py-3.5 text-gray-800">{row.driver}</td>
                  <td className="px-5 py-3.5"><span className={cn("inline-block px-2.5 py-1 text-xs font-medium rounded-full", statusStyles[row.status])}>{row.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No trips found matching your criteria</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
