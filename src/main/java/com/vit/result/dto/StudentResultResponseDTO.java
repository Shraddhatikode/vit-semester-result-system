package com.vit.result.dto;

import java.time.LocalDateTime;
import java.util.List;

public class StudentResultResponseDTO {

    private Long id;
    private String prn;
    private String name;
    private String branch;
    private Integer semester;
    private Double totalMarks;
    private Double sgpa;
    private String resultStatus;
    private LocalDateTime createdAt;
    private List<SubjectResultResponseDTO> subjectResults;

    public StudentResultResponseDTO() {
    }

    public StudentResultResponseDTO(Long id, String prn, String name, String branch, Integer semester, Double totalMarks, Double sgpa, String resultStatus, LocalDateTime createdAt, List<SubjectResultResponseDTO> subjectResults) {
        this.id = id;
        this.prn = prn;
        this.name = name;
        this.branch = branch;
        this.semester = semester;
        this.totalMarks = totalMarks;
        this.sgpa = sgpa;
        this.resultStatus = resultStatus;
        this.createdAt = createdAt;
        this.subjectResults = subjectResults;
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

    public List<SubjectResultResponseDTO> getSubjectResults() {
        return subjectResults;
    }

    public void setSubjectResults(List<SubjectResultResponseDTO> subjectResults) {
        this.subjectResults = subjectResults;
    }
}
