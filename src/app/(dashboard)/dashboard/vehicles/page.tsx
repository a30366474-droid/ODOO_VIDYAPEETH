"use client";

import React, { useState, useMemo } from "react";
import { APP_NAME } from "@/constants";
import { initialVehicles, vehicleTypes, vehicleStatuses, sortOptions, groupByOptions, Vehicle } from "@/store";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";

const statusStyles: Record<string, string> = {
  Idle: "bg-gray-50 text-gray-600 border border-gray-200",
  "On Trip": "bg-orange-50 text-orange-700 border border-orange-200",
  Maintenance: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Retired: "bg-red-50 text-red-600 border border-red-200",
};

export default function VehicleRegistryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [form, setForm] = useState({ licensePlate: "", maxPayload: "", initialOdometer: "", type: "", model: "" });

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(v => v.plate.toLowerCase().includes(query) || v.model.toLowerCase().includes(query) || v.type.toLowerCase().includes(query));
    }
    if (typeFilter) result = result.filter(v => v.type === typeFilter);
    if (statusFilter) result = result.filter(v => v.status === statusFilter);
    if (sortBy === "newest") result.sort((a, b) => b.id - a.id);
    else if (sortBy === "oldest") result.sort((a, b) => a.id - b.id);
    else if (sortBy === "name-asc") result.sort((a, b) => a.model.localeCompare(b.model));
    else if (sortBy === "name-desc") result.sort((a, b) => b.model.localeCompare(a.model));
    return result;
  }, [vehicles, search, typeFilter, statusFilter, sortBy]);

  const groupedVehicles = useMemo(() => {
    if (!groupBy) return null;
    const groups: Record<string, Vehicle[]> = {};
    filteredVehicles.forEach(v => {
      const key = groupBy === "status" ? v.status : v.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(v);
    });
    return groups;
  }, [filteredVehicles, groupBy]);

  const handleDelete = (id: number) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: Math.max(...vehicles.map(v => v.id), 0) + 1,
      plate: form.licensePlate,
      model: form.model,
      type: form.type,
      capacity: form.maxPayload,
      odometer: parseInt(form.initialOdometer) || 0,
      status: "Idle",
    };
    setVehicles(prev => [...prev, newVehicle]);
    setForm({ licensePlate: "", maxPayload: "", initialOdometer: "", type: "", model: "" });
    setShowForm(false);
  };

  const closeAllDropdowns = () => {
    setShowFilterDropdown(false);
    setShowTypeDropdown(false);
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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search vehicles…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowTypeDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", groupBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Group by</button>
              {showGroupDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{groupByOptions.map(opt => (<button key={opt.value} onClick={() => { setGroupBy(opt.value); setShowGroupDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowTypeDropdown(!showTypeDropdown); setShowFilterDropdown(false); setShowGroupDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", typeFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Type</button>
              {showTypeDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{vehicleTypes.map(opt => (<button key={opt.value} onClick={() => { setTypeFilter(opt.value); setShowTypeDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowTypeDropdown(false); setShowGroupDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", statusFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Status</button>
              {showFilterDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{vehicleStatuses.map(opt => (<button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); setShowTypeDropdown(false); setShowGroupDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", sortBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Sort by…</button>
              {showSortDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{sortOptions.map(opt => (<button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Vehicle
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {groupedVehicles ? (
          Object.entries(groupedVehicles).map(([group, groupVehicles]) => (
            <div key={group}>
              <div className="bg-gray-100 px-5 py-2 border-b border-gray-200"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{group} ({groupVehicles.length})</span></div>
              <table className="w-full text-sm">
                <tbody>
                  {groupVehicles.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-800 font-medium w-14">{row.id}</td>
                      <td className="px-4 py-3.5 text-gray-800 font-mono text-xs">{row.plate}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.model}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.type}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.capacity}</td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{row.odometer.toLocaleString()}</td>
                      <td className="px-4 py-3.5"><span className={cn("inline-block px-2.5 py-1 text-xs font-medium rounded-full", statusStyles[row.status])}>{row.status}</span></td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => handleDelete(row.id)} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete vehicle">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </td>
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-14">NO</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Plate</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Model</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Odometer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? filteredVehicles.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-800 font-medium">{row.id}</td>
                  <td className="px-4 py-3.5 text-gray-800 font-mono text-xs">{row.plate}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.model}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.type}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.capacity}</td>
                  <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{row.odometer.toLocaleString()}</td>
                  <td className="px-4 py-3.5"><span className={cn("inline-block px-2.5 py-1 text-xs font-medium rounded-full", statusStyles[row.status])}>{row.status}</span></td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => handleDelete(row.id)} className="inline-flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer" title="Delete vehicle">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              )) : (<tr><td colSpan={8} className="px-5 py-8 text-center text-gray-400">No vehicles found matching your criteria</td></tr>)}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 left-56 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="px-5 py-5 border-b border-gray-100"><h2 className="text-base font-semibold text-gray-800">New Vehicle Registration</h2></div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <Input label="License Plate" type="text" placeholder="e.g. MH 12 AB 3456" value={form.licensePlate} onChange={(e) => setForm({...form, licensePlate: e.target.value})} required />
              <Input label="Max Payload" type="text" placeholder="e.g. 5 tonn" value={form.maxPayload} onChange={(e) => setForm({...form, maxPayload: e.target.value})} required />
              <Input label="Initial Odometer" type="number" placeholder="e.g. 0" value={form.initialOdometer} onChange={(e) => setForm({...form, initialOdometer: e.target.value})} required />
              <Input label="Type" type="text" placeholder="e.g. Truck, Van, Mini" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} required />
              <Input label="Model" type="text" placeholder="e.g. Tata Ace, Eicher Pro" value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} required />
            </form>
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
              <button type="submit" onClick={handleSave} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
