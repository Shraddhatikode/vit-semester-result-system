# VIT Student Semester Result Preparation System

A full-stack web application designed for Vishwakarma Institute of Technology (VIT) faculty and administrators to calculate, store, search, and manage student 4-subject semester results. Built with **Spring Boot**, **Spring Data JPA / Hibernate**, **MySQL**, and a responsive **Bootstrap 5 & Vanilla JS** frontend.

---

## Key Features

1. **Automatic Result Calculation Engine (Backend)**:
   - Evaluates 4 subjects: **Data Structures**, **Database Management Systems**, **Operating Systems**, and **Theory of Computation**.
   - Formula: $\text{Final Marks} = \text{MSE} + (\text{ESE} \times 0.70)$ (MSE out of 30, ESE out of 100).
   - Grade mapping ($O, A+, A, B+, B, C, F$) and Grade Point ($10, 9, 8, 7, 6, 5, 0$).
   - Calculates total credits (16 default), total marks (/400), SGPA ($\Sigma(\text{Credit} \times \text{Grade Point}) / \Sigma \text{Credits}$), and Pass/Fail result status.
2. **Interactive Academic Dashboard**:
   - Live metrics: Total Students, Total Results, Average SGPA, and Pass Percentage.
   - Pass vs Fail distribution bar and recent result submission table.
3. **Official VIT Marksheet Sheet**:
   - Printable academic report card layout matching VIT Autonomous format.
   - Includes browser print styling (`@media print`) and PDF download support.
4. **Search & Database Management**:
   - Search by PRN or Student Name.
   - Full CRUD operations with REST APIs.

---

## Technology Stack

- **Backend**: Java 17+, Spring Boot 3.2.5 (Web, Data JPA, Validation)
- **Database**: MySQL 8.x (Database name: `vit_result`) with fallback support
- **ORM / Persistence**: Hibernate / Spring Data JPA
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (Fetch API)
- **Build Tool**: Apache Maven (Wrapper included: `mvnw` / `mvnw.cmd`)

---

## Database Setup (MySQL)

Execute the following commands in MySQL Workbench or Command Line:

```sql
CREATE DATABASE IF NOT EXISTS vit_result;
USE vit_result;

-- Students Table
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

-- Subject Results Table
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
```

---

## Application Configuration

Configure your MySQL username and password in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vit_result?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

---

## How to Run the Application

### Option A: Using Maven Wrapper (Windows / PowerShell)
```powershell
.\mvnw.cmd spring-boot:run
```

### Option B: Using Installed Maven
```bash
mvn spring-boot:run
```

### Accessing the Web Application
Open your browser and navigate to:
```text
http://localhost:8080
```

---

## Test Student Data & Sample Calculation

### Test Student 1 (Rahul Sharma - PASS)
- **PRN**: `22110045`
- **Name**: Rahul Sharma
- **Branch**: Computer Engineering
- **Semester**: 4

**Subject Marks**:
1. **Data Structures (CS201 - 4 Credits)**: MSE = 24, ESE = 80
   - $\text{Final Marks} = 24 + (80 \times 0.70) = 80.0$ $\rightarrow$ **Grade A+**, **Grade Point 9**
2. **Database Management Systems (CS202 - 4 Credits)**: MSE = 27, ESE = 90
   - $\text{Final Marks} = 27 + (90 \times 0.70) = 90.0$ $\rightarrow$ **Grade O**, **Grade Point 10**
3. **Operating Systems (CS203 - 4 Credits)**: MSE = 21, ESE = 70
   - $\text{Final Marks} = 21 + (70 \times 0.70) = 70.0$ $\rightarrow$ **Grade A**, **Grade Point 8**
4. **Theory of Computation (CS204 - 4 Credits)**: MSE = 18, ESE = 60
   - $\text{Final Marks} = 18 + (60 \times 0.70) = 60.0$ $\rightarrow$ **Grade B+**, **Grade Point 7**

**Expected Results**:
- **Total Marks**: 300.0 / 400
- **Total Weighted Grade Points**: $(4 \times 9) + (4 \times 10) + (4 \times 8) + (4 \times 7) = 36 + 40 + 32 + 28 = 136$
- **SGPA**: $136 / 16 = \mathbf{8.50}$
- **Result Status**: **PASS**

---

## List of REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students` | Create student record & calculate results |
| `GET` | `/api/students` | List all students with total marks & SGPA |
| `GET` | `/api/students/{prn}` | Fetch full student mark sheet breakdown by PRN |
| `GET` | `/api/students/id/{id}` | Fetch student record by Database ID |
| `GET` | `/api/students/search?query={q}` | Search students by PRN or Name |
| `PUT` | `/api/students/{id}` | Update student details & marks (re-calculates result) |
| `DELETE` | `/api/students/{id}` | Delete student and associated subject results |
| `POST` | `/api/results` | Save new result record |
| `GET` | `/api/results/{prn}` | Retrieve result by PRN |
| `PUT` | `/api/results/{id}` | Update result record |
| `DELETE` | `/api/results/{id}` | Delete result record |
| `GET` | `/api/dashboard/stats` | Fetch Dashboard performance metrics |

---

## Project Directory Structure

```text
WT assignment-5/
├── pom.xml
├── schema.sql
├── README.md
├── mvnw.cmd
├── .mvn/
│   └── wrapper/
│       ├── maven-wrapper.jar
│       └── maven-wrapper.properties
└── src/
    └── main/
        ├── java/
        │   └── com/vit/result/
        │       ├── VitResultApplication.java
        │       ├── controller/
        │       │   ├── StudentController.java
        │       │   ├── ResultController.java
        │       │   └── DashboardController.java
        │       ├── dto/
        │       │   ├── StudentResultRequestDTO.java
        │       │   ├── SubjectMarkDTO.java
        │       │   ├── StudentResultResponseDTO.java
        │       │   ├── SubjectResultResponseDTO.java
        │       │   └── DashboardStatsDTO.java
        │       ├── entity/
        │       │   ├── Student.java
        │       │   └── SubjectResult.java
        │       ├── exception/
        │       │   ├── ResourceNotFoundException.java
        │       │   ├── DuplicateResourceException.java
        │       │   ├── ErrorResponse.java
        │       │   └── GlobalExceptionHandler.java
        │       ├── repository/
        │       │   ├── StudentRepository.java
        │       │   └── SubjectResultRepository.java
        │       └── service/
        │           ├── ResultCalculationService.java
        │           └── StudentService.java
        └── resources/
            ├── application.properties
            └── static/
                ├── index.html
                ├── css/
                │   └── style.css
                └── js/
                    └── app.js
```
