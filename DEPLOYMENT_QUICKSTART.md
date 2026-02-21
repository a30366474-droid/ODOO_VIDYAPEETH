# 📋 FleetFlow - Deployment Checklist & Step-by-Step

## 🎯 Quick Deployment Steps (सरल भाषा में)

### **STEP 1: Supabase Setup (5 मिनट)**
```
1. जाओ: https://supabase.com
2. Sign up और नया "Fleetflow" project बनाओ
3. Wait करो database बनने के लिए
4. Settings → API का page खोलो
5. Copy करो:
   - Project URL
   - Anon Public Key
```

### **STEP 2: Environment Variables Setup (2 मिनट)**
```
1. Project फolder में जाओ
2. `.env.local` फाइल बनाओ (पहले`.env.example` को copy करो)
3. Paste करो Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   JWT_SECRET=your_secret_key_here (कोई भी long string)
```

### **STEP 3: Database Setup (3 मिनट)**
```
1. Supabase dashboard में जाओ
2. SQL Editor खोलो
3. नीचे दी गई SQL queries copy करके चलाओ
```

### **STEP 4: Local Testing (5 मिनट)**
```bash
npm run dev
```
Browser में: http://localhost:3000

Test करो सभी features:
- ✅ Register करो
- ✅ Login करो
- ✅ Vehicle add करो
- ✅ Trip create करो

### **STEP 5: Build करो (2 मिनट)**
```bash
npm run build
```

### **STEP 6: Deploy करो - Choose One:**

#### **A. VERCEL (सबसे आसान - 5 मिनट)**
```
1. GitHub पर push करो:
   git add .
   git commit -m "Ready for deployment"
   git push origin main

2. vercel.com पर जाओ
3. "New Project" click करो
4. अपना repository select करो
5. Environment variables add करो (from .env.local)
6. Deploy पर क्लिक करो
7. Done! 🎉
```

#### **B. AWS EC2 (Production - 30 मिनट)**
```
1. AWS account बनाओ
2. EC2 instance launch करो (Ubuntu 22.04)
3. Terminal में SSH करो
4. Nीचे दि गई commands चलाओ:

   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs npm
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Clone repo
   cd /home/ubuntu
   git clone https://github.com/a30366474-droid/ODOO_VIDYAPEETH.git
   cd ODOO_VIDYAPEETH
   npm install
   
   # Create .env.local with Supabase credentials
   nano .env.local
   # (Paste your credentials, then Ctrl+X, Y, Enter)
   
   # Build
   npm run build
   
   # Install PM2
   sudo npm install -g pm2
   
   # Start app
   pm2 start npm --name "fleetflow" -- start
   pm2 startup
   pm2 save

5. Public IP address से access करो
6. SSL setup करने के लिए:
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
```

#### **C. DigitalOcean (Affordable - 15 मिनट)**
```
1. digitalocean.com पर account बनाओ
2. Create Droplet:
   - Choose: Ubuntu 22.04
   - Size: $4-6/month
   - Region: Nearest to you
3. Console में SSH करो
4. उपर दी गई AWS commands (Node install से start app तक) चलाओ
5. IP address से access करो
6. Domain pointing करो अपने DNS में
```

#### **D. Docker (Advanced - 10 मिनट)**
```
1. Docker install करो अपनी machine पर
2. Terminal में:
   
   docker build -t fleetflow:latest .
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=xxx \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=yyy \
     -e JWT_SECRET=zzz \
     fleetflow:latest

3. Access: http://localhost:3000
```

---

## 📊 Database SQL Queries

Supabase Dashboard → SQL Editor में paste करो:

```sql
-- CREATE TABLES
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'driver', 'viewer')) DEFAULT 'viewer',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- CREATE INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_user_id ON drivers(user_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);
```

---

## ⚡ Quick Command Reference

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Testing
npm test

# Git commands for deployment
git add .
git commit -m "message"
git push origin main
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change JWT_SECRET to something strong and secret
- [ ] Enable HTTPS/SSL on your domain
- [ ] Set up 2FA in Supabase
- [ ] Configure CORS in Supabase if needed
- [ ] Remove `.env.local` from git (add to .gitignore)
- [ ] Enable database backups
- [ ] Setup firewall rules
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Monitor logs regularly

---

## 🆘 Troubleshooting

### Problem: "Module not found"
```bash
npm install
```

### Problem: "Cannot connect to Supabase"
```
1. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
2. Verify Supabase project is active
3. Check internet connection
```

### Problem: "Build fails"
```bash
# Clear cache
rm -rf .next
npm run build
```

### Problem: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

---

## 📞 Support

If stuck:
1. Check DEPLOYMENT_GUIDE.md (detailed guide)
2. Check .env.example for required variables
3. Run `npm run build` to check for errors
4. Check Supabase dashboard for database issues

---

## 🎯 What to Choose?

| Platform | Cost | Time | Difficulty |
|----------|------|------|------------|
| **Vercel** | Free-$20 | 5 min | Easy ✅ |
| **AWS** | $5-50 | 30 min | Medium |
| **DigitalOcean** | $4-24 | 15 min | Easy ✅ |
| **Docker** | Varies | 10 min | Hard |

**Recommendation:** Vercel के लिए शुरुआत करो, production के लिए DigitalOcean! 🚀
