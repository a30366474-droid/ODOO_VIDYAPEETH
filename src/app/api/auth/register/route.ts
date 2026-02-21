// ─── Auth API: Register (Public) ──────────────────────────────────────────────
// POST /api/auth/register
// Allows new users to self-register with a chosen role.
import { NextRequest, NextResponse } from "next/server";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import { createClient } from "@supabase/supabase-js";
import type { Role } from "@/types/rbac";

const VALID_ROLES: Role[] = ["admin", "fleet_manager", "dispatcher", "safety_officer", "finance"];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, username, email, password, role } = body;

        // ── Initialize Supabase (inside handler to avoid build-time errors) ────
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

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

        // ── Check if email already exists in Supabase ────────────────────────────
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // ── Create user in Supabase (with plain password) ──────────────────────
        const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: password,
                full_name: fullName,
                role: role as Role,
                status: "active",
            })
            .select()
            .single();

        if (insertError || !newUser) {
            console.error("Insert error:", insertError);
            return NextResponse.json(
                { success: false, error: "Failed to create account." },
                { status: 500 }
            );
        }

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
