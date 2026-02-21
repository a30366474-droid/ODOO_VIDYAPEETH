// ─── Auth API: Login ──────────────────────────────────────────────────────────
// POST /api/auth/login
// Public endpoint – no auth required
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import type { Role } from "@/types/rbac";

// ── Mock user store (replace with your real DB query) ────────────────────────
// In production: query your PostgreSQL / MongoDB / Supabase users table
const MOCK_USERS: Array<{
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
    isActive: boolean;
}> = [
        {
            id: "usr_001",
            email: "admin@fleetflow.com",
            passwordHash: "$2a$12$KIX8EM3Nwi96V2HdFUv9Q.oQmWGZGiLKzSHzHI3HKs7hbq7j8Bkq", // "Admin@123"
            name: "System Admin",
            role: "admin",
            isActive: true,
        },
        {
            id: "usr_002",
            email: "manager@fleetflow.com",
            passwordHash: "$2a$12$KIX8EM3Nwi96V2HdFUv9Q.oQmWGZGiLKzSHzHI3HKs7hbq7j8Bkq",
            name: "Fleet Manager",
            role: "fleet_manager",
            isActive: true,
        },
        {
            id: "usr_003",
            email: "dispatch@fleetflow.com",
            passwordHash: "$2a$12$KIX8EM3Nwi96V2HdFUv9Q.oQmWGZGiLKzSHzHI3HKs7hbq7j8Bkq",
            name: "John Dispatcher",
            role: "dispatcher",
            isActive: true,
        },
        {
            id: "usr_004",
            email: "safety@fleetflow.com",
            passwordHash: "$2a$12$KIX8EM3Nwi96V2HdFUv9Q.oQmWGZGiLKzSHzHI3HKs7hbq7j8Bkq",
            name: "Safety Officer",
            role: "safety_officer",
            isActive: true,
        },
        {
            id: "usr_005",
            email: "finance@fleetflow.com",
            passwordHash: "$2a$12$KIX8EM3Nwi96V2HdFUv9Q.oQmWGZGiLKzSHzHI3HKs7hbq7j8Bkq",
            name: "Finance Head",
            role: "finance",
            isActive: true,
        },
    ];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // ── Input validation ────────────────────────────────────────────────────
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required." },
                { status: 400 }
            );
        }

        // ── Find user (replace with DB lookup) ──────────────────────────────────
        const user = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // ── Account active check ────────────────────────────────────────────────
        if (!user.isActive) {
            return NextResponse.json(
                { success: false, error: "Account is suspended. Contact your administrator." },
                { status: 403 }
            );
        }

        // ── Password verification ───────────────────────────────────────────────
        // For demo: simple string comparison (use bcrypt in production)
        const isPasswordValid = password === "Admin@123";
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // ── Generate tokens ─────────────────────────────────────────────────────
        const { accessToken, refreshToken } = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });

        // ── Build response with httpOnly cookies ────────────────────────────────
        const res = NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                // Also return access token in body for clients that prefer Authorization header
                accessToken,
            },
            { status: 200 }
        );

        res.cookies.set("accessToken", accessToken, accessCookieOptions);
        res.cookies.set("refreshToken", refreshToken, refreshCookieOptions);

        return res;
    } catch (err) {
        console.error("[POST /api/auth/login]", err);
        return NextResponse.json(
            { success: false, error: "Internal server error." },
            { status: 500 }
        );
    }
}
