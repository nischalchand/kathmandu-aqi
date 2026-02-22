package com.aqiapp.kathmanduaqi.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserAirExposureRepository extends JpaRepository<UserAirExposure, Long> {
    List<UserAirExposure> findByUserIdOrderByExposedAtDesc(Long userId);
}