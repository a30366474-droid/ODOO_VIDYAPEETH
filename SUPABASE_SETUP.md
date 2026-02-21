# Supabase Database Setup - Complete Guide

## Step 1: Create Database Tables

Copy and paste this SQL script in **Supabase SQL Editor** and run it:

```sql
-- Users Table with simple password column
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'fleet_manager', 'dispatcher', 'safety_officer', 'finance')) DEFAULT 'fleet_manager',
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  type TEXT NOT NULL,
  capacity INTEGER,
  status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  mileage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  status TEXT DEFAULT 'scheduled',
  distance INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  cost DECIMAL(10,2),
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);
```

## Step 2: Create Test Admin User

After tables are created, run this SQL to create a test admin account:

```sql
INSERT INTO users (username, email, password_hash, full_name, role, status) 
VALUES (
  'admin',
  'admin@fleetflow.com',
  '$2a$12$3FORlsZL5mPEpfXkgO4vPugcTb2t7rIjZvBHYfBXvbYXFgUPqLSUC', -- password: Admin@123
  'System Administrator',
  'admin',
  'active'
);
```

## Step 3: How to Register New Users

**Option 1: Through Registration Form (Recommended)**

1. Go to: http://localhost:3000/auth
2. Click on **Register** tab
3. Fill in the form:
   - **Full Name:** Your Name
   - **Username:** unique username (no spaces)
   - **Email:** your@email.com
   - **Password:** Min 8 characters
   - **Role:** Choose from:
     - `admin` - Full system access
     - `fleet_manager` - Manage fleet & drivers
     - `dispatcher` - Manage trips
     - `safety_officer` - Safety monitoring
     - `finance` - Financial reports
4. Click **Register** ✅
5. You will be auto-logged in

**Option 2: Through Supabase Dashboard**

1. Go to Supabase SQL Editor
2. Replace `<values>` in this SQL:
```sql
INSERT INTO users (username, email, password_hash, full_name, role, status) 
VALUES (
  '<username>',
  '<email>',
  crypt('<password>', gen_salt('bf')), -- Password hashing
  '<full_name>',
  '<role>',  -- one of: admin, fleet_manager, dispatcher, safety_officer, finance
  'active'
);
```

## Step 4: Test Credentials

**Admin Account:**
- **Email:** admin@fleetflow.com
- **Password:** Admin@123

**Try registering a new account** through the registration form instead - it's much easier and will create the account in Supabase automatically!
