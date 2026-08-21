package com.vit.result.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "prn", nullable = false, unique = true, length = 50)
    private String prn;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "branch", nullable = false, length = 50)
    private String branch;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "total_marks")
    private Double totalMarks = 0.0;

    @Column(name = "sgpa")
    private Double sgpa = 0.0;

    @Column(name = "result_status", length = 20)
    private String resultStatus = "PENDING"; // PASS or FAIL

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SubjectResult> subjectResults = new ArrayList<>();

    public Student() {
        this.createdAt = LocalDateTime.now();
    }

    public Student(String prn, String name, String branch, Integer semester) {
        this.prn = prn;
        this.name = name;
        this.branch = branch;
        this.semester = semester;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Helper methods for cascading relationship
    public void addSubjectResult(SubjectResult subjectResult) {
        subjectResults.add(subjectResult);
        subjectResult.setStudent(this);
    }

    public void clearSubjectResults() {
        for (SubjectResult sr : subjectResults) {
            sr.setStudent(null);
        }
        subjectResults.clear();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrn() {
        return prn;
    }

    public void setPrn(String prn) {
        this.prn = prn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Double getSgpa() {
        return sgpa;
    }

    public void setSgpa(Double sgpa) {
        this.sgpa = sgpa;
    }

    public String getResultStatus() {
        return resultStatus;
    }

    public void setResultStatus(String resultStatus) {
        this.resultStatus = resultStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<SubjectResult> getSubjectResults() {
        return subjectResults;
    }

    public void setSubjectResults(List<SubjectResult> subjectResults) {
        this.subjectResults = subjectResults;
    }
}
