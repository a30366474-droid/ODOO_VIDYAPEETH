// ─── Fleet Management RBAC – JWT Utilities ────────────────────────────────────
import jwt from "jsonwebtoken";
import type { JWTPayload, Role } from "@/types/rbac";

// ── Secrets ──────────────────────────────────────────────────────────────────
// Store these in .env.local (never commit!)
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fleet_access_secret_change_me";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "fleet_refresh_secret_change_me";

const ACCESS_EXPIRY = "8h";   // access token lives 8 hours
const REFRESH_EXPIRY = "7d";   // refresh token lives 7 days

// ── Token Generation ─────────────────────────────────────────────────────────

/** Generate a short-lived access token */
export function generateAccessToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}

/** Generate a long-lived refresh token */
export function generateRefreshToken(payload: Pick<JWTPayload, "userId" | "email">): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

/** Return both tokens together – call this on login / refresh */
export function generateTokenPair(payload: Omit<JWTPayload, "iat" | "exp">) {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken({ userId: payload.userId, email: payload.email }),
    };
}

// ── Token Verification ────────────────────────────────────────────────────────

/** Verify and decode an access token. Throws if invalid / expired. */
export function verifyAccessToken(token: string): JWTPayload {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded as JWTPayload;
}

/** Verify and decode a refresh token. Throws if invalid / expired. */
export function verifyRefreshToken(token: string): Pick<JWTPayload, "userId" | "email"> {
    return jwt.verify(token, REFRESH_SECRET) as Pick<JWTPayload, "userId" | "email">;
}

// ── Cookie Helpers ────────────────────────────────────────────────────────────

/** Cookie options for the access token */
export const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 8 * 60 * 60,   // 8 hours in seconds
};

/** Cookie options for the refresh token */
export const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/api/auth/refresh",  // scope refresh cookie to the refresh endpoint only
    maxAge: 7 * 24 * 60 * 60,    // 7 days in seconds
};

// ── Utility ───────────────────────────────────────────────────────────────────

/** Extract the Bearer token from an Authorization header */
export function extractBearerToken(authHeader: string | null): string | null {
    if (!authHeader?.startsWith("Bearer ")) return null;
    return authHeader.slice(7).trim() || null;
}

/** Decode without verification – for server-side rendering / edge use */
export function decodeTokenUnsafe(token: string): JWTPayload | null {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch {
        return null;
    }
}
