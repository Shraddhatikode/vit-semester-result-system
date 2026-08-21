package com.vit.result.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class StudentResultRequestDTO {

    @NotBlank(message = "PRN is required")
    private String prn;

    @NotBlank(message = "Student Name is required")
    private String name;

    @NotBlank(message = "Branch is required")
    private String branch;

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester;

    @NotEmpty(message = "At least one subject mark is required")
    @Valid
    private List<SubjectMarkDTO> subjects;

    public StudentResultRequestDTO() {
    }

    public StudentResultRequestDTO(String prn, String name, String branch, Integer semester, List<SubjectMarkDTO> subjects) {
        this.prn = prn;
        this.name = name;
        this.branch = branch;
        this.semester = semester;
        this.subjects = subjects;
    }

    // Getters and Setters
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

    public List<SubjectMarkDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectMarkDTO> subjects) {
        this.subjects = subjects;
    }
}
