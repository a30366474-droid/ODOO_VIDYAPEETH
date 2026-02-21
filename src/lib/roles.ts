// ─── Fleet Management RBAC – Role → Permission Matrix ────────────────────────
import type { Role, Permission } from "@/types/rbac";

/**
 * Central source of truth for role permissions.
 * Add/remove permissions here and they propagate everywhere automatically.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    // ── Admin: god mode ────────────────────────────────────────────────────────
    admin: [
        "vehicles:read", "vehicles:create", "vehicles:update", "vehicles:delete",
        "drivers:read", "drivers:create", "drivers:update", "drivers:suspend", "drivers:delete",
        "trips:read", "trips:create", "trips:update", "trips:delete", "trips:assign",
        "maintenance:read", "maintenance:create", "maintenance:update",
        "finance:read", "finance:create", "finance:export", "finance:approve",
        "safety:read", "safety:create", "safety:update",
        "analytics:read",
        "users:read", "users:create", "users:update", "users:delete", "roles:assign",
    ],

    // ── Fleet Manager: full operational access, no finance approval, no user mgmt
    fleet_manager: [
        "vehicles:read", "vehicles:create", "vehicles:update", "vehicles:delete",
        "drivers:read", "drivers:create", "drivers:update", "drivers:suspend",
        "trips:read", "trips:create", "trips:update", "trips:assign",
        "maintenance:read", "maintenance:create", "maintenance:update",
        "finance:read",
        "safety:read", "safety:create",
        "analytics:read",
        "users:read",
    ],

    // ── Dispatcher: day-to-day trip & driver ops ───────────────────────────────
    dispatcher: [
        "vehicles:read",
        "drivers:read",
        "trips:read", "trips:create", "trips:update", "trips:assign",
        "maintenance:read",
        "analytics:read",
    ],

    // ── Safety Officer: read-everything, write safety & driver actions ─────────
    safety_officer: [
        "vehicles:read",
        "drivers:read", "drivers:suspend",
        "trips:read",
        "maintenance:read", "maintenance:create", "maintenance:update",
        "safety:read", "safety:create", "safety:update",
        "analytics:read",
    ],

    // ── Finance: financial data only ───────────────────────────────────────────
    finance: [
        "vehicles:read",
        "drivers:read",
        "trips:read",
        "finance:read", "finance:create", "finance:export", "finance:approve",
        "analytics:read",
    ],
};

/** Check whether a role has a specific permission */
export function hasPermission(role: Role, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Check whether a role has ALL of the given permissions */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every((p) => hasPermission(role, p));
}

/** Check whether a role has AT LEAST ONE of the given permissions */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some((p) => hasPermission(role, p));
}

/** Human-readable role labels */
export const ROLE_LABELS: Record<Role, string> = {
    admin: "Administrator",
    fleet_manager: "Fleet Manager",
    dispatcher: "Dispatcher",
    safety_officer: "Safety Officer",
    finance: "Finance",
};
