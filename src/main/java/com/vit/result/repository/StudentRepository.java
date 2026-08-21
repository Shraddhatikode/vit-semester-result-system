package com.vit.result.repository;

import com.vit.result.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByPrn(String prn);

    boolean existsByPrn(String prn);

    List<Student> findByNameContainingIgnoreCaseOrPrnContainingIgnoreCase(String name, String prn);

    @Query("SELECT AVG(s.sgpa) FROM Student s")
    Double findAverageSgpa();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.resultStatus = 'PASS'")
    long countPassedStudents();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.resultStatus = 'FAIL'")
    long countFailedStudents();
}
