package com.vit.result.dto;

public class SubjectResultResponseDTO {

    private Long id;
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Double mse;
    private Double ese;
    private Double finalMarks;
    private String grade;
    private Integer gradePoint;

    public SubjectResultResponseDTO() {
    }

    public SubjectResultResponseDTO(Long id, String subjectCode, String subjectName, Integer credits, Double mse, Double ese, Double finalMarks, String grade, Integer gradePoint) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.mse = mse;
        this.ese = ese;
        this.finalMarks = finalMarks;
        this.grade = grade;
        this.gradePoint = gradePoint;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Double getMse() {
        return mse;
    }

    public void setMse(Double mse) {
        this.mse = mse;
    }

    public Double getEse() {
        return ese;
    }

    public void setEse(Double ese) {
        this.ese = ese;
    }

    public Double getFinalMarks() {
        return finalMarks;
    }

    public void setFinalMarks(Double finalMarks) {
        this.finalMarks = finalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getGradePoint() {
        return gradePoint;
    }

    public void setGradePoint(Integer gradePoint) {
        this.gradePoint = gradePoint;
    }
}
