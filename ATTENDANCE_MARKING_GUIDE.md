# Attendance Tracking Feature - Implementation Guide

## Overview
Instructors can now mark student attendance for their classes with a dedicated UI.

## Backend Setup

### New Model: Attendance
- **Location:** `/backend/models/Attendance.js`
- **Fields:**
  - `classId`: Reference to the class
  - `studentId`: Reference to the student
  - `date`: Date of attendance
  - `status`: 'present' | 'absent' | 'excused'
  - `notes`: Optional notes
  - `markedBy`: Instructor who marked attendance
  - `markedAt`: Timestamp when marked

### New Routes: Attendance
- **Location:** `/backend/routes/attendance.js`

#### POST `/api/attendance/mark`
Mark attendance for a student
```json
{
  "classId": "class_id",
  "studentId": "student_id",
  "status": "present|absent|excused",
  "notes": "optional notes"
}
```
**Auth:** Required (Instructor only)

#### GET `/api/attendance/class/:classId`
Get attendance records for a class
**Query:** `?date=YYYY-MM-DD` (optional)
**Auth:** Required (Instructor only)

#### GET `/api/attendance/class/:classId/today`
Get today's attendance with all enrolled students
**Auth:** Required (Instructor only)

#### GET `/api/attendance/student/:studentId`
Get attendance history for a student
**Auth:** Required

## Frontend Components

### 1. AttendanceMarker Component
- **Location:** `/frontend/src/components/AttendanceMarker.jsx`
- **Props:**
  - `classId`: Class ID
  - `classTitle`: Class name for display
  - `onClose`: Callback when modal closes
- **Features:**
  - Shows all enrolled students
  - Dropdown to select status (Present/Absent/Excused)
  - Text input for optional notes
  - Individual save button per student
  - "Save All" button to save all records at once
  - Displays today's date

### 2. AdminDashboard Update
- Added "Attendance" button to each class
- Opens AttendanceMarker modal
- Color: Gold (#F59E0B)

## How to Use (Instructor)

1. **Login** as an instructor
2. Go to **Dashboard**
3. Click the **✓ Attendance** button next to any class
4. The attendance modal opens showing:
   - All enrolled students
   - Status selector (Present/Absent/Excused)
   - Notes field
5. Select status for each student
6. Add notes if needed (e.g., "Left early", "Medical leave")
7. Click **Save** to save individual records or **Save All** to save all
8. Records are saved with today's date

## API Endpoints Summary

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | /api/attendance/mark | Yes | Mark attendance |
| GET | /api/attendance/class/:classId | Yes | Get class attendance |
| GET | /api/attendance/class/:classId/today | Yes | Get today's attendance |
| GET | /api/attendance/student/:studentId | Yes | Get student attendance |

## Authorization Rules

- **Instructors** can only view/mark attendance for classes they created
- **Students** can view their own attendance history
- All attendance endpoints require authentication

## Data Validation

- Invalid status values are rejected
- Only enrolled students can have attendance marked
- Instructors can only access their own classes
- Date validation ensures proper attendance records

## Future Enhancements

- Export attendance to CSV/PDF
- Attendance reports and statistics
- Bulk upload attendance
- Email notifications for absences
- Attendance history per student
- Class-wise attendance analytics
