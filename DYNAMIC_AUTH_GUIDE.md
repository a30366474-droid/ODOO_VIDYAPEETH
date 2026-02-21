# Dynamic Authentication & Role-Based Access Control Guide

## Overview

FleetFlow now has a complete dynamic authentication system with role-based access control (RBAC). Users can log in with different profiles and see different features based on their role and permissions.

## Available Roles & Permissions

### 1. **Admin** (`admin`)

- **Full system access** - can perform all operations
- **Permissions**: All permissions including user management, role assignment
- Demo: `admin@fleetflow.com` / `Admin@123`

### 2. **Fleet Manager** (`fleet_manager`)

- **Operational access** - manages vehicles, drivers, and trips
- **Cannot**: Approve finance documents, manage user accounts
- **Demo**: `manager@fleetflow.com` / `Admin@123`

### 3. **Dispatcher** (`dispatcher`)

- **Trip operations only** - creates and assigns trips
- **Read-only**: Vehicles, drivers, maintenance
- **Demo**: `dispatch@fleetflow.com` / `Admin@123`

### 4. **Safety Officer** (`safety_officer`)

- **Safety & maintenance focus** - create safety records
- **Can suspend drivers** if safety issues detected
- **Demo**: `safety@fleetflow.com` / `Admin@123`

### 5. **Finance** (`finance`)

- **Financial records only** - view and manage finances
- **Can approve finance documents**
- **Demo**: `finance@fleetflow.com` / `Admin@123`

## How to Log In as Different Users

1. Go to the login page
2. Select a demo credential from the display
3. Enter email: `role@fleetflow.com`
4. Enter password: `Admin@123`
5. Dashboard will automatically show only features available to that role

## Authentication Flow

```
User Login
    ↓
[POST /api/auth/login]
    ↓
Verify credentials against database
    ↓
Generate JWT token with user role
    ↓
Store token in httpOnly cookies & sessionStorage
    ↓
Update AuthContext with user profile
    ↓
User redirected to dashboard
```

## Using Auth in Your Components

### 1. **Get Current User Info**

```tsx
"use client";
import { useAuth } from "@/context";

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### 2. **Check If User Has Permission**

```tsx
import { useHasPermission, useHasRole } from "@/hooks";

export function EditVehicleButton() {
  const canEdit = useHasPermission("vehicles:update");

  if (!canEdit) return null;

  return <button>Edit Vehicle</button>;
}
```

### 3. **Check Multiple Permissions**

```tsx
import { useHasAllPermissions, useHasAnyPermission } from "@/hooks";

export function BudgetApprover() {
  // User must have ALL permissions
  const canApprove = useHasAllPermissions(["finance:read", "finance:approve"]);

  // User must have AT LEAST ONE permission
  const canManageMaintenance = useHasAnyPermission([
    "maintenance:create",
    "maintenance:update",
  ]);

  return <div>{canApprove ? "Approve" : "Request"}</div>;
}
```

### 4. **Check User Role**

```tsx
import { useHasRole } from "@/hooks";

export function AdminPanel() {
  const isAdmin = useHasRole("admin");
  const isManager = useHasRole(["fleet_manager", "admin"]);

  if (!isAdmin) return null;

  return <div>Admin Controls</div>;
}
```

### 5. **Advanced Access Control**

```tsx
import { useCanAccess } from "@/hooks";

export function ApprovalButton() {
  const canAccess = useCanAccess({
    require: { permissions: ["finance:approve"] },
    requireAny: ["finance:create", "finance:export"],
  });

  return canAccess ? <button>Approve</button> : null;
}
```

## Permission Reference

### Vehicle Permissions

- `vehicles:read` - View vehicles
- `vehicles:create` - Add new vehicles
- `vehicles:update` - Edit vehicle details
- `vehicles:delete` - Remove vehicles

### Driver Permissions

- `drivers:read` - View driver info
- `drivers:create` - Add new drivers
- `drivers:update` - Edit driver info
- `drivers:suspend` - Block driver account
- `drivers:delete` - Remove driver record

### Trip Permissions

- `trips:read` - View trips
- `trips:create` - Create new trips
- `trips:update` - Edit trip details
- `trips:delete` - Cancel trips
- `trips:assign` - Assign drivers to trips

### Maintenance Permissions

- `maintenance:read` - View maintenance records
- `maintenance:create` - Log maintenance
- `maintenance:update` - Edit maintenance record

### Finance Permissions

- `finance:read` - View financial data
- `finance:create` - Record expenses
- `finance:export` - Export financial reports
- `finance:approve` - Approve finance requests

### Other Permissions

- `safety:read`, `safety:create`, `safety:update` - Safety records
- `analytics:read` - View dashboards
- `users:read`, `users:create`, `users:update`, `users:delete` - User management
- `roles:assign` - Manage user roles

## Login & Registration API

### Login Endpoint

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@fleetflow.com",
  "password": "Admin@123"
}

Response:
{
  "success": true,
  "user": {
    "id": "usr_001",
    "email": "admin@fleetflow.com",
    "name": "System Admin",
    "role": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Register Endpoint

```
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Dispatcher",
  "username": "johndispatches",
  "email": "john@company.com",
  "password": "SecurePass123",
  "role": "dispatcher"
}

Response: Same as login (auto-login)
```

### Logout Endpoint

```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logged out successfully."
}
```

## Sidebar Menu - Role-Based Visibility

The sidebar automatically filters menu items based on user permissions:

- **Dashboard**: Always visible
- **Vehicle Registry**: Requires `vehicles:read`
- **Trip Dispatcher**: Requires `trips:read`
- **Maintenance**: Requires `maintenance:read`
- **Trip & Expense**: Requires `finance:read`
- **Performance**: Requires `analytics:read`
- **Analytics**: Requires `analytics:read`
- **Settings**: Requires `users:read`

## Middleware Protection

All routes are protected by middleware at `/src/middleware.ts`:

1. **Public routes** (anyone can access):
   - `/auth`
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/refresh`

2. **Protected routes** (requires authentication):
   - `/dashboard/*` - All dashboard pages
   - `/api/*` - All API endpoints except auth

3. **Redirect logic**:
   - Unauthenticated users trying to access `/dashboard` → redirected to `/auth`
   - Authenticated users trying to access `/auth` → redirected to `/dashboard`

## Token Management

### Access Token

- **Lifetime**: 8 hours
- **Storage**: httpOnly cookie (secure)
- **Purpose**: API authentication

### Refresh Token

- **Lifetime**: 7 days
- **Storage**: httpOnly cookie (secure, restricted path)
- **Purpose**: Getting new access tokens

### Client-Side Token Usage

The `accessToken` is also returned in the response body for manual `Authorization` header usage:

```javascript
const response = await fetch("/api/some-endpoint", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

## Testing Different Roles

### Quick Test Steps:

1. Open browser DevTools (F12)
2. Go to Login page
3. Each role has a demo credential shown
4. Log in and verify:
   - User name shown in header
   - User role displayed (e.g., "Administrator", "Fleet Manager")
   - Only authorized menu items are visible
   - Feature buttons only appear for authorized users

### Example Test Scenario:

```
1. Login as Fleet Manager
   - Can see: Vehicles, Trips, Maintenance, Analytics
   - Cannot see: Settings (requires admin)

2. Login as Dispatcher
   - Can see: Dashboard, Trips
   - Cannot manage vehicles or expenses

3. Login as Finance
   - Can see: Trip & Expense, Analytics
   - Cannot create trips or manage vehicles
```

## Common Patterns

### Conditional Rendering

```tsx
// Hide/show component based on permission
{
  useHasPermission("vehicles:update") && <EditButton />;
}
```

### Disable Button for Unprivileged Users

```tsx
<Button disabled={!useHasPermission("finance:approve")}>Approve Budget</Button>
```

### Show Role-Specific Content

```tsx
<div>
  {useHasRole("admin") && <AdminSettings />}
  {useHasRole("dispatcher") && <DispatcherTools />}
</div>
```

### Redirect Unprivileged Users

```tsx
import { useRouter } from "next/navigation";
import { useHasRole } from "@/hooks";

export function AdminPage() {
  const router = useRouter();
  const isAdmin = useHasRole("admin");

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;
  return <AdminPanel />;
}
```

## Setting Up Production Database

### To replace mock users with real database:

1. **Update login endpoint** (`/api/auth/login/route.ts`):

   ```typescript
   // Replace MOCK_USERS with database query
   const user = await db.users.findUnique({
     where: { email: email.toLowerCase() },
   });
   ```

2. **Update register endpoint** (`/api/auth/register/route.ts`):

   ```typescript
   // Replace registeredUsers array with database insert
   await db.users.create({
     data: { email, name, username, passwordHash, role },
   });
   ```

3. **Store secrets in `.env.local`**:
   ```
   JWT_ACCESS_SECRET=your_random_secret_key_here
   JWT_REFRESH_SECRET=your_another_random_secret_key
   ```

## Troubleshooting

### Can't Log In?

- Check email/password are correct (case-sensitive)
- Verify user exists in database
- Check JWT secrets in `.env.local`
- Review browser console for errors

### Can't See Authorized Features?

- Verify user role by checking header profile
- Check browser DevTools > Application > Cookies for `accessToken`
- Verify permissions in `/lib/roles.ts`
- Check sidebar - unauthorized menu items will be hidden

### Token Expired?

- Auto-refresh via `/api/auth/refresh` (behind the scenes)
- If still stuck, logout and login again
- Check token expiry in JWT payload

### Permission Check Not Working?

1. Ensure using correct permission string
2. Verify permission exists in `/types/rbac.ts` under `Permission` type
3. Check role has permission in `/lib/roles.ts`
4. Restart dev server if changes not reflected

## Summary

✅ **What You Can Do Now:**

- Log in as different user profiles
- See role-specific dashboards & features
- Use role-based permission checks in components
- Automatically filter sidebar by permissions
- Protect API routes with middleware
- Token auto-refresh for better UX

✅ **How Auth Works:**

- JWT tokens stored in httpOnly cookies
- AuthContext manages global user state
- Custom hooks provide permission checking
- Middleware enforces route protection
- Role-based sidebar auto-filters

✅ **Test It:**

- Connect to any demo account
- Observe different features for each role
- Try accessing restricted features (they'll be hidden)
- Check header to confirm logged-in user/role
