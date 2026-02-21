// ─── Next.js Global Route Guard (middleware.ts) ───────────────────────────────
//
// This runs at the EDGE before any request reaches the app.
// Responsibilities:
//   1. Protect /api/* routes from unauthenticated access
//   2. Redirect unauthenticated /dashboard requests to /auth
//   3. Redirect already-authenticated users away from /auth
//
// NOTE: Per-endpoint permission checks are still enforced inside each
//       API route via withAuth(). This middleware is the first line of defence.
//
import { NextRequest, NextResponse } from "next/server";
import { decodeTokenUnsafe } from "@/lib/jwt";

// Routes that do NOT require authentication
const PUBLIC_ROUTES = [
    "/",
    "/auth",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
];

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_PATH = "/auth";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public routes through
    const isPublic = PUBLIC_ROUTES.some((r) =>
        r === pathname || pathname.startsWith(r + "/")
    );
    if (isPublic) return NextResponse.next();

    // Extract access token from cookie (httpOnly) or Authorization header
    const tokenFromCookie = req.cookies.get("accessToken")?.value;
    const tokenFromHeader = req.headers.get("authorization")?.startsWith("Bearer ")
        ? req.headers.get("authorization")!.slice(7)
        : null;
    const token = tokenFromCookie ?? tokenFromHeader;

    // ── Unauthenticated ─────────────────────────────────────────────────────────

    if (!token) {
        // API request: return 401 JSON
        if (pathname.startsWith("/api/")) {
            return NextResponse.json(
                { success: false, error: "Authentication required." },
                { status: 401 }
            );
        }
        // Dashboard request: redirect to login
        if (pathname.startsWith(DASHBOARD_PREFIX)) {
            return NextResponse.redirect(new URL(AUTH_PATH, req.url));
        }
        return NextResponse.next();
    }

    // ── Token present: decode (edge runtime – no crypto) ───────────────────────
    const user = decodeTokenUnsafe(token);

    if (!user) {
        // Malformed token
        const res = pathname.startsWith("/api/")
            ? NextResponse.json({ success: false, error: "Invalid token." }, { status: 401 })
            : NextResponse.redirect(new URL(AUTH_PATH, req.url));

        res.cookies.delete("accessToken");
        return res;
    }

    // ── Authenticated user trying to access /auth – redirect to dashboard ───────
    if (pathname === AUTH_PATH || pathname.startsWith(AUTH_PATH + "/")) {
        return NextResponse.redirect(new URL(`${DASHBOARD_PREFIX}`, req.url));
    }

    // ── Forward with user info headers (optional, for server components) ────────
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", user.userId);
    requestHeaders.set("x-user-role", user.role);
    requestHeaders.set("x-user-name", user.name);

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        // Match everything except _next static files and images
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};
