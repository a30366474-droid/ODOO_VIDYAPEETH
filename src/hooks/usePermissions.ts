"use client";

import { useAuth } from "@/context";
import { hasPermission, hasAllPermissions, hasAnyPermission } from "@/lib/roles";
import type { Permission, Role } from "@/types/rbac";

/**
 * Check if the current user has a specific permission
 */
export function useHasPermission(permission: Permission): boolean {
    const { user } = useAuth();
    if (!user) return false;
    return hasPermission(user.role, permission);
}

/**
 * Check if the current user has ANY of the given permissions
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
    const { user } = useAuth();
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
}

/**
 * Check if the current user has ALL of the given permissions
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
    const { user } = useAuth();
    if (!user) return false;
    return hasAllPermissions(user.role, permissions);
}

/**
 * Check if the current user has a specific role
 */
export function useHasRole(role: Role | Role[]): boolean {
    const { user } = useAuth();
    if (!user) return false;
    
    if (Array.isArray(role)) {
        return role.includes(user.role);
    }
    return user.role === role;
}

/**
 * Advanced access control – can specify multiple conditions:
 * - require: role and/or permissions that ALL must be true
 * - requireAny: permissions where AT LEAST ONE must be true
 */
export function useCanAccess(options: {
    require?: { role?: Role; permissions?: Permission[] };
    requireAny?: Permission[];
}): boolean {
    const { user } = useAuth();
    if (!user) return false;

    // Check required role
    if (options.require?.role && user.role !== options.require.role) {
        return false;
    }

    // Check required permissions
    if (options.require?.permissions && !hasAllPermissions(user.role, options.require.permissions)) {
        return false;
    }

    // Check "at least one" permissions
    if (options.requireAny && !hasAnyPermission(user.role, options.requireAny)) {
        return false;
    }

    return true;
}
