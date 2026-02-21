// ─── Auth API: Register (Public) ──────────────────────────────────────────────
// POST /api/auth/register
// Allows new users to self-register with a chosen role.
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import type { Role } from "@/types/rbac";

const VALID_ROLES: Role[] = ["admin", "fleet_manager", "dispatcher", "safety_officer", "finance"];

// ── In-memory user store for demo ────────────────────────────────────────────
const registeredUsers: any[] = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, username, email, password, role } = body;

        console.log("📝 [Register Request]", { email, username });

        // ── Input validation ─────────────────────────────────────────────────────
        if (!fullName || !username || !email || !password || !role) {
            return NextResponse.json(
                { success: false, error: "All fields are required." },
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
        const exists = registeredUsers.some(
            (u) => u.email.toLowerCase() === email.toLowerCase() ||
                u.username.toLowerCase() === username.toLowerCase()
        );
        if (exists) {
            return NextResponse.json(
                { success: false, error: "Email or username already exists." },
                { status: 409 }
            );
        }

        // ── Create user in memory ──────────────────────────────────────────────────
        const newUser = {
            id: `usr_${Date.now()}`,
            email: email.toLowerCase(),
            full_name: fullName,
            username: username.toLowerCase(),
            password: password, // In memory, storing plain for demo
            role: role as Role,
            status: "active",
        };

        registeredUsers.push(newUser);
        console.log("✅ User registered:", newUser.email);

        // ── Generate tokens immediately (auto-login after register) ─────────────
        const { accessToken, refreshToken } = generateTokenPair({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.full_name,
            role: newUser.role,
        });

        const res = NextResponse.json(
            {
                success: true,
                message: "Registration successful.",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.full_name,
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
