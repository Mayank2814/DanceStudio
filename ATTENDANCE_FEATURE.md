# 🎭 DanceStudio API Routes & Demo Payloads

Base URL: `http://localhost:5001`

---

## 🔐 Authentication Routes (`/api/auth`)

### 1. Register User
**POST** `/api/auth/register`  
**Access:** Public

**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Role Options:** `"user"` or `"admin"`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9c8f0b1e2c3d4e5f6a7b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User
**POST** `/api/auth/login`  
**Access:** Public

**Payload:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Demo Credentials:**
- **User:** `user@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9c8f0b1e2c3d4e5f6a7b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get Current User
**GET** `/api/auth/me`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9c8f0b1e2c3d4e5f6a7b",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "enrolledClasses": [...]
  }
}
```

---

## 📚 Classes Routes (`/api/classes`)

### 4. Get All Classes
**GET** `/api/classes`  
**Access:** Public

**Query Parameters (Optional):**
- `danceStyle`: Ballet, Hip Hop, Contemporary, Jazz, Salsa, Ballroom, Breakdance
- `level`: Beginner, Intermediate, Advanced
- `dayOfWeek`: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

**Example:** `/api/classes?danceStyle=Ballet&level=Beginner`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "677a9c8f0b1e2c3d4e5f6a7c",
      "title": "Ballet Basics",
      "description": "Learn the fundamentals of ballet",
      "instructor": "Jane Smith",
      "style": "Ballet",
      "level": "Beginner",
      "schedule": "Mon, Wed, Fri - 6:00 PM",
      "duration": 60,
      "price": 2999,
      "capacity": 20,
      "enrolledStudents": [],
      "createdBy": {...}
    }
  ]
}
```

---

### 5. Get Single Class
**GET** `/api/classes/:id`  
**Access:** Public

**Example:** `/api/classes/677a9c8f0b1e2c3d4e5f6a7c`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9c8f0b1e2c3d4e5f6a7c",
    "title": "Ballet Basics",
    "description": "Learn the fundamentals of ballet",
    "instructor": "Jane Smith",
    "style": "Ballet",
    "level": "Beginner",
    "schedule": "Mon, Wed, Fri - 6:00 PM",
    "duration": 60,
    "price": 2999,
    "capacity": 20,
    "enrolledStudents": []
  }
}
```

---

### 6. Get My Enrolled Classes
**GET** `/api/classes/my-enrolled`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "677a9c8f0b1e2c3d4e5f6a7c",
      "title": "Ballet Basics",
      "instructor": "Jane Smith",
      ...
    }
  ]
}
```

---

### 7. Enroll in Class
**POST** `/api/classes/:id/enroll`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Example:** `/api/classes/677a9c8f0b1e2c3d4e5f6a7c/enroll`

**No payload required**

**Response:**
```json
{
  "success": true,
  "message": "Successfully enrolled in class",
  "data": {
    "_id": "677a9d1f0b1e2c3d4e5f6a7d",
    "user": "677a9c8f0b1e2c3d4e5f6a7b",
    "class": "677a9c8f0b1e2c3d4e5f6a7c",
    "status": "active"
  }
}
```

---

### 8. Unenroll from Class
**DELETE** `/api/classes/:id/unenroll`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Example:** `/api/classes/677a9c8f0b1e2c3d4e5f6a7c/unenroll`

**Response:**
```json
{
  "success": true,
  "message": "Successfully unenrolled from class"
}
```

---

## 👨‍💼 Admin Routes (`/api/admin`)

**All admin routes require:**
- **Headers:** `Authorization: Bearer <token>`
- **Role:** admin

---

### 9. Create Class (Admin)
**POST** `/api/admin/classes`  
**Access:** Private/Admin

**Payload:**
```json
{
  "title": "Advanced Hip Hop Choreography",
  "description": "Master complex hip hop moves and choreography",
  "instructor": "Mike Johnson",
  "style": "Hip Hop",
  "level": "Advanced",
  "schedule": "Tue, Thu - 7:00 PM",
  "duration": 90,
  "price": 4999,
  "capacity": 15
}
```

**Field Requirements:**
- `title` (string, required)
- `description` (string, required)
- `instructor` (string, required)
- `style` (enum): Ballet, Hip Hop, Contemporary, Jazz, Salsa, Ballroom, Breakdance, Other
- `level` (enum): Beginner, Intermediate, Advanced
- `schedule` (string, required)
- `duration` (number, minutes)
- `price` (number, in paise - ₹29.99 = 2999)
- `capacity` (number, max students)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9d5f0b1e2c3d4e5f6a7e",
    "title": "Advanced Hip Hop Choreography",
    "description": "Master complex hip hop moves and choreography",
    "instructor": "Mike Johnson",
    "style": "Hip Hop",
    "level": "Advanced",
    ...
  }
}
```

---

### 10. Get All Classes (Admin View)
**GET** `/api/admin/classes`  
**Access:** Private/Admin

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "677a9c8f0b1e2c3d4e5f6a7c",
      "title": "Ballet Basics",
      "enrolledStudents": [...],
      "createdBy": {...},
      ...
    }
  ]
}
```

---

### 11. Get Single Class (Admin)
**GET** `/api/admin/classes/:id`  
**Access:** Private/Admin

**Example:** `/api/admin/classes/677a9c8f0b1e2c3d4e5f6a7c`

---

### 12. Update Class
**PUT** `/api/admin/classes/:id`  
**Access:** Private/Admin

**Payload (all fields optional):**
```json
{
  "title": "Ballet Fundamentals - Updated",
  "price": 3499,
  "capacity": 25,
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "677a9c8f0b1e2c3d4e5f6a7c",
    "title": "Ballet Fundamentals - Updated",
    "price": 3499,
    ...
  }
}
```

---

### 13. Delete Class
**DELETE** `/api/admin/classes/:id`  
**Access:** Private/Admin

**Example:** `/api/admin/classes/677a9c8f0b1e2c3d4e5f6a7c`

**Response:**
```json
{
  "success": true,
  "message": "Class deleted successfully"
}
```

---

### 14. Get All Users (Admin)
**GET** `/api/admin/users`  
**Access:** Private/Admin

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "_id": "677a9c8f0b1e2c3d4e5f6a7b",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "enrolledClasses": [...]
    }
  ]
}
```

---

## 💳 Payment Routes (`/api/payment`)

**All payment routes require authentication**

---

### 15. Create Razorpay Order
**POST** `/api/payment/create-order`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Payload:**
```json
{
  "amount": 2999,
  "classId": "677a9c8f0b1e2c3d4e5f6a7c",
  "className": "Ballet Basics"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_MNoPqRsTuVwXyZ",
    "amount": 299900,
    "currency": "INR",
    "keyId": "rzp_test_XXXXXXXXXXXXX"
  }
}
```

---

### 16. Verify Payment
**POST** `/api/payment/verify`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Payload:**
```json
{
  "razorpay_order_id": "order_MNoPqRsTuVwXyZ",
  "razorpay_payment_id": "pay_MNoPqRsTuVwXyZ",
  "razorpay_signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "classId": "677a9c8f0b1e2c3d4e5f6a7c"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "orderId": "order_MNoPqRsTuVwXyZ",
    "paymentId": "pay_MNoPqRsTuVwXyZ"
  }
}
```

---

### 17. Get Payment Details
**GET** `/api/payment/:paymentId`  
**Access:** Private  
**Headers:** `Authorization: Bearer <token>`

**Example:** `/api/payment/pay_MNoPqRsTuVwXyZ`

---

## 🧪 Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Classes (No Auth Required)
```bash
curl http://localhost:5001/api/classes
```

### Get Current User (With Auth)
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Enroll in Class (With Auth)
```bash
curl -X POST http://localhost:5001/api/classes/CLASS_ID_HERE/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Class (Admin Only)
```bash
curl -X POST http://localhost:5001/api/admin/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{
    "title": "Salsa Night",
    "description": "Hot salsa moves for beginners",
    "instructor": "Maria Garcia",
    "style": "Salsa",
    "level": "Beginner",
    "schedule": "Fri - 8:00 PM",
    "duration": 60,
    "price": 1999,
    "capacity": 30
  }'
```

---

## 🔑 Response Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request / Validation Error
- **401** - Unauthorized (No token or invalid token)
- **403** - Forbidden (Not admin)
- **404** - Not Found
- **500** - Server Error

---

## 📝 Notes

1. **Authentication Token:** Save the `token` from login/register response and include it in the `Authorization` header as `Bearer <token>` for protected routes.

2. **Price Format:** All prices are in **paise** (Indian currency). ₹29.99 = 2999 paise.

3. **Admin Role:** Only users with `role: "admin"` can access `/api/admin/*` routes.

4. **Class Status:** By default, classes are created with `isActive: true`. Set to `false` to deactivate.

5. **Razorpay Test Mode:** Use test credentials from your Razorpay dashboard for testing payments.

---

**Backend Server:** http://localhost:5001  
**Frontend App:** http://localhost:5173
