"use client";

import React from "react";
import { TripTopBar, TripTable, NewTripForm } from "@/components/trips";

export default function TripDispatcherPage() {
  return (
    <div className="space-y-6">
      {/* Top bar with search and filters */}
      <TripTopBar />

      {/* Active trips table */}
      <TripTable />

      {/* Inline new trip form */}
      <NewTripForm />
    </div>
  );
}
