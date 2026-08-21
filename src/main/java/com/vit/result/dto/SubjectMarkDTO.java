package com.vit.result.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubjectMarkDTO {

    private String subjectCode;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits = 4;

    @NotNull(message = "MSE marks are required")
    @Min(value = 0, message = "MSE marks cannot be less than 0")
    @Max(value = 30, message = "MSE marks cannot exceed 30")
    private Double mse;

    @NotNull(message = "ESE marks are required")
    @Min(value = 0, message = "ESE marks cannot be less than 0")
    @Max(value = 100, message = "ESE marks cannot exceed 100")
    private Double ese;

    public SubjectMarkDTO() {
    }

    public SubjectMarkDTO(String subjectCode, String subjectName, Integer credits, Double mse, Double ese) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.mse = mse;
        this.ese = ese;
    }

    // Getters and Setters
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
        return credits != null ? credits : 4;
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
}
