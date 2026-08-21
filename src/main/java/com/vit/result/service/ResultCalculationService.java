package com.vit.result.service;

import com.vit.result.dto.SubjectMarkDTO;
import com.vit.result.entity.Student;
import com.vit.result.entity.SubjectResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResultCalculationService {

    /**
     * Calculates final marks, grades, grade points, total marks, SGPA and result status.
     */
    public List<SubjectResult> calculateSubjectResults(Student student, List<SubjectMarkDTO> subjectMarkDTOs) {
        List<SubjectResult> subjectResults = new ArrayList<>();
        double totalWeightedGradePoints = 0.0;
        int totalCredits = 0;
        double sumFinalMarks = 0.0;
        boolean hasFailedSubject = false;

        for (SubjectMarkDTO dto : subjectMarkDTOs) {
            double mse = dto.getMse() != null ? dto.getMse() : 0.0;
            double ese = dto.getEse() != null ? dto.getEse() : 0.0;
            int credits = (dto.getCredits() != null && dto.getCredits() > 0) ? dto.getCredits() : 4;

            // Final Marks Formula: MSE + (ESE * 0.70)
            double rawFinalMarks = mse + (ese * 0.70);
            double finalMarks = round(rawFinalMarks, 2);
            sumFinalMarks += finalMarks;

            // Determine Grade and Grade Point
            String grade;
            int gradePoint;

            if (finalMarks >= 90.0) {
                grade = "O";
                gradePoint = 10;
            } else if (finalMarks >= 80.0) {
                grade = "A+";
                gradePoint = 9;
            } else if (finalMarks >= 70.0) {
                grade = "A";
                gradePoint = 8;
            } else if (finalMarks >= 60.0) {
                grade = "B+";
                gradePoint = 7;
            } else if (finalMarks >= 50.0) {
                grade = "B";
                gradePoint = 6;
            } else if (finalMarks >= 40.0) {
                grade = "C";
                gradePoint = 5;
            } else {
                grade = "F";
                gradePoint = 0;
                hasFailedSubject = true;
            }

            totalWeightedGradePoints += (credits * gradePoint);
            totalCredits += credits;

            SubjectResult result = new SubjectResult();
            result.setStudent(student);
            result.setSubjectCode(dto.getSubjectCode() != null ? dto.getSubjectCode() : getSubjectCodeByName(dto.getSubjectName()));
            result.setSubjectName(dto.getSubjectName());
            result.setCredits(credits);
            result.setMse(round(mse, 2));
            result.setEse(round(ese, 2));
            result.setFinalMarks(finalMarks);
            result.setGrade(grade);
            result.setGradePoint(gradePoint);

            subjectResults.add(result);
        }

        // Calculate SGPA = Σ(Credit × Grade Point) / Σ Credits
        double rawSgpa = totalCredits > 0 ? totalWeightedGradePoints / totalCredits : 0.0;
        double sgpa = round(rawSgpa, 2);

        student.setTotalMarks(round(sumFinalMarks, 2));
        student.setSgpa(sgpa);
        student.setResultStatus(hasFailedSubject ? "FAIL" : "PASS");

        return subjectResults;
    }

    private String getSubjectCodeByName(String subjectName) {
        if (subjectName == null) return "SUB101";
        switch (subjectName.trim()) {
            case "Data Structures":
                return "CS201";
            case "Database Management Systems":
                return "CS202";
            case "Operating Systems":
                return "CS203";
            case "Theory of Computation":
                return "CS204";
            default:
                return "CS" + Math.abs(subjectName.hashCode() % 900 + 100);
        }
    }

    private double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
