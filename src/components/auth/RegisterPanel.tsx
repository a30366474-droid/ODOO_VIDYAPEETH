"use client";

import React, { useState } from "react";
import { Input, Button, Select } from "@/components/ui";
import { ROLES } from "@/constants";

interface RegisterPanelProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterPanel({ onSwitchToLogin }: RegisterPanelProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement registration logic
    console.log("Register:", { fullName, username, email, password, role, serialNumber });
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Description text */}
      <p className="text-sm text-gray-500 text-center mb-6">
        Fill in all the information required for registration to get started with FleetFlow.
      </p>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Username"
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Select
          label="Role"
          options={ROLES}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <Input
          label="Serial Number"
          type="text"
          placeholder="Optional — Employee serial number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />

        <div className="pt-2">
          <Button type="submit" variant="outline" fullWidth>
            Register
          </Button>
        </div>
      </form>

      {/* Switch to Login — mobile only */}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="mt-4 text-sm text-blue-600 hover:underline md:hidden"
      >
        Already have an account? Login
      </button>
    </div>
  );
}
