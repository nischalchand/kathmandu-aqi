package com.aqiapp.kathmanduaqi.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/symptoms")
public class SymptomLogController {

    private final SymptomLogService symptomLogService;

    public SymptomLogController(SymptomLogService symptomLogService) {
        this.symptomLogService = symptomLogService;
    }

    @PostMapping("/log")
    public ResponseEntity<?> logSymptom(@RequestBody Map<String, String> body) {
        try {
            SymptomLog log = symptomLogService.logSymptom(
                Long.parseLong(body.get("userId")),
                body.get("symptom"),
                body.get("severity"),
                body.get("notes")
            );
            return ResponseEntity.ok(Map.of(
                "message", "Symptom logged successfully",
                "symptom", log.getSymptom(),
                "severity", log.getSeverity(),
                "loggedAt", log.getLoggedAt().toString()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLogs(@PathVariable Long userId) {
        return ResponseEntity.ok(symptomLogService.getUserLogs(userId));
    }
}