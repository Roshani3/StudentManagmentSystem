# 🎓 Student Management System

A full-stack **Student Management System** built with **ASP.NET Core Web API** (Backend) and **Angular 17** (Frontend).

---

## 📁 Project Structure

```
StudentManagementSystem/
│
├── StudentManagementSystem.Backend/
│   ├── Controllers/          → AuthController, StudentsController
│   ├── Services/             → IStudentService, StudentService, IAuthService, AuthService
│   ├── Repositories/         → IStudentRepository, StudentRepository, IUserRepository, UserRepository
│   ├── Models/               → Student.cs, User.cs
│   ├── DTOs/                 → StudentDto.cs (all request/response DTOs)
│   ├── Middleware/           → GlobalExceptionMiddleware.cs
│   ├── Data/                 → AppDbContext.cs (EF Core)
│   ├── Migrations/           → EF Core migration files
│   ├── Program.cs            → App startup, DI, JWT, Serilog, Swagger
│   └── appsettings.json      → Connection string, JWT config
│
├── StudentManagementSystem.Frontend/
│   └── src/app/
│       ├── components/
│       │   ├── login/        → Login & Register page
│       │   ├── dashboard/    → Stats & recent students
│       │   ├── student-list/ → Full CRUD table with modal
│       │   └── navbar/       → Top navigation bar
│       ├── services/         → student.service.ts, auth.service.ts
│       ├── models/           → student.model.ts (TypeScript interfaces)
│       ├── auth/             → jwt.interceptor.ts
│       ├── guards/           → auth.guard.ts
│       ├── app.routes.ts     → Angular router config
│       └── app.config.ts     → App providers (HTTP, Router, Animations)
│
├── Database/
│   └── setup.sql             → Manual SQL Server setup script
│
└── README.md
```

---

## ✅ Features Implemented

| Feature | Status |
|---|---|
| JWT Authentication (Login/Register) | ✅ |
| Get All Students | ✅ |
| Add New Student | ✅ |
| Update Student | ✅ |
| Delete Student | ✅ |
| Global Exception Middleware | ✅ |
| Serilog Logging (Console + File) | ✅ |
| Swagger API Documentation | ✅ |
| Layered Architecture (Controller → Service → Repository) | ✅ |
| SQL Server with EF Core + Migrations | ✅ |
| Angular 17 Frontend with Auth Guard | ✅ |
| CORS Configuration | ✅ |

---

## 🗄️ Database Schema

### Students Table
| Column | Type | Description |
|---|---|---|
| Id | INT (PK, Identity) | Auto-increment primary key |
| Name | NVARCHAR(100) | Student full name |
| Email | NVARCHAR(150) UNIQUE | Student email address |
| Age | INT | Student age (1–120) |
| Course | NVARCHAR(100) | Enrolled course |
| CreatedDate | DATETIME2 | Auto-set on creation |

---

## ⚙️ Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) & npm
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (LocalDB, Express, or full)

---

## 🚀 Backend Setup

### 1. Configure the Connection String
Edit `StudentManagementSystem.Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=StudentManagementDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> For SQL Server with username/password:
> `"Server=.\\SQLEXPRESS;Database=StudentManagementDB;User Id=sa;Password=YourPass;TrustServerCertificate=True;"`

### 2. Restore Packages & Run Migrations

```bash
cd StudentManagementSystem.Backend

# Restore NuGet packages
dotnet restore

# Apply EF Core migrations (auto-creates database + tables + seed data)
dotnet ef database update

# Run the API
dotnet run
```

The API will start at: **https://localhost:5002**

### 3. Access Swagger UI
Open: [https://localhost:5002/swagger](https://localhost:5002/swagger)

---

## 🌐 Frontend Setup

```bash
cd StudentManagementSystem.Frontend

# Install dependencies
npm install

# Start development server
ng serve
```

Open: [http://localhost:4200](http://localhost:4200)

---

## 🔐 Default Credentials

| Username | Password | Role |
|---|---|---|
| admin | Admin@123 | Admin |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/login | Login and get JWT token | ❌ |
| POST | /api/auth/register | Register a new user | ❌ |

### Students
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /api/students | Get all students | ✅ |
| GET | /api/students/{id} | Get student by ID | ✅ |
| POST | /api/students | Create new student | ✅ |
| PUT | /api/students/{id} | Update student | ✅ |
| DELETE | /api/students/{id} | Delete student | ✅ |

### Sample Request: Login
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "Admin@123"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin",
    "role": "Admin",
    "expiration": "2024-12-31T00:00:00Z"
  }
}
```

---

## 🏗️ Architecture

```
HTTP Request
    ↓
[Controller]       → Validates input, returns HTTP responses
    ↓
[Service]          → Business logic, validation rules
    ↓
[Repository]       → Data access via Entity Framework Core
    ↓
[SQL Server DB]    → Persistent data storage
```

**Middleware pipeline:**
```
Request → GlobalExceptionMiddleware → Auth → Controller → Response
```

---

## 📝 Logging

Logs are written to:
- **Console** (Development)
- **File**: `Logs/app-YYYYMMDD.log` (rolling daily)

Log levels are configured via `appsettings.json` under the `Serilog` section.

---

## 🛠️ Technologies Used

**Backend:**
- ASP.NET Core 8 Web API
- Entity Framework Core 8 (SQL Server)
- JWT Bearer Authentication
- Serilog (logging)
- Swashbuckle (Swagger UI)
- BCrypt.Net (password hashing)

**Frontend:**
- Angular 17 (Standalone Components)
- Angular Router with Guards
- HTTP Interceptors (JWT injection)
- Reactive Forms + Template-driven Forms

---

## 📌 Notes

- The JWT secret key in `appsettings.json` should be changed in production.
- EF Core migrations auto-run on startup via `db.Database.Migrate()` in `Program.cs`.
- CORS is configured to allow `http://localhost:4200` (Angular dev server).
- The `Database/setup.sql` script can be used as an alternative to EF migrations for manual setup.
