// ─── Auth API: Register (Public) ──────────────────────────────────────────────
// POST /api/auth/register
// Allows new users to self-register with a chosen role.
// In production: you may want admin approval or invite-only registration.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import type { Role } from "@/types/rbac";

const VALID_ROLES: Role[] = ["admin", "fleet_manager", "dispatcher", "safety_officer", "finance"];

// ── In-memory store (replace with real DB) ───────────────────────────────────
// In production: INSERT INTO users (...) VALUES (...)
const registeredUsers: Array<{
    id: string;
    email: string;
    name: string;
    username: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
    serialNumber?: string;
}> = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, username, email, password, role, serialNumber } = body;

        // ── Input validation ─────────────────────────────────────────────────────
        if (!fullName || !username || !email || !password || !role) {
            return NextResponse.json(
                { success: false, error: "fullName, username, email, password, and role are required." },
                { status: 400 }
            );
        }

        if (!VALID_ROLES.includes(role as Role)) {
            return NextResponse.json(
                { success: false, error: `role must be one of: ${VALID_ROLES.join(", ")}` },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        // ── Check if email already exists ────────────────────────────────────────
        // TODO (production): SELECT * FROM users WHERE email = $1
        const exists = registeredUsers.some(
            (u) => u.email.toLowerCase() === email.toLowerCase() ||
                u.username.toLowerCase() === username.toLowerCase()
        );
        if (exists) {
            return NextResponse.json(
                { success: false, error: "An account with this email or username already exists." },
                { status: 409 }
            );
        }

        // ── Hash password & create user ──────────────────────────────────────────
        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = {
            id: `usr_${Date.now()}`,
            email: email.toLowerCase(),
            name: fullName,
            username: username.toLowerCase(),
            passwordHash,
            role: role as Role,
            isActive: true,
            serialNumber: serialNumber ?? undefined,
        };

        // TODO (production): INSERT INTO users (...) VALUES (...)
        registeredUsers.push(newUser);

        // ── Generate tokens immediately (auto-login after register) ─────────────
        const { accessToken, refreshToken } = generateTokenPair({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        });

        const res = NextResponse.json(
            {
                success: true,
                message: "Registration successful.",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                },
                accessToken,
            },
            { status: 201 }
        );

        res.cookies.set("accessToken", accessToken, accessCookieOptions);
        res.cookies.set("refreshToken", refreshToken, refreshCookieOptions);

        return res;
    } catch (err) {
        console.error("[POST /api/auth/register]", err);
        return NextResponse.json(
            { success: false, error: "Internal server error." },
            { status: 500 }
        );
    }
}
