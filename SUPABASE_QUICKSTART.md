# 🚀 Supabase Quick Setup - 5 मिनट में!

## Step-by-Step रोडमैप

### Step 1️⃣: Supabase Project बना लो (2 min)

```
1. जाओ: https://supabase.com
2. "Start your project" पर click करो
3. फॉर्म भरो:
   - Project Name: FLEETFLOW
   - Database Password: Strong password रखो (copy करके save करो!)
   - Region: Singapore या nearest
4. "Create new project" पर click करो
5. ⏳ 2-3 मिनट wait करो...
```

### Step 2️⃣: API Keys copy करो (1 min)

```
1. Supabase dashboard खुला हुआ है
2. Left में "Settings" पर click करो
3. "API" tab खोलो
4. तीनों keys copy करो:

   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
```

### Step 3️⃣: Database Schema setup करो (1.5 min)

```
1. Supabase में "SQL Editor" खोलो
2. "New Query" पर click करो
3. यह file का content copy करो:
   📄 COMPLETE_DATABASE_SCHEMA.sql
4. SQL Editor में paste करो
5. "Run" बटन दबाओ (1-2 seconds लगेंगे)
6. ✅ Success message आएगा
```

### Step 4️⃣: Environment Variables सेट करो (1 min)

````
1. Project root में `.env.local` file बना दो
2. Template copy करो:
   📄 .env.example
3. अपने values fill करो:

   NEXT_PUBLIC_SUPABASE_URL=[copy from step 2]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[copy from step 2]
   SUPABASE_SERVICE_ROLE_KEY=[copy from step 2]

4. JWT Secrets generate करो:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
````

Output को `JWT_ACCESS_SECRET` में डालो

फिर से run करो दूसरे के लिए:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output को `JWT_REFRESH_SECRET` में डालो

````

### Step 5️⃣: Test करो! (0.5 min)

```bash
npm run dev
````

फिर browser खोलो: `http://localhost:3000/auth`

**Demo Credentials:**

```
Email:    admin@fleetflow.com
Password: Admin@123
```

---

## 📚 Complete Database Schema

**Tables (10):**

1. ✅ `users` - User authentication & roles
2. ✅ `vehicles` - Fleet vehicles
3. ✅ `drivers` - Driver profiles
4. ✅ `trips` - Trip management
5. ✅ `maintenance_records` - Service history
6. ✅ `expenses` - Cost tracking
7. ✅ `safety_incidents` - Safety reports
8. ✅ `performance_metrics` - Driver performance
9. ✅ `notifications` - User notifications
10. ✅ `audit_logs` - Change tracking

**Features:**

- ✅ Foreign Key Constraints
- ✅ Indexes for Performance
- ✅ Auto-timestamp triggers
- ✅ Check constraints
- ✅ Demo data included

---

## 🔐 Demo Users (All Password: Admin@123)

| Email                    | Role           | Purpose                   |
| ------------------------ | -------------- | ------------------------- |
| admin@fleetflow.com      | Admin          | Full system access        |
| manager@fleetflow.com    | Fleet Manager  | Manage vehicles & drivers |
| dispatcher@fleetflow.com | Dispatcher     | Trip operations only      |
| safety@fleetflow.com     | Safety Officer | Safety monitoring         |
| finance@fleetflow.com    | Finance        | Financial reports         |

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied to .env.local
- [ ] Database schema imported
- [ ] Demo users created (auto in schema)
- [ ] JWT secrets generated
- [ ] npm run dev works
- [ ] Login successful with admin credentials
- [ ] Dashboard displays correctly

---

## 🆘 Troubleshooting

### ❌ "Invalid API Keys" Error

```bash
# Check your .env.local file:
# - NEXT_PUBLIC_SUPABASE_URL सही है?
# - NEXT_PUBLIC_SUPABASE_ANON_KEY सही है?
# - पूरी key copy की है? (बीच से cut न हो)
```

### ❌ "Login failed" Error

```bash
# Check करो:
# 1. Database में users हैं? (Supabase SQL Editor में run करो:)
SELECT * FROM users;

# 2. Demo users create करो (अगर नहीं हैं):
INSERT INTO users (username, email, password, full_name, role, status)
VALUES ('admin', 'admin@fleetflow.com', 'Admin@123', 'Admin', 'admin', 'active');
```

### ❌ "CORS Error"

```bash
# Supabase Settings में अपना URL add करो:
# Settings → API → CORS Allowed Origins
# Add करो: http://localhost:3000
```

### ❌ "RLS Policy Error"

```bash
# अगर authenticated request fail हो रहे हैं:
# Settings → Authentication → Policies
# Public policies enable करो फिलहाल development के लिए
```

---

## 📖 अगला Steps

1. ✅ Supabase setup complete
2. ⬜ Create API endpoints for:
   - Vehicles CRUD
   - Trips management
   - Expense tracking
   - Safety incident reporting
3. ⬜ Add data validation
4. ⬜ Implement RLS policies

---

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase SQL Editor Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [PostgreSQL Auth Best Practices](https://www.postgresql.org/docs/current/sql-createrole.html)

---

## 💾 Files Reference

| File                           | Purpose                                 |
| ------------------------------ | --------------------------------------- |
| `SUPABASE_FULL_SETUP.md`       | Complete setup guide (detailed)         |
| `COMPLETE_DATABASE_SCHEMA.sql` | Full database schema (copy to Supabase) |
| `.env.example`                 | Environment variable template           |
| `QUICK_SETUP.sql`              | Quick seed data                         |

---

**Success!** 🎉 Supabase fully integrated with FleetFlow!
