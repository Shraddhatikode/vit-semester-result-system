package com.vit.result.controller;

import com.vit.result.dto.StudentResultRequestDTO;
import com.vit.result.dto.StudentResultResponseDTO;
import com.vit.result.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final StudentService studentService;

    @Autowired
    public ResultController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<StudentResultResponseDTO> saveResult(@Valid @RequestBody StudentResultRequestDTO requestDTO) {
        StudentResultResponseDTO saved = studentService.saveStudentResult(requestDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{prn}")
    public ResponseEntity<StudentResultResponseDTO> getResultByPrn(@PathVariable String prn) {
        return ResponseEntity.ok(studentService.getStudentByPrn(prn));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResultResponseDTO> updateResult(@PathVariable Long id, @Valid @RequestBody StudentResultRequestDTO requestDTO) {
        return ResponseEntity.ok(studentService.updateStudentResult(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
