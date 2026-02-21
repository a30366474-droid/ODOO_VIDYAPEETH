// ─── Fleet Management RBAC – Auth Middleware ─────────────────────────────────
//
//  Usage in any API route:
//
//    import { withAuth } from "@/middleware/withAuth";
//    export const GET = withAuth(handler, ["vehicles:read"]);
//    export const PATCH = withAuth<{ id: string }>(handler, ["vehicles:update"]);
//
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, extractBearerToken } from "@/lib/jwt";
import { hasAllPermissions } from "@/lib/roles";
import type { Permission, Role, JWTPayload } from "@/types/rbac";

// ── Types ────────────────────────────────────────────────────────────────────

type RouteHandler<P extends Record<string, string> = Record<string, string>> = (
    req: NextRequest,
    context: { user: JWTPayload; params: P }
) => Promise<NextResponse> | NextResponse;

// ── Core Middleware ───────────────────────────────────────────────────────────

/**
 * Higher-order function that wraps a Next.js route handler with:
 *  1. JWT verification (Bearer header or httpOnly cookie)
 *  2. Optional role whitelist check
 *  3. Optional permission check (all must pass)
 *
 * @param handler         The actual route handler
 * @param permissions     Permissions that ALL must be satisfied (AND logic)
 * @param allowedRoles    Role whitelist; omit to allow any authenticated user
 */
export function withAuth<P extends Record<string, string> = Record<string, string>>(
    handler: RouteHandler<P>,
    permissions: Permission[] = [],
    allowedRoles?: Role[]
) {
    return async (
        req: NextRequest,
        routeContext?: { params?: Promise<Record<string, string>> | Record<string, string> }
    ): Promise<Response> => {
        try {
            // ── 1. Extract token (header first, then httpOnly cookie) ───────────
            const authHeader = req.headers.get("authorization");
            const token =
                extractBearerToken(authHeader) ??
                req.cookies.get("accessToken")?.value ??
                null;

            if (!token) {
                return NextResponse.json(
                    { success: false, error: "Authentication required. Please log in." },
                    { status: 401 }
                );
            }

            // ── 2. Verify token ─────────────────────────────────────────────────
            let user: JWTPayload;
            try {
                user = verifyAccessToken(token);
            } catch (err: unknown) {
                const isExpired =
                    err instanceof Error && err.name === "TokenExpiredError";
                return NextResponse.json(
                    {
                        success: false,
                        error: isExpired
                            ? "Session expired. Please log in again."
                            : "Invalid token. Please log in again.",
                    },
                    { status: 401 }
                );
            }

            // ── 3. Role whitelist check ─────────────────────────────────────────
            if (allowedRoles && !allowedRoles.includes(user.role)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
                    },
                    { status: 403 }
                );
            }

            // ── 4. Permission check ─────────────────────────────────────────────
            if (permissions.length > 0 && !hasAllPermissions(user.role, permissions)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Insufficient permissions for this action.",
                        required: permissions,
                    },
                    { status: 403 }
                );
            }

            // ── 5. Handle async params for Next.js 16+ ─────────────────────────
            let params: Record<string, string> = {};
            if (routeContext?.params) {
                if (routeContext.params instanceof Promise) {
                    params = await routeContext.params;
                } else {
                    params = routeContext.params;
                }
            }

            // ── 6. Pass to handler ──────────────────────────────────────────────
            return await handler(req, { user, params: params as P });
        } catch (err) {
            console.error("[withAuth] Unexpected error:", err);
            return NextResponse.json(
                { success: false, error: "Internal server error." },
                { status: 500 }
            );
        }
    };
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

/** Require the user to be authenticated (any role) */
export const requireAuth = <P extends Record<string, string> = Record<string, string>>(
    handler: RouteHandler<P>
) => withAuth(handler);

/** Require the user to be an Admin */
export const requireAdmin = <P extends Record<string, string> = Record<string, string>>(
    handler: RouteHandler<P>
) => withAuth(handler, [], ["admin"]);

/** Require the user to be Admin OR Fleet Manager */
export const requireFleetManager = <P extends Record<string, string> = Record<string, string>>(
    handler: RouteHandler<P>
) => withAuth(handler, [], ["admin", "fleet_manager"]);
