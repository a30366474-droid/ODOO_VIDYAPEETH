// ─── Protected API: Financial Reports ────────────────────────────────────────
// GET  /api/finance/reports   → finance, fleet_manager, admin
// POST /api/finance/reports   → finance, admin (create expense record)
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/middleware/withAuth";

// ── GET /api/finance/reports ──────────────────────────────────────────────────
export const GET = withAuth(
    async (req, { user }) => {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate") ?? "2025-01-01";
        const endDate = searchParams.get("endDate") ?? new Date().toISOString().split("T")[0];
        const type = searchParams.get("type") ?? "all";   // fuel | maintenance | salary | all

        // TODO: Replace with DB query filtered by date range and type
        const report = {
            period: { startDate, endDate },
            summary: {
                totalRevenue: 3_400_000,
                totalExpenses: 2_100_000,
                netProfit: 1_300_000,
                profitMarginPct: 38.2,
            },
            breakdown: {
                fuel: 650_000,
                maintenance: 210_000,
                salaries: 980_000,
                tolls: 85_000,
                insurance: 175_000,
            },
            generatedBy: user.name,
            generatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: report });
    },
    ["finance:read"]  // finance, fleet_manager, admin
);

// ── POST /api/finance/reports (Create Expense/Entry) ─────────────────────────
export const POST = withAuth(
    async (req, { user }) => {
        const body = await req.json();
        const { category, amount, description, vehicleId, date } = body;

        if (!category || !amount || !description || !date) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: category, amount, description, date" },
                { status: 400 }
            );
        }

        if (typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { success: false, error: "Amount must be a positive number." },
                { status: 400 }
            );
        }

        // TODO: DB insert
        const entry = {
            id: `FIN-${Date.now()}`,
            category,
            amount,
            description,
            vehicleId: vehicleId ?? null,
            date,
            createdBy: user.userId,
            createdAt: new Date().toISOString(),
            status: "pending_approval",
        };

        return NextResponse.json({ success: true, data: entry }, { status: 201 });
    },
    ["finance:create"]  // finance, admin only
);
