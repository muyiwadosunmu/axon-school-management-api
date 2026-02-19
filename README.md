# School Management System API

A comprehensive RESTful API for managing schools, classrooms, and students with Role-Based Access Control (RBAC). Built with Node.js, Express, and MongoDB.

## Features

- **Multi-Tenancy**: Support for multiple schools with isolated data.
- **RBAC**: Separated permissions for Superadmins and School Administrators.
- **Authentication**: JWT-based secure authentication.
- **Entity Management**: Full CRUD for Schools, Classrooms, and Students.
- **Validation**: Strict input validation and business logic enforcement (e.g., classroom capacity).

## Architecture

- **Backend**: Node.js / Express
- **Database**: MongoDB (Mongoose ODM)
- **Architecture Pattern**: Manager-based architecture (Services) with Cortex pattern.

## Prerequisites

- Node.js (v22)
- MongoDB (Local or Atlas)

## Installation

1. **Clone the repository** (if not already):
   ```bash
   git clone <repo-url>
   cd axion
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Ensure your `.env` file has the following (or use the provided defaults for local dev):
   ```env
   # .env
   MONGO_URI=mongodb://localhost:27017/school_system
   LONG_TOKEN_SECRET=your_long_token_secret
   SHORT_TOKEN_SECRET=your_short_token_secret
   PORT=5111
   ```

## Running the Application

1. **Start the Server**:
   ```bash
   npm start
   ```
   Server will start on `http://localhost:5111` (or your configured port).

2. **Run Verification Tests**:
   A verification script is included to test the entire flow (Register -> Create School -> Create Class -> Create Student).
   ```bash
   node tests/verify.js
   ```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint usage.

## Technical Decisions & Assumptions

- **School ID for School Admins**: When creating a School Admin user, a `schoolId` is required to associate them with a specific school.
- **Classroom Capacity**: Creation of students checks against the capacity of the target classroom.
- **RBAC Enforcement**: Middleware enforces role checks. School Admins can only access data related to their school.

## Submission Details

- **Database Design**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#database-schema)
- **Deployment**: The application is stateless and can be deployed to any Node.js compatible host (Render, Heroku, AWS, etc.).

