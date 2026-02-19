# API Documentation

## Base URLs
- **Local:** `http://localhost:5111/api`
- **Hosted:** `https://axon-school-management-api.onrender.com/api`

## Request Pattern
All API requests follow this structure:
- **Method:** `POST`
- **Path:** `/api/{moduleName}/{functionName}`

## Authentication & Authorization

### Headers
Most endpoints require the following headers:
- `Content-Type: application/json`
- `token`: The JWT `longToken` received upon login/registration.

---

### 1. Create User (Superadmin / School Admin)
**POST** `/user/createUser`

**Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "SUPERADMIN",
  "schoolId": "..." 
}
```
*Note: `schoolId` is required if role is `SCHOOL_ADMIN`.*

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
  "schoolId": "..." 
}
```
*Note: `schoolId` is Optional for Superadmin, inferred for School Admin.*

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
  "classroomId": "classroom_id_here" 
}
```
*Note: `classroomId` is optional, but recommended.*

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

## Testing Tools

### 1. VS Code REST Client (Recommended)
We have included a file `api_tests.http` that allows you to run API requests directly from VS Code.
1.  Install the **REST Client** extension (`humao.rest-client`).
2.  Open `api_tests.http`.
3.  Click **"Send Request"** above any endpoint.
*Note: Variables like tokens and IDs are automatically captured and passed between requests.*

### 2. Postman
1.  Set **Method** to `POST`.
2.  Use the **Hosted** or **Local** Base URL.
3.  Set Header `token` to your JWT.

---

## Database Schema

### User
- `username`: String (Unique, 3-20 chars)
- `email`: String (Unique, Email format)
- `password`: String (Min 8 chars)
- `role`: Enum [`SUPERADMIN`, `SCHOOL_ADMIN`]
- `schoolId`: ObjectId (Ref: School)

### School
- `name`: String (Unique, 3-300 chars)
- `address`: String (3-250 chars)
- `phone`: String (7-15 chars)
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
