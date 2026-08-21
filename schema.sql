-- MySQL Database Setup Script for VIT Student Semester Result System
-- Database Name: vit_result

CREATE DATABASE IF NOT EXISTS vit_result;
USE vit_result;

-- Table: students
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prn VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    total_marks DOUBLE DEFAULT 0.0,
    sgpa DOUBLE DEFAULT 0.0,
    result_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: subject_results
CREATE TABLE IF NOT EXISTS subject_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    mse DOUBLE NOT NULL,
    ese DOUBLE NOT NULL,
    final_marks DOUBLE NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point INT NOT NULL,
    CONSTRAINT fk_student_result FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_student_prn ON students(prn);
CREATE INDEX idx_student_name ON students(name);
