// ─── Fleet Management RBAC – Core Types ───────────────────────────────────────

/** All roles available in the system */
export type Role =
  | "admin"
  | "fleet_manager"
  | "dispatcher"
  | "safety_officer"
  | "finance";

/** Granular permissions used throughout the system */
export type Permission =
  // Vehicles
  | "vehicles:read"
  | "vehicles:create"
  | "vehicles:update"
  | "vehicles:delete"
  // Drivers
  | "drivers:read"
  | "drivers:create"
  | "drivers:update"
  | "drivers:suspend"
  | "drivers:delete"
  // Trips
  | "trips:read"
  | "trips:create"
  | "trips:update"
  | "trips:delete"
  | "trips:assign"
  // Maintenance
  | "maintenance:read"
  | "maintenance:create"
  | "maintenance:update"
  // Financial
  | "finance:read"
  | "finance:create"
  | "finance:export"
  | "finance:approve"
  // Safety
  | "safety:read"
  | "safety:create"
  | "safety:update"
  // Analytics
  | "analytics:read"
  // Users / Admin
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "roles:assign";

/** Shape of the JWT payload stored inside the token */
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  iat?: number;
  exp?: number;
}

/** User record returned after successful auth (no password) */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

/** Extended NextRequest that carries the decoded JWT payload */
export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}
