// ─── Protected API: Safety Incidents ─────────────────────────────────────────
// GET  /api/safety/incidents  → admin, fleet_manager, safety_officer
// POST /api/safety/incidents  → safety_officer, admin
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

// ── GET /api/safety/incidents ─────────────────────────────────────────────────
export const GET = withAuth(
    async (_req, { user }) => {
        // TODO: Replace with DB query
        const incidents = [
            { id: "INC-001", type: "accident", severity: "high", driver: "Raj Kumar", vehicle: "MH-01-AB-1234", date: "2025-12-10", status: "under_review" },
            { id: "INC-002", type: "near_miss", severity: "medium", driver: "Suresh Patil", vehicle: "DL-02-CD-5678", date: "2025-12-15", status: "resolved" },
            { id: "INC-003", type: "vehicle_fault", severity: "low", driver: "Amit Singh", vehicle: "WB-04-EF-9012", date: "2025-12-18", status: "resolved" },
        ];

        return NextResponse.json({ success: true, role: user.role, data: incidents });
    },
    ["safety:read"]  // admin, fleet_manager, safety_officer
);

// ── POST /api/safety/incidents (File Incident Report) ────────────────────────
export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { type, severity, driverId, vehicleId, description, incidentDate } = body;

        if (!type || !severity || !driverId || !vehicleId || !description || !incidentDate) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: type, severity, driverId, vehicleId, description, incidentDate" },
                { status: 400 }
            );
        }

        const validSeverities = ["low", "medium", "high", "critical"];
        if (!validSeverities.includes(severity)) {
            return NextResponse.json(
                { success: false, error: `severity must be one of: ${validSeverities.join(", ")}` },
                { status: 400 }
            );
        }

        // TODO: DB insert
        const incident = {
            id: `INC-${Date.now()}`,
            type,
            severity,
            driverId,
            vehicleId,
            description,
            incidentDate,
            reportedBy: user.userId,
            reporterRole: user.role,
            status: "open",
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: incident }, { status: 201 });
    },
    ["safety:create"]  // safety_officer, admin only
);
