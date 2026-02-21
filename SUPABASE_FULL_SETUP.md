# 🗄️ Supabase Complete Setup - Full Fledged Project

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Get API Credentials](#get-api-credentials)
4. [Database Schema Setup](#database-schema-setup)
5. [Enable Row Level Security](#enable-row-level-security)
6. [Create Demo Data](#create-demo-data)
7. [Environment Configuration](#environment-configuration)
8. [Verify Setup](#verify-setup)

---

## Prerequisites

- [Supabase Account](https://supabase.com)
- Access to Supabase Dashboard
- 15 minutes of your time ⏱️

---

## Create Supabase Project

### Step 1: Go to Supabase

1. Open [https://supabase.com](https://supabase.com)
2. Click "**Start your project**" या sign up करो
3. Select **"New Project"**

### Step 2: Configure Project

```
Project Name:        FLEETFLOW
Database Password:   (जरूरी - strong password रखो)
Region:              India (or nearest)
Postgresql Version:  15 (recommended)
```

### Step 3: Wait for Setup

- Dashboard खुल जाएगा in 2-3 मिनट
- Database तैयार हो जाएगा

---

## Get API Credentials

### Step 1: Navigate to Settings

1. **Left Sidebar** → **Settings**
2. Click **"API"** tab

### Step 2: Copy Credentials

You'll see two keys - **copy दोनों**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **IMPORTANT:** `NEXT_PUBLIC_ANON_KEY` public है, लेकिन RLS से protected है

---

## Database Schema Setup

### Step 1: Go to SQL Editor

1. **Left Sidebar** → **SQL Editor**
2. Click **"New Query"**

### Step 2: Copy Complete Schema

नीचे **Complete SQL Script** को copy करो और Supabase SQL Editor में paste करो:

```sql
-- ═══════════════════════════════════════════════════════════════════════════
--                    FleetFlow - Complete Database Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────────
-- 1. USERS TABLE (Authentication & Role Management)
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'fleet_manager', 'dispatcher', 'safety_officer', 'finance')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ──────────────────────────────────────────────────────────────────────────
-- 2. VEHICLES TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('car', 'truck', 'van', 'bus')),
  capacity INTEGER DEFAULT 5,
  fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
  status TEXT NOT NULL CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  current_mileage INTEGER DEFAULT 0,
  last_service_date DATE,
  insurance_expiry DATE,
  registration_expiry DATE,
  purchase_date DATE,
  cost DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type);

-- ──────────────────────────────────────────────────────────────────────────
-- 3. DRIVERS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  license_class TEXT,
  phone TEXT,
  emergency_contact TEXT,
  emergency_contact_phone TEXT,
  rating DECIMAL(3,2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
  total_trips INTEGER DEFAULT 0,
  total_distance INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('available', 'on_trip', 'off_duty', 'suspended')) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_license ON drivers(license_number);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

-- ──────────────────────────────────────────────────────────────────────────
-- 4. TRIPS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  origin_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  origin_latitude DECIMAL(10,8),
  origin_longitude DECIMAL(11,8),
  destination_latitude DECIMAL(10,8),
  destination_longitude DECIMAL(11,8),
  scheduled_start TIMESTAMP NOT NULL,
  estimated_end TIMESTAMP,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  distance_km DECIMAL(10,2),
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  cargo_description TEXT,
  cargo_weight DECIMAL(10,2),
  route_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_scheduled_start ON trips(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);

-- ──────────────────────────────────────────────────────────────────────────
-- 5. MAINTENANCE RECORDS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('regular', 'repair', 'inspection', 'emergency')),
  description TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  parts_used TEXT,
  technician_name TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_records(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON maintenance_records(scheduled_date);

-- ──────────────────────────────────────────────────────────────────────────
-- 6. EXPENSES TABLE (Vehicle & Trip Expenses)
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('fuel', 'toll', 'maintenance', 'parking', 'other')),
  category TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  description TEXT,
  receipt_url TEXT,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- ──────────────────────────────────────────────────────────────────────────
-- 7. SAFETY INCIDENTS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS safety_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('accident', 'violation', 'near_miss', 'other')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  injuries BOOLEAN DEFAULT FALSE,
  vehicle_damage BOOLEAN DEFAULT FALSE,
  police_report_number TEXT,
  insurance_claim_filed BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('open', 'under_review', 'resolved', 'closed')) DEFAULT 'open',
  investigation_notes TEXT,
  reported_by UUID NOT NULL REFERENCES users(id),
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_safety_vehicle_id ON safety_incidents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_safety_driver_id ON safety_incidents(driver_id);
CREATE INDEX IF NOT EXISTS idx_safety_status ON safety_incidents(status);
CREATE INDEX IF NOT EXISTS idx_safety_severity ON safety_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_safety_date_time ON safety_incidents(date_time);

-- ──────────────────────────────────────────────────────────────────────────
-- 8. PERFORMANCE METRICS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  average_speed_kmh DECIMAL(6,2),
  harsh_braking_count INTEGER DEFAULT 0,
  harsh_acceleration_count INTEGER DEFAULT 0,
  speeding_duration_minutes INTEGER DEFAULT 0,
  fuel_efficiency_kmpl DECIMAL(6,2),
  idling_duration_minutes INTEGER DEFAULT 0,
  safety_score DECIMAL(3,2),
  efficiency_score DECIMAL(3,2),
  overall_score DECIMAL(3,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_performance_driver_id ON performance_metrics(driver_id);
CREATE INDEX IF NOT EXISTS idx_performance_vehicle_id ON performance_metrics(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_performance_metric_date ON performance_metrics(metric_date);

-- ──────────────────────────────────────────────────────────────────────────
-- 9. NOTIFICATIONS TABLE
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('info', 'warning', 'error', 'success')),
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ──────────────────────────────────────────────────────────────────────────
-- 10. AUDIT LOG TABLE (Tracking Changes)
-- ──────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ═══════════════════════════════════════════════════════════════════════════
--                      DATA CONSTRAINTS & FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_incidents_updated_at BEFORE UPDATE ON safety_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON performance_metrics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Run the Script

1. एक बार copy करने के बाद, **"Run"** button दबाओ
2. Script execute होगा (1-2 सेकंड में)
3. Success message दिखेगा ✅

---

## Enable Row Level Security

### Step 1: Go to Authentication Settings

1. **Left Sidebar** → **Authentication**
2. Click **"Policies"**

### Step 2: Create Basic RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid()::text = id::text);

-- Policy: Admins can see all users
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()::uuid) = 'admin'
);

-- Policy: Users can read vehicles
CREATE POLICY "Users can read vehicles"
ON vehicles FOR SELECT
USING (true); -- सभी authenticated users देख सकते हैं

-- Policy: Fleet managers can update vehicles
CREATE POLICY "Fleet managers can update vehicles"
ON vehicles FOR UPDATE
USING (
  (SELECT role FROM users WHERE id = auth.uid()::uuid) IN ('admin', 'fleet_manager')
);
```

> Run यह script एक नए SQL Query में

---

## Create Demo Data

### Step 1: Insert Demo Users

```sql
-- Demo Admin User
INSERT INTO users (id, username, email, password, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@fleetflow.com',
  'Admin@123', -- इसे production में hash करो!
  'System Administrator',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Demo Fleet Manager
INSERT INTO users (id, username, email, password, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'manager',
  'manager@fleetflow.com',
  'Manager@123',
  'Fleet Manager',
  'fleet_manager',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Demo Dispatcher
INSERT INTO users (id, username, email, password, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'dispatcher',
  'dispatcher@fleetflow.com',
  'Dispatcher@123',
  'Trip Dispatcher',
  'dispatcher',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Demo Safety Officer
INSERT INTO users (id, username, email, password, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'safety',
  'safety@fleetflow.com',
  'Safety@123',
  'Safety Officer',
  'safety_officer',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Demo Finance Staff
INSERT INTO users (id, username, email, password, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'finance',
  'finance@fleetflow.com',
  'Finance@123',
  'Finance Manager',
  'finance',
  'active'
) ON CONFLICT (email) DO NOTHING;
```

### Step 2: Insert Sample Vehicles

```sql
-- Sample Vehicles
INSERT INTO vehicles (id, plate_number, make, model, year, vehicle_type, capacity, fuel_type, status, insurance_expiry, registration_expiry)
VALUES
  (gen_random_uuid(), 'DL-01-A-1234', 'Mahindra', 'Bolero', 2022, 'truck', 2000, 'diesel', 'active', '2025-12-31', '2025-06-30'),
  (gen_random_uuid(), 'DL-02-B-5678', 'Maruti', 'Eeco', 2023, 'van', 8, 'petrol', 'active', '2025-12-31', '2025-06-30'),
  (gen_random_uuid(), 'DL-03-C-9012', 'Tata', 'Innova', 2021, 'bus', 8, 'diesel', 'active', '2025-12-31', '2025-06-30'),
  (gen_random_uuid(), 'DL-04-D-3456', 'Hyundai', 'i20', 2023, 'car', 5, 'petrol', 'maintenance', '2025-12-31', '2025-06-30');
ON CONFLICT (plate_number) DO NOTHING;
```

---

## Environment Configuration

### Step 1: Create `.env.local` File

Create नई file: `.env.local` (root directory में)

```env
# ──────────────────────────────────────────────────────────────────────────
# SUPABASE CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────

# Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ──────────────────────────────────────────────────────────────────────────
# JWT SECRETS (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# ──────────────────────────────────────────────────────────────────────────

JWT_ACCESS_SECRET=your-long-random-secret-here-min-64-chars-abcd1234efgh5678ijkl9012mnop3456qrst7890uv
JWT_REFRESH_SECRET=another-long-random-secret-here-min-64-chars-wxyz1234abcd5678efgh9012ijkl3456mnop7890qr

# ──────────────────────────────────────────────────────────────────────────
# APPLICATION
# ──────────────────────────────────────────────────────────────────────────

NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# ──────────────────────────────────────────────────────────────────────────
# (Optional) MONITORING & ANALYTICS
# ──────────────────────────────────────────────────────────────────────────

# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
# SENTRY_DSN=https://your-sentry-dsn
```

---

## Verify Setup

### Step 1: Test Connection

Terminal में run करो:

```bash
npm run dev
```

### Step 2: Test Login

Open: `http://localhost:3000/auth`

**Demo Credentials:**

```
Email:    admin@fleetflow.com
Password: Admin@123
```

### Step 3: Check Dashboard

- ✅ Login successful?
- ✅ Dashboard loads?
- ✅ Menu items show?
- ✅ User info displays?

If सब कुछ working है, **Setup Complete!** 🎉

---

## Troubleshooting

### Issue: "Invalid API Keys"

**Solution:**

- Copy करो API keys फिर से
- Check करो: `NEXT_PUBLIC_SUPABASE_URL` सही है?
- Check करो: `NEXT_PUBLIC_SUPABASE_ANON_KEY` सही है?

### Issue: "Login fails with 'Invalid email or password'"

**Solution:**

- Check करो: Demo user created है? (See Create Demo Data)
- Password सही है? (Admin@123)

### Issue: "CORS Error"

**Solution:**

- Supabase Dashboard → Settings → API → Configure CORS
- Add करो: `http://localhost:3000`

### Issue: "RLS Policy Error"

**Solution:**

- Policies enable करो (See Enable Row Level Security)
- Supabase Documentation देखो

---

## Next Steps

1. ✅ Create Supabase project
2. ✅ Copy API credentials
3. ✅ Run database schema
4. ✅ Enable RLS policies
5. ✅ Insert demo data
6. ✅ Configure .env.local
7. ✅ Test login

**अब आप ready हो!** 🚀

अगर कोई problem है, तो [Supabase Docs](https://supabase.com/docs) देखो।
