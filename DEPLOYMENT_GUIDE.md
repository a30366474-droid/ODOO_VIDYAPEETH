# 🚀 FleetFlow - Complete Deployment Guide

## Phase 1: Pre-Deployment Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create `.env.local` File
Create a `.env.local` file in project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Secret (for session management)
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars

# App URL (for production)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 3: Setup Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project:
   - Project Name: FleetFlow
   - Database Password: Strong password
   - Region: Select nearest to your users
3. Wait for database to be created
4. Go to **Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Create Database Tables in Supabase

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Users Table
CREATE TABLE users (
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Vehicles Table
CREATE TABLE vehicles (
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

CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Drivers Table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_user_id ON drivers(user_id);

-- Trips Table
CREATE TABLE trips (
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

CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);

-- Maintenance Records Table
CREATE TABLE maintenance_records (
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

CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);
```

---

## Phase 2: Local Testing

### Step 5: Build Project Locally
```bash
npm run build
```

### Step 6: Start Development Server
```bash
npm run dev
```

Test at `http://localhost:3000`:
- ✅ Register new user
- ✅ Login with credentials
- ✅ Add vehicle
- ✅ Create trip
- ✅ View all data

---

## Phase 3: Deployment Options

### ⭐ OPTION 1: Deploy to Vercel (RECOMMENDED)

**Vercel सबसे आसान है Next.js के लिए!**

1. **Push Code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Click "New Project"
   - Connect your GitHub repository
   - Select `ODOO_VIDYAPEETH` repository
   - Click Import

3. **Configure Environment Variables:**
   - Go to **Settings > Environment Variables**
   - Add all from `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     JWT_SECRET
     NEXT_PUBLIC_APP_URL
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Get your URL: `https://yourapp.vercel.app`

**Pros:** Fast, free tier available, automatic deployments on git push
**Time:** 5-10 minutes

---

### OPTION 2: Deploy to AWS (EC2)

**For production-grade deployment**

1. **Launch EC2 Instance:**
   - AMI: Ubuntu 22.04 LTS (Free tier available)
   - Instance Type: t3.micro (or t4g.micro for ARM)
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **SSH into Server:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install PM2 (for process management)
   sudo npm install -g pm2
   ```

4. **Clone Repository:**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/a30366474-droid/ODOO_VIDYAPEETH.git
   cd ODOO_VIDYAPEETH
   npm install
   ```

5. **Create `.env.local`:**
   ```bash
   nano .env.local
   ```
   Paste your Supabase and JWT credentials

6. **Build Application:**
   ```bash
   npm run build
   ```

7. **Start with PM2:**
   ```bash
   pm2 start npm --name "fleetflow" -- start
   pm2 startup
   pm2 save
   ```

8. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Replace with:
   ```nginx
   server {
     listen 80 default_server;
     listen [::]:80 default_server;
     
     server_name _;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

9. **Enable and Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

10. **Setup SSL (HTTPS) with Let's Encrypt:**
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

**Time:** 20-30 minutes

---

### OPTION 3: Deploy to DigitalOcean (Simple & Affordable)

1. **Create Droplet:**
   - Choose: Ubuntu 22.04 LTS
   - Size: $4-6/month (Basic)
   - Region: Choose nearest

2. **SSH & Install:**
   Same as AWS steps above (copy-paste for Node.js, Nginx, PM2)

3. **Deploy:**
   Same as AWS deployment steps

**Cost:** $4-6/month minimum
**Time:** 15-20 minutes

---

### OPTION 4: Deploy to Docker (Production-Ready)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Create `.dockerignore`:
```
node_modules
.next
.git
.gitignore
README.md
.env.local
```

**Build & Run:**
```bash
docker build -t fleetflow .
docker run -p 3000:3000 --env-file .env.local fleetflow
```

Deploy using:
- **Docker Hub** + AWS ECS
- **Railway.app** (drag & drop)
- **Render.com** (free tier available)
- **Fly.io**

---

## Phase 4: Post-Deployment

### Step 7: Setup Domain Name

1. Buy domain from: GoDaddy, Namecheap, Route53
2. Configure DNS:
   - For Vercel: Use Vercel's nameservers
   - For AWS/DigitalOcean: Point to server IP or load balancer

### Step 8: Setup Monitoring

```bash
# PM2 Plus (free tier available)
pm2 plus

# Or use CloudWatch (AWS), DataDog, New Relic
```

### Step 9: Setup Backups

Supabase automatically backups, but:
- Enable daily backups in Supabase dashboard
- Test restore process monthly

### Step 10: Security Checklist

- ✅ Change default passwords
- ✅ Enable 2FA for Supabase
- ✅ Update JWT_SECRET (strong, random)
- ✅ Setup CORS in Supabase if needed
- ✅ Enable HTTPS/SSL
- ✅ Setup firewall rules
- ✅ Enable database backups
- ✅ Monitor logs for errors

---

## Quick Deployment Checklist

**Pre-Deployment:**
- [ ] `.env.local` configured locally
- [ ] Database tables created in Supabase
- [ ] `npm run build` successful
- [ ] Tested all features locally
- [ ] Code committed to git

**During Deployment:**
- [ ] Environment variables added to hosting
- [ ] Build completes successfully
- [ ] App is accessible
- [ ] HTTPS working
- [ ] Database connection working

**Post-Deployment:**
- [ ] Test registration/login
- [ ] Test CRUD operations
- [ ] Check console for errors
- [ ] Monitor performance
- [ ] Setup backups/monitoring

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Invalid supabaseUrl or anon key"
- Check `.env.local` has correct values
- Verify Supabase project is active
- Restart application

### "Database connection refused"
- Check Supabase status page
- Verify firewall allows outbound HTTPS
- Check credentials in Supabase dashboard

### "Build fails on Vercel"
- Check build logs in Vercel dashboard
- Verify Node.js version compatibility
- Check for missing environment variables

---

## Recommended Deployment Path

### For Development:
```
Local → npm run dev → Testing
```

### For Small Production:
```
GitHub → Vercel → Production (Recommended)
```

### For Medium Production:
```
GitHub → DigitalOcean + Nginx + SSL → Production
```

### For Large Production:
```
GitHub → AWS ECS + RDS + CloudFront → Production
```

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/production-checklist)
- [DigitalOcean Docs](https://docs.digitalocean.com/)

---

**Ready to deploy?** Choose your option above and I'll help with detailed setup! 🚀
