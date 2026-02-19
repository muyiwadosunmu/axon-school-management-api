# API Documentation

## Base URL
`http://localhost:5111/api`

## Authentication & Authorization

### headers
Most endpoints require a `token` header.
- `token`: The JWT token received upon login/registration.

### 1. Create User (Superadmin / School Admin)
**POST** `/user/createUser`

**Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "SUPERADMIN" // or "SCHOOL_ADMIN"
  "schoolId": "..." // Required if role is SCHOOL_ADMIN
}
```

### 2. Login
**POST** `/user/login`

**Body:**
```json
{
  "username": "admin",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "user": { ... },
    "longToken": "eyJhbG..."
  }
}
```

---

## School Management (Superadmin Only)

### 3. Create School
**POST** `/school/createSchool`

**Body:**
```json
{
  "name": "Springfield High",
  "address": "123 Evergreen Terrace",
  "phone": "555-0000",
  "email": "contact@springfield.edu"
}
```

### 4. Get Schools
**POST** `/school/getSchools`

**Body:**
```json
{}
```

### 5. Update School
**POST** `/school/updateSchool`

**Body:**
```json
{
  "id": "school_id_here",
  "name": "New Name"
}
```

### 6. Delete School
**POST** `/school/deleteSchool`

**Body:**
```json
{
  "id": "school_id_here"
}
```

---

## Classroom Management (School Admin / Superadmin)

### 7. Create Classroom
**POST** `/classroom/createClassroom`

**Body:**
```json
{
  "name": "Math 101",
  "capacity": 30,
  "resources": ["Projector", "Whiteboard"]
}
```
*Note: Automatically associated with the School Admin's school.*

### 8. Get Classrooms
**POST** `/classroom/getClassrooms`

**Body:**
```json
{
  "schoolId": "..." // Optional for Superadmin, inferred for School Admin
}
```

---

## Student Management (School Admin / Superadmin)

### 9. Create Student
**POST** `/student/createStudent`

**Body:**
```json
{
  "name": "Bart Simpson",
  "age": 10,
  "grade": "4th",
  "classroomId": "classroom_id_here" // Optional, but recommended
}
```

### 10. Transfer Student
**POST** `/student/transferStudent`

**Body:**
```json
{
  "id": "student_id",
  "classroomId": "new_classroom_id"
}
```

---

## Database Schema

### User
- `username`: String (Unique)
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum [SUPERADMIN, SCHOOL_ADMIN]
- `schoolId`: ObjectId (Ref: School)

### School
- `name`: String (Unique)
- `address`: String
- `phone`: String
- `email`: String
- `website`: String

### Classroom
- `name`: String
- `capacity`: Number
- `resources`: Array[String]
- `schoolId`: ObjectId (Ref: School)

### Student
- `name`: String
- `age`: Number
- `grade`: String
- `schoolId`: ObjectId (Ref: School)
- `classroomId`: ObjectId (Ref: Classroom)
