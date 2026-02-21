"use client";

import React, { useState, useMemo } from "react";
import { APP_NAME } from "@/constants";
import { initialExpenses, expenseStatuses, drivers, sortOptions, groupByOptions, Expense } from "@/store";
import { cn } from "@/lib/utils";
import { Input, Select } from "@/components/ui";

const statusStyles: Record<string, string> = {
  Done: "bg-green-50 text-green-700 border border-green-200",
  Pending: "bg-orange-50 text-orange-700 border border-orange-200",
  "In Review": "bg-blue-50 text-blue-700 border border-blue-200",
  Rejected: "bg-red-50 text-red-600 border border-red-200",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [form, setForm] = useState({ tripId: "", driver: "", fuelCost: "", miscExpense: "" });

  const driverOptions = drivers.map(d => ({ value: d.label, label: d.label }));

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(e => 
        e.driver.toLowerCase().includes(query) || 
        e.tripId.toString().includes(query)
      );
    }
    if (statusFilter) result = result.filter(e => e.status === statusFilter);
    if (sortBy === "newest") result.sort((a, b) => b.id - a.id);
    else if (sortBy === "oldest") result.sort((a, b) => a.id - b.id);
    else if (sortBy === "name-asc") result.sort((a, b) => a.driver.localeCompare(b.driver));
    else if (sortBy === "name-desc") result.sort((a, b) => b.driver.localeCompare(a.driver));
    return result;
  }, [expenses, search, statusFilter, sortBy]);

  const groupedExpenses = useMemo(() => {
    if (!groupBy) return null;
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach(expense => {
      const key = groupBy === "status" ? expense.status : expense.driver;
      if (!groups[key]) groups[key] = [];
      groups[key].push(expense);
    });
    return groups;
  }, [filteredExpenses, groupBy]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: Math.max(...expenses.map(exp => exp.id), 0) + 1,
      tripId: parseInt(form.tripId) || 0,
      driver: form.driver,
      distance: 0,
      fuelExpense: parseInt(form.fuelCost) || 0,
      miscExpense: parseInt(form.miscExpense) || 0,
      status: "Pending",
    };
    setExpenses(prev => [...prev, newExpense]);
    setForm({ tripId: "", driver: "", fuelCost: "", miscExpense: "" });
    setShowForm(false);
  };

  const updateStatus = (id: number, status: Expense["status"]) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const formatCost = (cost: number) => {
    if (cost >= 1000) return `₹${(cost / 1000).toFixed(cost % 1000 === 0 ? 0 : 1)}k`;
    return `₹${cost}`;
  };

  const closeAllDropdowns = () => {
    setShowFilterDropdown(false);
    setShowSortDropdown(false);
    setShowGroupDropdown(false);
  };

  const renderTableRow = (row: Expense) => (
    <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3.5 text-gray-800 font-medium">{row.tripId}</td>
      <td className="px-4 py-3.5 text-gray-600">{row.driver}</td>
      <td className="px-4 py-3.5 text-gray-600">{row.distance} km</td>
      <td className="px-4 py-3.5 text-gray-600 font-medium">{formatCost(row.fuelExpense)}</td>
      <td className="px-4 py-3.5 text-gray-600">{formatCost(row.miscExpense)}</td>
      <td className="px-4 py-3.5">
        <select
          value={row.status}
          onChange={(e) => updateStatus(row.id, e.target.value as Expense["status"])}
          className={cn("px-2 py-1 text-xs font-medium rounded-full border cursor-pointer", statusStyles[row.status])}
        >
          <option value="Done">Done</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Rejected">Rejected</option>
        </select>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6" onClick={closeAllDropdowns}>
      {/* Top Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{APP_NAME}</h1>
          <div className="w-3 h-3 rounded-full bg-green-500" title="Online" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search expenses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {/* Group by */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowSortDropdown(false); }}
                className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", groupBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}
              >
                Group by
              </button>
              {showGroupDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {groupByOptions.map(opt => (
                    <button key={opt.value} onClick={() => { setGroupBy(opt.value); setShowGroupDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); setShowGroupDropdown(false); setShowSortDropdown(false); }}
                className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", statusFilter ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}
              >
                Filter
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {expenseStatuses.map(opt => (
                    <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setShowFilterDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort by */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowSortDropdown(!showSortDropdown); setShowGroupDropdown(false); setShowFilterDropdown(false); }}
                className={cn("px-3 py-2 text-xs font-medium bg-white border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", sortBy ? "text-blue-600 border-blue-300 bg-blue-50" : "text-gray-600 border-gray-200")}
              >
                Sort by…
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50" onClick={(e) => e.stopPropagation()}>
                  {sortOptions.map(opt => (
                    <button key={opt.value} onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Expense Button */}
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add an Expense
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {groupedExpenses ? (
          Object.entries(groupedExpenses).map(([group, groupItems]) => (
            <div key={group}>
              <div className="bg-gray-100 px-5 py-2 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{group} ({groupItems.length})</span>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {groupItems.map(renderTableRow)}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-24">Trip ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Driver</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">Distance</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Fuel Expense</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Misc. Expense</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(renderTableRow)
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">No expenses found matching your criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* New Expense Form (Side Panel) */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 left-56 h-full w-80 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col">
            <div className="px-5 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">New Expense</h2>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              <Input
                label="Trip ID"
                type="number"
                placeholder="e.g. 321"
                value={form.tripId}
                onChange={(e) => setForm({ ...form, tripId: e.target.value })}
                required
              />
              <Select
                label="Driver"
                options={[{ value: "", label: "Select Driver" }, ...driverOptions]}
                value={form.driver}
                onChange={(e) => setForm({ ...form, driver: e.target.value })}
                required
              />
              <Input
                label="Fuel Cost (₹)"
                type="number"
                placeholder="e.g. 79000"
                value={form.fuelCost}
                onChange={(e) => setForm({ ...form, fuelCost: e.target.value })}
                required
              />
              <Input
                label="Misc. Expense (₹)"
                type="number"
                placeholder="e.g. 3000"
                value={form.miscExpense}
                onChange={(e) => setForm({ ...form, miscExpense: e.target.value })}
                required
              />
            </form>
            <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
              <button
                type="submit"
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
