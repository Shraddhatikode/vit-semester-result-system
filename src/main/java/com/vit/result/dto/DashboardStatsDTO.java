package com.vit.result.dto;

public class DashboardStatsDTO {

    private long totalStudents;
    private long totalResults;
    private double averageSgpa;
    private double passPercentage;
    private long totalPassed;
    private long totalFailed;

    public DashboardStatsDTO() {
    }

    public DashboardStatsDTO(long totalStudents, long totalResults, double averageSgpa, double passPercentage, long totalPassed, long totalFailed) {
        this.totalStudents = totalStudents;
        this.totalResults = totalResults;
        this.averageSgpa = averageSgpa;
        this.passPercentage = passPercentage;
        this.totalPassed = totalPassed;
        this.totalFailed = totalFailed;
    }

    // Getters and Setters
    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }

    public double getAverageSgpa() {
        return averageSgpa;
    }

    public void setAverageSgpa(double averageSgpa) {
        this.averageSgpa = averageSgpa;
    }

    public double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public long getTotalPassed() {
        return totalPassed;
    }

    public void setTotalPassed(long totalPassed) {
        this.totalPassed = totalPassed;
    }

    public long getTotalFailed() {
        return totalFailed;
    }

    public void setTotalFailed(long totalFailed) {
        this.totalFailed = totalFailed;
    }
}
