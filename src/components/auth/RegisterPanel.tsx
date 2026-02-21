"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import { Input, Button, Select } from "@/components/ui";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "fleet_manager", label: "Fleet Manager" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "safety_officer", label: "Safety Officer" },
  { value: "finance", label: "Finance" },
];

interface RegisterPanelProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterPanel({ onSwitchToLogin }: RegisterPanelProps) {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Please select a role.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, email, password, role, serialNumber }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      // Update global auth state
      if (data.user && data.accessToken) {
        authLogin(data.user, data.accessToken);
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
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

      <p className="text-sm text-gray-500 text-center mb-6">
        Fill in all the information required for registration to get started with FleetFlow.
      </p>

      {/* Error banner */}
      {error && (
        <div className="w-full mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

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
          placeholder="Create a password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Select
          label="Role"
          options={ROLE_OPTIONS}
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
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? "Registering…" : "Register"}
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
