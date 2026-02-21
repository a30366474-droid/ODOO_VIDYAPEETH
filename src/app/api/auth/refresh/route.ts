// ─── Auth API: Refresh Token ──────────────────────────────────────────────────
// POST /api/auth/refresh
// Accepts the refresh token cookie and issues a fresh access token
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken, accessCookieOptions } from "@/lib/jwt";

// In production: look up the user from DB to get latest role / status
// (This prevents suspended users from refreshing indefinitely)
import type { Role } from "@/types/rbac";

const USER_LOOKUP: Record<string, { name: string; email: string; role: Role; isActive: boolean }> = {
    usr_001: { name: "System Admin", email: "admin@fleetflow.com", role: "admin", isActive: true },
    usr_002: { name: "Fleet Manager", email: "manager@fleetflow.com", role: "fleet_manager", isActive: true },
    usr_003: { name: "John Dispatcher", email: "dispatch@fleetflow.com", role: "dispatcher", isActive: true },
    usr_004: { name: "Safety Officer", email: "safety@fleetflow.com", role: "safety_officer", isActive: true },
    usr_005: { name: "Finance Head", email: "finance@fleetflow.com", role: "finance", isActive: true },
};

export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { success: false, error: "No refresh token found. Please log in." },
                { status: 401 }
            );
        }

        // Verify refresh token
        let payload: { userId: string; email: string };
        try {
            payload = verifyRefreshToken(refreshToken);
        } catch {
            return NextResponse.json(
                { success: false, error: "Refresh token expired or invalid. Please log in." },
                { status: 401 }
            );
        }

        // Fetch latest user data (catches suspensions, role changes)
        const user = USER_LOOKUP[payload.userId];
        if (!user || !user.isActive) {
            return NextResponse.json(
                { success: false, error: "Account is suspended or does not exist." },
                { status: 403 }
            );
        }

        // Issue new access token
        const newAccessToken = generateAccessToken({
            userId: payload.userId,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        const res = NextResponse.json({ success: true, accessToken: newAccessToken });
        res.cookies.set("accessToken", newAccessToken, accessCookieOptions);
        return res;
    } catch (err) {
        console.error("[POST /api/auth/refresh]", err);
        return NextResponse.json(
            { success: false, error: "Internal server error." },
            { status: 500 }
        );
    }
}
