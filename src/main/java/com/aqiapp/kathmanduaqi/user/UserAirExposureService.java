package com.aqiapp.kathmanduaqi.user;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserAirExposureService {

    private final UserAirExposureRepository userAirExposureRepository;
    private final UserRepository userRepository;

    public UserAirExposureService(UserAirExposureRepository userAirExposureRepository, UserRepository userRepository) {
        this.userAirExposureRepository = userAirExposureRepository;
        this.userRepository = userRepository;
    }

    public UserAirExposure logExposure(Long userId, String location, Double aqi, Integer durationMinutes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        UserAirExposure exposure = new UserAirExposure();
        exposure.setUser(user);
        exposure.setLocation(location);
        exposure.setAqi(aqi);
        exposure.setDurationMinutes(durationMinutes);
        return userAirExposureRepository.save(exposure);
    }

    public List<UserAirExposure> getUserExposures(Long userId) {
        return userAirExposureRepository.findByUserIdOrderByExposedAtDesc(userId);
    }
}