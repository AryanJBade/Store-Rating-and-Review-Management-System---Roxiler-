# Architecture

The application follows a layered architecture.

Frontend (React.js)
|
REST APIs
|
Backend (Express.js)
|
Controllers
|
Middleware
|
MySQL Database

### Layers

1. Frontend Layer

   * React Components
   * React Router
   * Axios API Calls

2. Backend Layer

   * Routes
   * Controllers
   * Authentication Middleware
   * Authorization Middleware

3. Database Layer

   * Users Table
   * Stores Table
   * Ratings Table

JWT authentication is used for securing APIs and role-based access control is implemented for Admin and Store Owner functionality.
