package com.vit.result.controller;

import com.vit.result.dto.StudentResultRequestDTO;
import com.vit.result.dto.StudentResultResponseDTO;
import com.vit.result.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<StudentResultResponseDTO> createStudentResult(@Valid @RequestBody StudentResultRequestDTO requestDTO) {
        StudentResultResponseDTO created = studentService.saveStudentResult(requestDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentResultResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{prn}")
    public ResponseEntity<StudentResultResponseDTO> getStudentByPrn(@PathVariable String prn) {
        return ResponseEntity.ok(studentService.getStudentByPrn(prn));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<StudentResultResponseDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResultResponseDTO>> searchStudents(@RequestParam("query") String query) {
        return ResponseEntity.ok(studentService.searchStudents(query));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResultResponseDTO> updateStudentResult(@PathVariable Long id, @Valid @RequestBody StudentResultRequestDTO requestDTO) {
        return ResponseEntity.ok(studentService.updateStudentResult(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
