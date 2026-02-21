"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";

interface LoginPanelProps {
  onSwitchToRegister?: () => void;
}

export default function LoginPanel({ onSwitchToRegister }: LoginPanelProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay, then redirect to dashboard
    setTimeout(() => {
      console.log("Login:", { username, password, role });
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Avatar with role badge */}
      <div className="relative mb-8">
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
        {/* Role badge */}
        <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
          {role}
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>

      {/* Switch to Register — mobile only */}
      <button
        type="button"
        onClick={onSwitchToRegister}
        className="mt-4 text-sm text-blue-600 hover:underline md:hidden"
      >
        Don&apos;t have an account? Register
      </button>
    </div>
  );
}
