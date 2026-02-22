package com.aqiapp.kathmanduaqi.user;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SymptomLogService {

    private final SymptomLogRepository symptomLogRepository;
    private final UserRepository userRepository;

    public SymptomLogService(SymptomLogRepository symptomLogRepository, UserRepository userRepository) {
        this.symptomLogRepository = symptomLogRepository;
        this.userRepository = userRepository;
    }

    public SymptomLog logSymptom(Long userId, String symptom, String severity, String notes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        SymptomLog log = new SymptomLog();
        log.setUser(user);
        log.setSymptom(symptom);
        log.setSeverity(severity);
        log.setNotes(notes);
        return symptomLogRepository.save(log);
    }

    public List<SymptomLog> getUserLogs(Long userId) {
        return symptomLogRepository.findByUserIdOrderByLoggedAtDesc(userId);
    }
}