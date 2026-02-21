"use client";

import React, { useState, useMemo } from "react";
import { APP_NAME } from "@/constants";
import { initialServiceLogs, initialVehicles, serviceStatuses, costRanges, sortOptions, groupByOptions, ServiceLog } from "@/store";
import { cn } from "@/lib/utils";
import { Input, Select } from "@/components/ui";

const statusStyles: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border border-blue-200",
  "In Progress": "bg-orange-50 text-orange-700 border border-orange-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50 text-red-600 border border-red-200",
};

export default function MaintenancePage() {
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>(initialServiceLogs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [costFilter, setCostFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCostDropdown, setShowCostDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [form, setForm] = useState({ vehicleName: "", issueService: "", date: "", cost: "" });

  const vehicleOptions = initialVehicles.map(v => ({ value: v.model, label: `${v.plate} (${v.model})` }));

  const filteredLogs = useMemo(() => {
    let result = [...serviceLogs];
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(s => s.vehicle.toLowerCase().includes(query) || s.issueService.toLowerCase().includes(query));
    }
    if (statusFilter) result = result.filter(s => s.status === statusFilter);
    if (costFilter) {
      if (costFilter === "0-5000") result = result.filter(s => s.cost <= 5000);
      else if (costFilter === "5000-10000") result = result.filter(s => s.cost > 5000 && s.cost <= 10000);
      else if (costFilter === "10000+") result = result.filter(s => s.cost > 10000);
    }
    if (sortBy === "newest") result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sortBy === "name-asc") result.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
    else if (sortBy === "name-desc") result.sort((a, b) => b.vehicle.localeCompare(a.vehicle));
    return result;
  }, [serviceLogs, search, statusFilter, costFilter, sortBy]);

  const groupedLogs = useMemo(() => {
    if (!groupBy) return null;
    const groups: Record<string, ServiceLog[]> = {};
    filteredLogs.forEach(log => {
      const key = groupBy === "status" ? log.status : log.vehicle;
      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });
    return groups;
  }, [filteredLogs, groupBy]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: ServiceLog = {
      id: Math.max(...serviceLogs.map(s => s.id), 0) + 1,
      vehicle: form.vehicleName,
      issueService: form.issueService,
      date: form.date,
      cost: parseInt(form.cost) || 0,
      status: "New",
    };
    setServiceLogs(prev => [...prev, newLog]);
    setForm({ vehicleName: "", issueService: "", date: "", cost: "" });
    setShowForm(false);
  };

  const updateStatus = (id: number, status: ServiceLog["status"]) => {
    setServiceLogs(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000) return `₹${(cost / 1000).toFixed(cost % 1000 === 0 ? 0 : 1)}k`;
    return `₹${cost}`;
  };

  const closeAllDropdowns = () => {
    setShowFilterDropdown(false);
    setShowCostDropdown(false);
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
            <input type="text" placeholder="Search service logs…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowCostDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", groupBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Group by</button>
              {showGroupDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{groupByOptions.map(opt => (<button key={opt.value} onClick={() => { setGroupBy(opt.value); setShowGroupDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowGroupDropdown(false); setShowCostDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", statusFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Status</button>
              {showFilterDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{serviceStatuses.map(opt => (<button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowCostDropdown(!showCostDropdown); setShowGroupDropdown(false); setShowFilterDropdown(false); setShowSortDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", costFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Cost</button>
              {showCostDropdown && (<div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{costRanges.map(opt => (<button key={opt.value} onClick={() => { setCostFilter(opt.value); setShowCostDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowGroupDropdown(false); setShowFilterDropdown(false); setShowCostDropdown(false); }} className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", sortBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}>Sort by…</button>
              {showSortDropdown && (<div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>{sortOptions.map(opt => (<button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">{opt.label}</button>))}</div>)}
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create New Service
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {groupedLogs ? (
          Object.entries(groupedLogs).map(([group, groupLogs]) => (
            <div key={group}>
              <div className="bg-gray-100 px-5 py-2 border-b border-gray-200"><span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{group} ({groupLogs.length})</span></div>
              <table className="w-full text-sm">
                <tbody>
                  {groupLogs.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-800 font-medium w-20">{row.id}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.vehicle}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.issueService}</td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{row.date}</td>
                      <td className="px-4 py-3.5 text-gray-600">{formatCost(row.cost)}</td>
                      <td className="px-4 py-3.5">
                        <select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value as ServiceLog["status"])} className={cn("px-2 py-1 text-xs font-medium rounded-full border cursor-pointer", statusStyles[row.status])}>
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
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
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-20">Log ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Issue/Service</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-20">Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? filteredLogs.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-800 font-medium">{row.id}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.vehicle}</td>
                  <td className="px-4 py-3.5 text-gray-600">{row.issueService}</td>
                  <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{row.date}</td>
                  <td className="px-4 py-3.5 text-gray-600">{formatCost(row.cost)}</td>
                  <td className="px-4 py-3.5">
                    <select value={row.status} onChange={(e) => updateStatus(row.id, e.target.value as ServiceLog["status"])} className={cn("px-2 py-1 text-xs font-medium rounded-full border cursor-pointer", statusStyles[row.status])}>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )) : (<tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No service logs found matching your criteria</td></tr>)}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 left-56 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="px-5 py-5 border-b border-gray-100"><h2 className="text-base font-semibold text-gray-800">New Service</h2></div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <Select label="Vehicle" options={vehicleOptions} value={form.vehicleName} onChange={(e) => setForm({...form, vehicleName: e.target.value})} required />
              <Input label="Issue/Service" type="text" placeholder="e.g. Engine Issue, Oil Change" value={form.issueService} onChange={(e) => setForm({...form, issueService: e.target.value})} required />
              <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
              <Input label="Estimated Cost (₹)" type="number" placeholder="e.g. 5000" value={form.cost} onChange={(e) => setForm({...form, cost: e.target.value})} required />
            </form>
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
              <button type="submit" onClick={handleSave} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
