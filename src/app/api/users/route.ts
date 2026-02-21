// ─── Protected API: User Management (Admin Only) ──────────────────────────────
// GET  /api/users          → admin only
// POST /api/users          → admin only (create user + assign role)
// PATCH /api/users/[id]    → admin only (change role)
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";
import bcrypt from "bcryptjs";
import type { Role } from "@/types/rbac";
import { ROLE_LABELS } from "@/lib/roles";

const VALID_ROLES: Role[] = ["admin", "fleet_manager", "dispatcher", "safety_officer", "finance"];

// ── GET /api/users ────────────────────────────────────────────────────────────
export const GET = withAuth(
    async (_req, { user }) => {
        // TODO: replace with DB query
        const users = [
            { id: "usr_001", name: "System Admin", email: "admin@fleetflow.com", role: "admin", isActive: true, createdAt: "2025-01-01" },
            { id: "usr_002", name: "Fleet Manager", email: "manager@fleetflow.com", role: "fleet_manager", isActive: true, createdAt: "2025-01-05" },
            { id: "usr_003", name: "John Dispatcher", email: "dispatch@fleetflow.com", role: "dispatcher", isActive: true, createdAt: "2025-01-10" },
            { id: "usr_004", name: "Safety Officer", email: "safety@fleetflow.com", role: "safety_officer", isActive: true, createdAt: "2025-01-12" },
            { id: "usr_005", name: "Finance Head", email: "finance@fleetflow.com", role: "finance", isActive: true, createdAt: "2025-01-15" },
        ];

        return NextResponse.json({ success: true, data: users });
    },
    ["users:read"],
    ["admin"]  // Role whitelist: admin only, even though fleet_manager also has users:read
);

// ── POST /api/users (Create user with role) ───────────────────────────────────
export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { name, email, password, role } = body as { name: string; email: string; password: string; role: Role };

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { success: false, error: "name, email, password, and role are required." },
                { status: 400 }
            );
        }

        if (!VALID_ROLES.includes(role)) {
            return NextResponse.json(
                { success: false, error: `role must be one of: ${VALID_ROLES.join(", ")}` },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // TODO: Check if email already exists in DB, then insert
        const newUser = {
            id: `usr_${Date.now()}`,
            name,
            email,
            passwordHash, // never return this in response
            role,
            roleLabel: ROLE_LABELS[role],
            isActive: true,
            createdBy: user.userId,
            createdAt: new Date().toISOString(),
        };

        console.log(`[AUDIT] User created: ${email} with role=${role} by ${user.name}`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _ph, ...safeUser } = newUser;
        return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
    },
    ["users:create", "roles:assign"],
    ["admin"]
);
