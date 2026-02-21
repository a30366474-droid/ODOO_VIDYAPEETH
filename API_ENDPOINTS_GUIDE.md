# 📡 API Endpoints Guide - Full Fleet Flow Integration

## Overview

यह guide सभी API endpoints के लिए है जो FleetFlow में Supabase के साथ काम करते हैं।

---

## 🔐 Authentication Endpoints

### ✅ Already Implemented

#### 1. POST `/api/auth/login`

**Description:** User login with email & password

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fleetflow.com",
    "password": "Admin@123"
  }'
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@fleetflow.com",
    "name": "System Administrator",
    "role": "admin"
  },
  "accessToken": "jwt-token"
}
```

#### 2. POST `/api/auth/register`

**Description:** User registration with role selection

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@fleetflow.com",
    "password": "SecurePass123",
    "role": "fleet_manager"
  }'
```

#### 3. POST `/api/auth/logout`

**Description:** Logout and clear tokens

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

---

## 🚗 Vehicles Endpoints (To Be Implemented)

### GET `/api/vehicles`

**Description:** Get all vehicles (with pagination & filters)

**Query Parameters:**

```
?status=active&type=truck&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "plate_number": "DL-01-A-1234",
      "make": "Mahindra",
      "model": "Bolero",
      "year": 2022,
      "vehicle_type": "truck",
      "status": "active",
      "current_mileage": 45000,
      "insurance_expiry": "2025-12-31",
      "registration_expiry": "2025-06-30"
    }
  ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 10
  }
}
```

### GET `/api/vehicles/[id]`

**Description:** Get single vehicle details

### POST `/api/vehicles`

**Description:** Create new vehicle (Fleet Manager only)

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [token]" \
  -d '{
    "plate_number": "DL-05-E-7890",
    "make": "Tata",
    "model": "Nexon",
    "year": 2023,
    "vehicle_type": "car",
    "capacity": 5,
    "fuel_type": "diesel",
    "insurance_expiry": "2025-12-31",
    "registration_expiry": "2025-06-30",
    "cost": 850000
  }'
```

### PUT `/api/vehicles/[id]`

**Description:** Update vehicle details

### DELETE `/api/vehicles/[id]`

**Description:** Archive/delete vehicle (Admin only)

---

## 👨‍💼 Drivers Endpoints

### GET `/api/drivers`

**Description:** Get all drivers with stats

**Query Parameters:**

```
?status=available&rating=4.5&page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user": {
        "email": "driver@fleetflow.com",
        "full_name": "Driver Name"
      },
      "license_number": "DL-2024-12345",
      "license_expiry": "2027-06-30",
      "rating": 4.8,
      "total_trips": 145,
      "total_distance": 52340,
      "status": "available"
    }
  ]
}
```

### GET `/api/drivers/[id]`

**Description:** Get driver profile with performance data

### POST `/api/drivers`

**Description:** Create driver profile (when user registers as driver)

### PUT `/api/drivers/[id]`

**Description:** Update driver information

### PATCH `/api/drivers/[id]/status`

**Description:** Update driver status (available/on_trip/off_duty)

```bash
curl -X PATCH http://localhost:3000/api/drivers/uuid/status \
  -H "Content-Type: application/json" \
  -d '{"status": "on_trip"}'
```

---

## 🚌 Trips Endpoints

### GET `/api/trips`

**Description:** Get all trips with filters

**Query Parameters:**

```
?status=scheduled&vehicle_id=uuid&driver_id=uuid
&start_date=2024-02-01&end_date=2024-02-28&page=1&limit=20
```

### GET `/api/trips/[id]`

**Description:** Get trip details with GPS route

### POST `/api/trips`

**Description:** Create new trip (Dispatcher only)

```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [token]" \
  -d '{
    "vehicle_id": "uuid",
    "driver_id": "uuid",
    "origin_location": "Delhi Main Hub",
    "destination_location": "Bangalore Warehouse",
    "origin_latitude": 28.7041,
    "origin_longitude": 77.1025,
    "destination_latitude": 12.9716,
    "destination_longitude": 77.5946,
    "scheduled_start": "2024-02-22T09:00:00Z",
    "estimated_duration_minutes": 1440,
    "cargo_description": "Electronics",
    "cargo_weight": 500
  }'
```

### PATCH `/api/trips/[id]/status`

**Description:** Update trip status

```bash
curl -X PATCH http://localhost:3000/api/trips/uuid/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

### PATCH `/api/trips/[id]/complete`

**Description:** Mark trip as completed with final details

---

## 🔧 Maintenance Endpoints

### GET `/api/maintenance`

**Description:** Get maintenance records

**Query Parameters:**

```
?vehicle_id=uuid&status=scheduled&page=1
```

### POST `/api/maintenance`

**Description:** Create maintenance record

```bash
curl -X POST http://localhost:3000/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "uuid",
    "service_type": "regular",
    "description": "Oil change and filter replacement",
    "scheduled_date": "2024-03-01",
    "cost": 2500,
    "notes": "Due for 50000 km service"
  }'
```

### PATCH `/api/maintenance/[id]/status`

**Description:** Update maintenance status

---

## 💰 Expenses Endpoints

### GET `/api/expenses`

**Description:** Get expense records with approved/pending filtering

**Query Parameters:**

```
?vehicle_id=uuid&status=approved&date_from=2024-02-01&date_to=2024-02-28
```

### POST `/api/expenses`

**Description:** Log new expense

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "uuid",
    "trip_id": "uuid",
    "expense_type": "fuel",
    "amount": 3500,
    "currency": "INR",
    "description": "Diesel refuel",
    "date": "2024-02-21"
  }'
```

### PATCH `/api/expenses/[id]/approve`

**Description:** Approve expense (Finance only)

### DELETE `/api/expenses/[id]`

**Description:** Delete expense (if pending)

---

## ⚠️ Safety Incidents Endpoints

### GET `/api/safety/incidents`

**Description:** Get safety incidents

**Query Parameters:**

```
?severity=high&status=open&vehicle_id=uuid
```

### POST `/api/safety/incidents`

**Description:** Report safety incident

```bash
curl -X POST http://localhost:3000/api/safety/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "uuid",
    "driver_id": "uuid",
    "incident_type": "accident",
    "severity": "high",
    "location": "Delhi-Gurugram Highway",
    "description": "Minor fender bender at toll plaza",
    "date_time": "2024-02-21T15:30:00Z",
    "injuries": false,
    "vehicle_damage": true
  }'
```

### PATCH `/api/safety/incidents/[id]`

**Description:** Update incident investigation status

---

## 📊 Performance Metrics Endpoints

### GET `/api/performance/metrics`

**Description:** Get driver/vehicle performance metrics

**Query Parameters:**

```
?driver_id=uuid&vehicle_id=uuid&date_from=2024-02-01&date_to=2024-02-28
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "driver_id": "uuid",
      "metric_date": "2024-02-21",
      "average_speed_kmh": 65.5,
      "harsh_braking_count": 2,
      "harsh_acceleration_count": 1,
      "fuel_efficiency_kmpl": 8.5,
      "safety_score": 4.2,
      "efficiency_score": 4.5,
      "overall_score": 4.35
    }
  ]
}
```

### GET `/api/performance/analytics`

**Description:** Get summary analytics for dashboard

---

## 📬 Notifications Endpoints

### GET `/api/notifications`

**Description:** Get user notifications

**Query Parameters:**

```
?is_read=false&limit=20
```

### PATCH `/api/notifications/[id]/read`

**Description:** Mark notification as read

### PATCH `/api/notifications/read-all`

**Description:** Mark all notifications as read

---

## 👥 Users Endpoints

### GET `/api/users`

**Description:** Get all users (Admin only)

### GET `/api/users/me`

**Description:** Get current user profile

### PUT `/api/users/me`

**Description:** Update current user profile

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated Name",
    "phone": "+91-9876543210",
    "avatar_url": "https://..."
  }'
```

### PATCH `/api/users/[id]/role`

**Description:** Change user role (Admin only)

### PATCH `/api/users/[id]/status`

**Description:** Activate/suspend user (Admin only)

---

## 📈 Analytics & Reporting Endpoints

### GET `/api/analytics/dashboard`

**Description:** Get dashboard KPIs

**Response:**

```json
{
  "success": true,
  "data": {
    "total_vehicles": 24,
    "active_trips": 8,
    "total_drivers": 35,
    "fuel_spent_today": 12450,
    "incidents_this_month": 3,
    "avg_driver_rating": 4.67
  }
}
```

### GET `/api/analytics/trips-summary`

**Description:** Trip analytics by date range

### GET `/api/analytics/vehicle-performance`

**Description:** Vehicle utilization & performance metrics

### GET `/api/analytics/financial-report`

**Description:** Financial summary (Finance only)

---

## 🔍 Search & Filter Endpoints

### GET `/api/search`

**Description:** Global search across entities

**Query Parameters:**

```
?q=DL-01&type=vehicle
```

---

## Implementation Checklist

**Phase 1 - Core (Priority 1):**

- [ ] `/api/vehicles` - GET all, POST, PUT, DELETE
- [ ] `/api/drivers` - GET all, GET by id
- [ ] `/api/trips` - GET all, POST, PATCH status
- [ ] `/api/auth/*` - Already done ✅

**Phase 2 - Operations (Priority 2):**

- [ ] `/api/maintenance` - GET, POST, PATCH
- [ ] `/api/expenses` - GET, POST, PATCH approve
- [ ] `/api/safety/incidents` - GET, POST

**Phase 3 - Analytics (Priority 3):**

- [ ] `/api/performance/metrics`
- [ ] `/api/analytics/*`

---

## Error Response Format

All endpoints should return consistent error responses:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Rate Limiting

Implement rate limiting:

- **Unauthenticated:** 10 requests/minute
- **Authenticated:** 100 requests/minute
- **Admin:** Unlimited

---

## Documentation

For each endpoint, provide:

1. ✅ Description
2. ✅ Request method & path
3. ✅ Required headers
4. ✅ Request body schema
5. ✅ Response schema
6. ✅ Error cases
7. ✅ Example curl command

---

**Ready to implement!** 🚀
