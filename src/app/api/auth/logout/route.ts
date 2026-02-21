// ─── Auth API: Logout ─────────────────────────────────────────────────────────
// POST /api/auth/logout
// Clears auth cookies (server-side)
import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ success: true, message: "Logged out successfully." });

    // Clear both cookies by setting maxAge to 0
    res.cookies.set("accessToken", "", { httpOnly: true, path: "/", maxAge: 0 });
    res.cookies.set("refreshToken", "", { httpOnly: true, path: "/api/auth/refresh", maxAge: 0 });

    return res;
}
