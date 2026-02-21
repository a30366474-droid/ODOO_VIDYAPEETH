"use client";

import React from "react";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      {/* Left side - Menu button (mobile) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo - visible on mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">FleetFlow</span>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        
        {/* User avatar - desktop */}
        <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">A</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800 dark:text-white">Admin</p>
            <p className="text-xs text-gray-400">admin@fleetflow.io</p>
          </div>
        </div>
      </div>
    </header>
  );
}
