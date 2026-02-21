// ─── Protected API: Trips ─────────────────────────────────────────────────────
// GET  /api/trips          → all authenticated roles can read
// POST /api/trips          → dispatcher, fleet_manager, admin can create
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

// ── GET /api/trips ────────────────────────────────────────────────────────────
export const GET = withAuth(
    async (_req, { user }) => {
        // TODO: Replace with real DB query (filtered by role if needed)
        const trips = [
            { id: "TRP-001", origin: "Mumbai", destination: "Pune", status: "completed", driver: "Raj Kumar", vehicle: "MH-01-AB-1234" },
            { id: "TRP-002", origin: "Delhi", destination: "Agra", status: "in_progress", driver: "Suresh Patil", vehicle: "DL-02-CD-5678" },
            { id: "TRP-003", origin: "Kolkata", destination: "Bhubaneswar", status: "scheduled", driver: "Amit Singh", vehicle: "WB-04-EF-9012" },
        ];

        return NextResponse.json({
            success: true,
            role: user.role,
            data: trips,
        });
    },
    ["trips:read"]   // All roles that have trips:read will pass
);

// ── POST /api/trips (Create Trip) ─────────────────────────────────────────────
export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { origin, destination, driverId, vehicleId, scheduledAt } = body;

        // Input validation
        if (!origin || !destination || !driverId || !vehicleId || !scheduledAt) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: origin, destination, driverId, vehicleId, scheduledAt" },
                { status: 400 }
            );
        }

        // TODO: Replace with actual DB insert
        const newTrip = {
            id: `TRP-${Date.now()}`,
            origin,
            destination,
            driverId,
            vehicleId,
            scheduledAt,
            status: "scheduled",
            createdBy: user.userId,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: newTrip }, { status: 201 });
    },
    ["trips:create"]  // Only dispatcher, fleet_manager, admin have this
);
