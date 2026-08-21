package com.vit.result.service;

import com.vit.result.dto.*;
import com.vit.result.entity.Student;
import com.vit.result.entity.SubjectResult;
import com.vit.result.exception.DuplicateResourceException;
import com.vit.result.exception.ResourceNotFoundException;
import com.vit.result.repository.StudentRepository;
import com.vit.result.repository.SubjectResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final SubjectResultRepository subjectResultRepository;
    private final ResultCalculationService calculationService;

    @Autowired
    public StudentService(StudentRepository studentRepository,
                          SubjectResultRepository subjectResultRepository,
                          ResultCalculationService calculationService) {
        this.studentRepository = studentRepository;
        this.subjectResultRepository = subjectResultRepository;
        this.calculationService = calculationService;
    }

    @Transactional
    public StudentResultResponseDTO saveStudentResult(StudentResultRequestDTO requestDTO) {
        String cleanPrn = requestDTO.getPrn().trim();
        
        // If student exists, update or throw exception
        Optional<Student> existingOpt = studentRepository.findByPrn(cleanPrn);
        Student student;

        if (existingOpt.isPresent()) {
            student = existingOpt.get();
            student.setName(requestDTO.getName().trim());
            student.setBranch(requestDTO.getBranch().trim());
            student.setSemester(requestDTO.getSemester());
            student.clearSubjectResults();
        } else {
            student = new Student(cleanPrn, requestDTO.getName().trim(), requestDTO.getBranch().trim(), requestDTO.getSemester());
        }

        List<SubjectResult> calculatedResults = calculationService.calculateSubjectResults(student, requestDTO.getSubjects());
        for (SubjectResult sr : calculatedResults) {
            student.addSubjectResult(sr);
        }

        Student savedStudent = studentRepository.save(student);
        return mapToResponseDTO(savedStudent);
    }

    @Transactional(readOnly = true)
    public List<StudentResultResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResultResponseDTO getStudentByPrn(String prn) {
        Student student = studentRepository.findByPrn(prn.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with PRN: " + prn));
        return mapToResponseDTO(student);
    }

    @Transactional(readOnly = true)
    public StudentResultResponseDTO getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToResponseDTO(student);
    }

    @Transactional(readOnly = true)
    public List<StudentResultResponseDTO> searchStudents(String query) {
        String trimmed = query.trim();
        return studentRepository.findByNameContainingIgnoreCaseOrPrnContainingIgnoreCase(trimmed, trimmed).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional
    public StudentResultResponseDTO updateStudentResult(Long id, StudentResultRequestDTO requestDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        // Check PRN collision if PRN is changed
        if (!student.getPrn().equalsIgnoreCase(requestDTO.getPrn().trim())) {
            if (studentRepository.existsByPrn(requestDTO.getPrn().trim())) {
                throw new DuplicateResourceException("Another student with PRN " + requestDTO.getPrn() + " already exists.");
            }
            student.setPrn(requestDTO.getPrn().trim());
        }

        student.setName(requestDTO.getName().trim());
        student.setBranch(requestDTO.getBranch().trim());
        student.setSemester(requestDTO.getSemester());

        student.clearSubjectResults();
        List<SubjectResult> calculatedResults = calculationService.calculateSubjectResults(student, requestDTO.getSubjects());
        for (SubjectResult sr : calculatedResults) {
            student.addSubjectResult(sr);
        }

        Student savedStudent = studentRepository.save(student);
        return mapToResponseDTO(savedStudent);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalResults = totalStudents; // Each student has a semester result record
        Double avgSgpaObj = studentRepository.findAverageSgpa();
        double avgSgpa = avgSgpaObj != null ? round(avgSgpaObj, 2) : 0.0;

        long passedCount = studentRepository.countPassedStudents();
        long failedCount = studentRepository.countFailedStudents();

        double passPercentage = totalStudents > 0 ? round(((double) passedCount / totalStudents) * 100.0, 2) : 0.0;

        return new DashboardStatsDTO(totalStudents, totalResults, avgSgpa, passPercentage, passedCount, failedCount);
    }

    private StudentResultResponseDTO mapToResponseDTO(Student student) {
        List<SubjectResultResponseDTO> subjectDTOs = student.getSubjectResults().stream()
                .map(sr -> new SubjectResultResponseDTO(
                        sr.getId(),
                        sr.getSubjectCode(),
                        sr.getSubjectName(),
                        sr.getCredits(),
                        sr.getMse(),
                        sr.getEse(),
                        sr.getFinalMarks(),
                        sr.getGrade(),
                        sr.getGradePoint()
                ))
                .collect(Collectors.toList());

        return new StudentResultResponseDTO(
                student.getId(),
                student.getPrn(),
                student.getName(),
                student.getBranch(),
                student.getSemester(),
                student.getTotalMarks(),
                student.getSgpa(),
                student.getResultStatus(),
                student.getCreatedAt(),
                subjectDTOs
        );
    }

    private double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
