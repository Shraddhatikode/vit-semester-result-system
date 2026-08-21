package com.vit.result.repository;

import com.vit.result.entity.SubjectResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectResultRepository extends JpaRepository<SubjectResult, Long> {

    List<SubjectResult> findByStudentId(Long studentId);

    void deleteByStudentId(Long studentId);
}
