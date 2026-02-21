"use client";

import React from "react";
import { TopBar, KpiCards, DataTable } from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top bar: branding, search, filters, actions */}
      <TopBar />

      {/* KPI cards row */}
      <KpiCards />

      {/* Data table */}
      <DataTable />
    </div>
  );
}
