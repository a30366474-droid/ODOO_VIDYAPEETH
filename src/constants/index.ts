// ============================================
// FleetFlow — Application Constants
// ============================================

import type { Permission } from "@/types/rbac";

export const APP_NAME = "FleetFlow";
export const APP_DESCRIPTION = "Modular Fleet & Logistics Management System";

export const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "driver", label: "Driver" },
  { value: "viewer", label: "Viewer" },
] as const;

export const ROUTES = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  VEHICLES: "/dashboard/vehicles",
  TRIPS: "/dashboard/trips",
  MAINTENANCE: "/dashboard/maintenance",
  DRIVERS: "/dashboard/drivers",
  EXPENSES: "/dashboard/expenses",
  PERFORMANCE: "/dashboard/performance",
  ANALYTICS: "/dashboard/analytics",
  REPORTS: "/dashboard/reports",
  SETTINGS: "/dashboard/settings",
} as const;

// Navigation with optional permission requirements
interface NavItem {
  label: string;
  href: string;
  icon: string;
  requiredPermissions?: Permission[];
}

export const SIDEBAR_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "dashboard" },
  { 
    label: "Vehicle Registry", 
    href: ROUTES.VEHICLES, 
    icon: "vehicle",
    requiredPermissions: ["vehicles:read"]
  },
  { 
    label: "Trip Dispatcher", 
    href: ROUTES.TRIPS, 
    icon: "trip",
    requiredPermissions: ["trips:read"]
  },
  { 
    label: "Maintenance", 
    href: ROUTES.MAINTENANCE, 
    icon: "maintenance",
    requiredPermissions: ["maintenance:read"]
  },
  { 
    label: "Trip & Expense", 
    href: ROUTES.EXPENSES, 
    icon: "expense",
    requiredPermissions: ["finance:read"]
  },
  { 
    label: "Performance", 
    href: ROUTES.PERFORMANCE, 
    icon: "performance",
    requiredPermissions: ["analytics:read"]
  },
  { 
    label: "Analytics", 
    href: ROUTES.ANALYTICS, 
    icon: "analytics",
    requiredPermissions: ["analytics:read"]
  },
  { 
    label: "Settings", 
    href: ROUTES.SETTINGS, 
    icon: "settings",
    requiredPermissions: ["users:read"]
  },
] as const;
