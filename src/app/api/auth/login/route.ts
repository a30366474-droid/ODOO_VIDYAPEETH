// ─── Auth API: Login ──────────────────────────────────────────────────────────
// POST /api/auth/login
// Public endpoint – no auth required
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import type { Role } from "@/types/rbac";

// ── Mock users for testing (before Supabase is fully set up) ────────────────
const MOCK_USERS = [
  {
    id: "usr_001",
    email: "admin@fleetflow.com",
    password: "Admin@123",
    full_name: "System Admin",
    role: "admin" as Role,
    status: "active",
  },
  {
    id: "usr_002",
    email: "manager@fleetflow.com",
    password: "Manager@123",
    full_name: "Fleet Manager",
    role: "fleet_manager" as Role,
    status: "active",
  },
  {
    id: "usr_003",
    email: "test@fleetflow.com",
    password: "Test@1234",
    full_name: "Test Admin",
    role: "admin" as Role,
    status: "active",
  },
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log("🔍 [Login Request] Email:", email);

        // ── Input validation ────────────────────────────────────────────────────
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Email and password are required." },
                { status: 400 }
            );
        }

        // ── Find user in mock data ──────────────────────────────────────────────
        console.log("🔄 Checking mock users...");
        const user = MOCK_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            console.error("❌ User not found");
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        console.log("✅ User found:", user.email);

        // ── Check password ─────────────────────────────────────────────────────
        console.log("🔐 Verifying password...");
        const isPasswordValid = password === user.password;
        
        if (!isPasswordValid) {
            console.error("❌ Password mismatch");
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        console.log("✅ Password verified");

        // ── Generate tokens ─────────────────────────────────────────────────────
        const { accessToken, refreshToken } = generateTokenPair({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.full_name,
        });

        // ── Build response with httpOnly cookies ────────────────────────────────
        const res = NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.full_name,
                    role: user.role,
                },
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
            { success: false, error: "Internal server error: " + (err instanceof Error ? err.message : "Unknown error") },
            { status: 500 }
        );
    }
}
