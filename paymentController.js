# Dance Platform Backend

A complete backend API for a dance class enrollment platform built with Express.js and MongoDB.

## Features

- **User Authentication**: Register and login as user or admin
- **Role-Based Access Control**: Separate permissions for users and admins
- **Class Management**: Admins can create, update, delete dance classes
- **Class Enrollment**: Users can view and enroll in available classes
- **Schedule Management**: Classes have specific days and times
- **Capacity Control**: Classes have maximum capacity limits

## Tech Stack

- **Node.js** & **Express.js** - Backend framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dance-platform
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // or "admin"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (requires auth)

### Admin Routes (`/api/admin`)
*All routes require admin authentication*

- `POST /api/admin/classes` - Create new class
  ```json
  {
    "title": "Hip Hop Fundamentals",
    "description": "Learn the basics of hip hop dance",
    "instructor": "Jane Smith",
    "danceStyle": "Hip Hop",
    "level": "Beginner",
    "schedule": {
      "dayOfWeek": "Monday",
      "startTime": "18:00",
      "endTime": "19:30"
    },
    "duration": 90,
    "maxCapacity": 20,
    "price": 25
  }
  ```

- `GET /api/admin/classes` - Get all classes
- `GET /api/admin/classes/:id` - Get single class
- `PUT /api/admin/classes/:id` - Update class
- `DELETE /api/admin/classes/:id` - Delete class
- `GET /api/admin/users` - Get all users

### Class Routes (`/api/classes`)
*All routes require authentication*

- `GET /api/classes` - Get all active classes
  - Query params: `?danceStyle=Hip Hop&level=Beginner&dayOfWeek=Monday`
  
- `GET /api/classes/:id` - Get single class details

- `POST /api/classes/:id/enroll` - Enroll in a class

- `DELETE /api/classes/:id/unenroll` - Unenroll from a class

- `GET /api/classes/my/enrolled` - Get user's enrolled classes

### Health Check

- `GET /api/health` - Check API status

## Models

### User
- name, email, password
- role: 'user' or 'admin'
- enrolledClasses: array of class references

### Class
- title, description, instructor
- danceStyle: Ballet, Hip Hop, Contemporary, etc.
- level: Beginner, Intermediate, Advanced
- schedule: dayOfWeek, startTime, endTime
- duration, maxCapacity, price
- enrolledStudents: array of user references

### Enrollment
- user, class references
- enrolledAt timestamp
- status: active, cancelled, completed
- attendance tracking

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## License

ISC
