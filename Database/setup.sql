-- ============================================================
-- Student Management System - SQL Server Setup Script
-- Run this if you prefer manual DB setup over EF Migrations
-- ============================================================

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'StudentManagementDB')
BEGIN
    CREATE DATABASE StudentManagementDB;
    PRINT 'Database StudentManagementDB created.';
END
GO

USE StudentManagementDB;
GO

-- Students Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Students')
BEGIN
    CREATE TABLE Students (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        Name        NVARCHAR(100) NOT NULL,
        Email       NVARCHAR(150) NOT NULL UNIQUE,
        Age         INT NOT NULL CHECK (Age BETWEEN 1 AND 120),
        Course      NVARCHAR(100) NOT NULL,
        CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    PRINT 'Table Students created.';
END
GO

-- Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Username     NVARCHAR(100) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Role         NVARCHAR(50)  NOT NULL DEFAULT 'User'
    );
    PRINT 'Table Users created.';
END
GO

-- Seed Admin User (Password: Admin@123)
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, PasswordHash, Role)
    VALUES ('admin', '$2a$11$rBnKMHDvmHnpKHYCKkVoHOqLzCTjRGxgvuRe5Q6vGJ3b2XjYFVsRi', 'Admin');
    PRINT 'Admin user seeded.';
END
GO

-- Seed Sample Students
IF NOT EXISTS (SELECT * FROM Students WHERE Email = 'aarav@example.com')
BEGIN
    INSERT INTO Students (Name, Email, Age, Course, CreatedDate) VALUES
    ('Aarav Shah',    'aarav@example.com',  20, 'Computer Science',      '2024-01-15'),
    ('Priya Mehta',   'priya@example.com',  22, 'Data Science',          '2024-02-10'),
    ('Rohan Desai',   'rohan@example.com',  21, 'Mechanical Engineering','2024-03-05'),
    ('Sneha Patel',   'sneha@example.com',  19, 'Information Technology','2024-04-01'),
    ('Vikram Nair',   'vikram@example.com', 23, 'Electronics',           '2024-04-20');
    PRINT 'Sample students seeded.';
END
GO

PRINT '=== Setup Complete! ===';
GO
