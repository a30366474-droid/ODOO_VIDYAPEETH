"use client";

import React, { useState } from "react";
import { LoginPanel, RegisterPanel } from "@/components/auth";

export default function AuthPage() {
  // For mobile: toggle between login and register
  const [activePanel, setActivePanel] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-8 tracking-tight">
        Authentication
      </h1>

      {/* Outer container — two panels side by side */}
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* ───── Left Panel: Login ───── */}
          <div
            className={`w-full md:w-1/2 p-8 md:p-10 ${
              activePanel === "register" ? "hidden md:block" : ""
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">
              Login
            </h2>
            <LoginPanel onSwitchToRegister={() => setActivePanel("register")} />
          </div>

          {/* ───── Divider ───── */}
          <div className="hidden md:flex items-center">
            <div className="w-px h-4/5 bg-gray-200" />
          </div>

          {/* ───── Right Panel: Register ───── */}
          <div
            className={`w-full md:w-1/2 p-8 md:p-10 ${
              activePanel === "login" ? "hidden md:block" : ""
            }`}
          >
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">
              Register
            </h2>
            <RegisterPanel onSwitchToLogin={() => setActivePanel("login")} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-400">
        FleetFlow &mdash; Modular Fleet &amp; Logistics Management
      </p>
    </div>
  );
}
