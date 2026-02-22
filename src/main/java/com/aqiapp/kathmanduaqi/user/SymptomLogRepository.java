package com.aqiapp.kathmanduaqi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SymptomLogRepository extends JpaRepository<SymptomLog, Long> {
    List<SymptomLog> findByUserIdOrderByLoggedAtDesc(Long userId);
}