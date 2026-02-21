// ─── Protected API: Finance Approve ──────────────────────────────────────────
// POST /api/finance/approve
// Allowed: admin, finance ONLY (finance:approve permission)
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { entryId, action, notes } = body;   // action: "approved" | "rejected"

        if (!entryId || !action) {
            return NextResponse.json(
                { success: false, error: "entryId and action ('approved' | 'rejected') are required." },
                { status: 400 }
            );
        }

        if (!["approved", "rejected"].includes(action)) {
            return NextResponse.json(
                { success: false, error: "action must be 'approved' or 'rejected'." },
                { status: 400 }
            );
        }

        // TODO: Update DB entry status
        const result = {
            entryId,
            action,
            notes: notes ?? null,
            processedBy: user.userId,
            processedAt: new Date().toISOString(),
        };

        console.log(`[AUDIT] Finance entry ${entryId} ${action} by ${user.name} (${user.role})`);

        return NextResponse.json({ success: true, data: result });
    },
    ["finance:approve"]  // admin, finance ONLY
);
