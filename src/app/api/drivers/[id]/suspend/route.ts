// ─── Protected API: Drivers – Suspend ─────────────────────────────────────────
// PATCH /api/drivers/[id]/suspend
// Allowed: admin, fleet_manager, safety_officer
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

export const PATCH = withAuth<{ id: string }>(
    async (req, { user, params }) => {
        const driverId = params.id;
        if (!driverId) {
            return NextResponse.json({ success: false, error: "Driver ID is required." }, { status: 400 });
        }

        const body = await req.json();
        const { reason } = body;

        if (!reason || reason.trim().length < 10) {
            return NextResponse.json(
                { success: false, error: "A detailed suspension reason (min 10 chars) is required." },
                { status: 400 }
            );
        }

        // TODO: Update driver status in DB
        // await db.driver.update({ where: { id: driverId }, data: { status: "suspended", suspendedBy: user.userId, suspensionReason: reason } });

        const result = {
            driverId,
            status: "suspended",
            suspendedBy: user.userId,
            suspenderRole: user.role,
            reason,
            suspendedAt: new Date().toISOString(),
        };

        console.log(`[AUDIT] Driver ${driverId} suspended by ${user.name} (${user.role}) – Reason: ${reason}`);

        return NextResponse.json({ success: true, data: result });
    },
    ["drivers:suspend"]  // admin, fleet_manager, safety_officer only
);
