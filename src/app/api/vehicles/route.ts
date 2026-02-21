// ─── Protected API: Vehicles ──────────────────────────────────────────────────
// GET  /api/vehicles        → all authenticated roles
// POST /api/vehicles        → fleet_manager, admin only
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

// ── GET /api/vehicles ─────────────────────────────────────────────────────────
export const GET = withAuth(
    async (_req, { user }) => {
        // TODO: Replace with DB query
        const vehicles = [
            { id: "VHL-001", plate: "MH-01-AB-1234", type: "Truck", status: "active", mileage: 45200, lastService: "2025-12-01" },
            { id: "VHL-002", plate: "DL-02-CD-5678", type: "Van", status: "active", mileage: 23400, lastService: "2025-11-15" },
            { id: "VHL-003", plate: "KA-03-GH-3456", type: "Truck", status: "maintenance", mileage: 78900, lastService: "2025-10-20" },
        ];

        return NextResponse.json({ success: true, role: user.role, data: vehicles });
    },
    ["vehicles:read"]
);

// ── POST /api/vehicles (Add Vehicle) ─────────────────────────────────────────
export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { plate, type, year, capacity } = body;

        if (!plate || !type || !year) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: plate, type, year" },
                { status: 400 }
            );
        }

        // TODO: DB insert
        const newVehicle = {
            id: `VHL-${Date.now()}`,
            plate,
            type,
            year,
            capacity: capacity ?? null,
            status: "active",
            mileage: 0,
            addedBy: user.userId,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: newVehicle }, { status: 201 });
    },
    ["vehicles:create"]  // Only fleet_manager and admin
);

// ── DELETE /api/vehicles ──────────────────────────────────────────────────────
// Separate file would handle [id] – shown here for completeness
export const DELETE = withAuth(
    async (req, { user }) => {
        const { vehicleId } = await req.json();
        if (!vehicleId) {
            return NextResponse.json({ success: false, error: "vehicleId is required." }, { status: 400 });
        }
        // TODO: DB soft-delete
        return NextResponse.json({
            success: true,
            message: `Vehicle ${vehicleId} retired by ${user.name} (${user.role})`,
        });
    },
    ["vehicles:delete"]  // Only admin
);
