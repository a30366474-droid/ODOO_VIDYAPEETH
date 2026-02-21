"use client";

import React from "react";
import { APP_NAME } from "@/constants";

interface MaintenanceTopBarProps {
  onCreateService: () => void;
}

export default function MaintenanceTopBar({ onCreateService }: MaintenanceTopBarProps) {
  return (
    <div className="w-full">
      {/* Top row: branding + status */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          {APP_NAME}
        </h1>
        <div className="w-3 h-3 rounded-full bg-green-500" title="Online" />
      </div>

      {/* Action row: search + filters + create service */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search service logs…"
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Group by
          </button>
          <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Filter
          </button>
          <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            Sort by…
          </button>
        </div>

        {/* Create New Service button */}
        <button
          onClick={onCreateService}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Service
        </button>
      </div>
    </div>
  );
}
