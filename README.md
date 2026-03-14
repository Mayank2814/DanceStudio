# 🎓 Class Management System – Attendance Tracking

A **full-stack class management platform** that allows instructors to manage classes and efficiently mark student attendance.
The system provides a **dedicated class management page** where instructors can view enrolled students, mark attendance, add notes, and track attendance records.

---

# 🚀 Features

## 📚 Class Management Page

* Route: `/class/:id/manage`
* Protected route (only accessible by instructors)
* Accessible through the **👁️ View** button in the dashboard

### Class Header Information

Displays essential class details:

* Class name and emoji
* Instructor name
* Schedule (Day & Time)
* Duration
* Class style and level
* Total number of students

---

# 👨‍🎓 Student Display

Students enrolled in the class are displayed in a **structured table format**.

| Name         | Email                                         | Status                 | Notes          | Action |
| ------------ | --------------------------------------------- | ---------------------- | -------------- | ------ |
| Student Name | [student@email.com](mailto:student@email.com) | Present/Absent/Excused | Optional Notes | Save   |

This allows instructors to quickly view and manage attendance.

---

# ✅ Attendance Marking

Instructors can mark attendance using the following status options:

* ✅ **Present** – Student attended the class
* ❌ **Absent** – Student did not attend
* ⚠️ **Excused** – Absence with valid reason

### Notes Field

Optional notes can be added for each student.

Examples:

* "Left early"
* "Medical leave"
* "Family emergency"

---

# 📅 Date Selector

Attendance can be recorded for any date.

Features:

* Defaults to **today’s date**
* Allows selecting **past or future dates**

---

# 💾 Save Options

## Individual Save

Each row contains a **Save button** to store attendance for a single student.

## Save All

A **Save All Attendance** button allows instructors to save attendance for the entire class simultaneously.

This is useful for quickly marking attendance for multiple students.

---

# 🧭 Page Layout

```
┌─────────────────────────────────────────────────┐
│ ← Back to Dashboard                             │
├─────────────────────────────────────────────────┤
│ Class Name                [Class Emoji]         │
│ Instructor | Schedule | Duration | Students    │
├─────────────────────────────────────────────────┤
│ [Mark Attendance]  [Attendance History]        │
├─────────────────────────────────────────────────┤
│ Date: [________]                                │
├─────────────────────────────────────────────────┤
│ Student Table                                   │
│ Name | Email | Status | Notes | Save           │
│                                              │
│                       [Save All Attendance]    │
└─────────────────────────────────────────────────┘
```

---

# ⚙️ How to Use

## Step 1 — Navigate to Class

1. Login as an instructor.
2. Go to the **Dashboard**.
3. Click the **👁️ View** button next to a class.

---

## Step 2 — Mark Attendance

1. Select the desired date.
2. Choose a **status** for each student.
3. Optionally add notes.

---

## Step 3 — Save Attendance

Two options are available:

* Save individual student attendance
* Save all attendance records at once

---

## Step 4 — Confirmation

After saving:

* A success message appears
* Attendance records are stored in the database with:

```
Student ID
Attendance Status
Notes
Date
Timestamp
Instructor ID
```

---

# 🔗 API Integration

The frontend communicates with backend APIs.

### Endpoints Used

**Get Class Details**

```
GET /api/classes/:id
```

**Get Today's Attendance**

```
GET /api/attendance/class/:classId/today
```

**Mark Attendance**

```
POST /api/attendance/mark
```

---

# 🎨 UI Color Scheme

| Status          | Color              |
| --------------- | ------------------ |
| Present         | `#10b981` (Green)  |
| Absent          | `#ef4444` (Red)    |
| Excused         | `#eab308` (Yellow) |
| Save Button     | `#EC4899` (Pink)   |
| Save All Button | `#F59E0B` (Gold)   |

---

# 📱 Responsive Design

The system is optimized for multiple devices.

**Desktop**

* Full table layout

**Tablet**

* Horizontal scrollable table

**Mobile**

* Compact and optimized layout

---

# 🔒 Security

* Protected routes with authentication
* Only instructors can access their classes
* Authorization checks prevent unauthorized access
* Secure API communication

---

# 🛠 Tech Stack

Frontend

* React
* JavaScript
* CSS

Backend

* Node.js
* Express.js

Database

* MongoDB

Authentication

* JWT

---

# 📊 Future Enhancements

Planned improvements include:

* Export attendance to **CSV / PDF**
* Attendance analytics dashboard
* Bulk attendance import
* Email notifications for absences
* Attendance trend visualization
* Student performance tracking

---

# 📷 Screenshots

Add screenshots here:

```
/screenshots/dashboard.png
/screenshots/manage-class.png
/screenshots/attendance-table.png
```

---

# 👨‍💻 Author

Developed by **Mayank Sagar**

---

# ⭐ Support

If you like this project, please give it a **star on GitHub** ⭐
