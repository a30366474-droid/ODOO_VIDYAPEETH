import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Testing Supabase Connection...");
    
    // Initialize Supabase (inside handler to avoid build-time errors)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Test 1: Check if we can connect
    console.log("📍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Test 2: Try to query users table
    const { data: users, error: usersError, count } = await supabase
      .from("users")
      .select("*", { count: "exact" });

    if (usersError) {
      console.error("❌ Users table error:", usersError);
      return NextResponse.json({
        success: false,
        error: "Users table error: " + usersError.message,
        details: usersError,
      }, { status: 500 });
    }

    console.log("✅ Users table found. Total users:", count);

    // Test 3: Try to query vehicles table
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("*", { count: "exact" });

    if (vehiclesError) {
      console.error("❌ Vehicles table error:", vehiclesError);
      return NextResponse.json({
        success: false,
        error: "Vehicles table error: " + vehiclesError.message,
      }, { status: 500 });
    }

    console.log("✅ Vehicles table found");

    // Test 4: List specific users
    const { data: allUsers, error: listError } = await supabase
      .from("users")
      .select("id, email, full_name, role, status")
      .limit(10);

    if (listError) {
      console.error("❌ Error listing users:", listError);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Supabase Connection Working!",
      database: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        tables: {
          users: {
            exists: true,
            count: count,
            records: allUsers || [],
          },
          vehicles: {
            exists: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("❌ Test Error:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}
