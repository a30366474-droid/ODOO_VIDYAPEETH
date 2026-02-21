-- ═══════════════════════════════════════════════════════════════════════════════════════
--                        FleetFlow - COMPLETE DATABASE SCHEMA
--                     Copy this entire script into Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 1. USERS TABLE (Authentication & Role Management)
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 2. VEHICLES TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 3. DRIVERS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 4. TRIPS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 5. MAINTENANCE RECORDS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 6. EXPENSES TABLE (Vehicle & Trip Expenses)
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 7. SAFETY INCIDENTS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 8. PERFORMANCE METRICS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 9. NOTIFICATIONS TABLE
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ──────────────────────────────────────────────────────────────────────────────────────
-- 10. AUDIT LOG TABLE (Tracking Changes)
-- ──────────────────────────────────────────────────────────────────────────────────────

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

-- ═══════════════════════════════════════════════════════════════════════════════════════
--                        TRIGGERS & FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════════════════════════════
--                        DEMO DATA - SEED USERS
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Admin User
INSERT INTO users (username, email, password, full_name, role, status) 
VALUES ('admin', 'admin@fleetflow.com', 'Admin@123', 'System Administrator', 'admin', 'active')
ON CONFLICT (email) DO NOTHING;

-- Fleet Manager
INSERT INTO users (username, email, password, full_name, role, status) 
VALUES ('manager', 'manager@fleetflow.com', 'Manager@123', 'Fleet Manager', 'fleet_manager', 'active')
ON CONFLICT (email) DO NOTHING;

-- Dispatcher
INSERT INTO users (username, email, password, full_name, role, status) 
VALUES ('dispatcher', 'dispatcher@fleetflow.com', 'Dispatcher@123', 'Trip Dispatcher', 'dispatcher', 'active')
ON CONFLICT (email) DO NOTHING;

-- Safety Officer
INSERT INTO users (username, email, password, full_name, role, status) 
VALUES ('safety', 'safety@fleetflow.com', 'Safety@123', 'Safety Officer', 'safety_officer', 'active')
ON CONFLICT (email) DO NOTHING;

-- Finance Staff
INSERT INTO users (username, email, password, full_name, role, status) 
VALUES ('finance', 'finance@fleetflow.com', 'Finance@123', 'Finance Manager', 'finance', 'active')
ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════════
--                        DEMO DATA - VEHICLES
-- ═══════════════════════════════════════════════════════════════════════════════════════

INSERT INTO vehicles (plate_number, make, model, year, vehicle_type, capacity, fuel_type, status, insurance_expiry, registration_expiry)
VALUES
  ('DL-01-A-1234', 'Mahindra', 'Bolero', 2022, 'truck', 2000, 'diesel', 'active', '2025-12-31', '2025-06-30'),
  ('DL-02-B-5678', 'Maruti', 'Eeco', 2023, 'van', 8, 'petrol', 'active', '2025-12-31', '2025-06-30'),
  ('DL-03-C-9012', 'Tata', 'Innova', 2021, 'bus', 8, 'diesel', 'active', '2025-12-31', '2025-06-30'),
  ('DL-04-D-3456', 'Hyundai', 'i20', 2023, 'car', 5, 'petrol', 'maintenance', '2025-12-31', '2025-06-30')
ON CONFLICT (plate_number) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════════════
--                        SETUP COMPLETE!
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- Demo Credentials:
-- Email: admin@fleetflow.com | Password: Admin@123
-- Email: manager@fleetflow.com | Password: Manager@123
-- Email: dispatcher@fleetflow.com | Password: Dispatcher@123
-- Email: safety@fleetflow.com | Password: Safety@123
-- Email: finance@fleetflow.com | Password: Finance@123

-- Success! Database fully configured ✅
