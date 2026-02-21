// ─── Auth API: Login ──────────────────────────────────────────────────────────
// POST /api/auth/login
// Public endpoint – no auth required
import { NextRequest, NextResponse } from "next/server";
import { generateTokenPair, accessCookieOptions, refreshCookieOptions } from "@/lib/jwt";
import { createClient } from "@supabase/supabase-js";
import type { Role } from "@/types/rbac";

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

        // ── Initialize Supabase (inside handler to avoid build-time errors) ────
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // ── Query Supabase for user ────────────────────────────────────────────
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email.toLowerCase())
            .single();

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password." },
                { status: 401 }
            );
        }

        // ── Account active check ────────────────────────────────────────────────
        if (user.status !== "active") {
            return NextResponse.json(
                { success: false, error: "Account is suspended. Contact your administrator." },
                { status: 403 }
            );
        }

        // ── Password verification (simple string comparison) ──────────────────────
        const isPasswordValid = password === user.password;
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
