// ============================================
// FleetFlow — Application Constants
// ============================================

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

export const SIDEBAR_NAV = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "dashboard" },
  { label: "Vehicle Registry", href: ROUTES.VEHICLES, icon: "vehicle" },
  { label: "Trip Dispatcher", href: ROUTES.TRIPS, icon: "trip" },
  { label: "Maintenance", href: ROUTES.MAINTENANCE, icon: "maintenance" },
  { label: "Trip & Expense", href: ROUTES.EXPENSES, icon: "expense" },
  { label: "Performance", href: ROUTES.PERFORMANCE, icon: "performance" },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: "analytics" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "settings" },
] as const;
