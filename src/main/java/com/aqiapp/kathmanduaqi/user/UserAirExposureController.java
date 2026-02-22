package com.aqiapp.kathmanduaqi.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/exposure")
public class UserAirExposureController {

    private final UserAirExposureService userAirExposureService;

    public UserAirExposureController(UserAirExposureService userAirExposureService) {
        this.userAirExposureService = userAirExposureService;
    }

    @PostMapping("/log")
    public ResponseEntity<?> logExposure(@RequestBody Map<String, String> body) {
        try {
            UserAirExposure exposure = userAirExposureService.logExposure(
                Long.parseLong(body.get("userId")),
                body.get("location"),
                Double.parseDouble(body.get("aqi")),
                Integer.parseInt(body.get("durationMinutes"))
            );
            return ResponseEntity.ok(Map.of(
                "message", "Exposure logged successfully",
                "location", exposure.getLocation(),
                "aqi", exposure.getAqi().toString(),
                "durationMinutes", exposure.getDurationMinutes().toString(),
                "exposedAt", exposure.getExposedAt().toString()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserExposures(@PathVariable Long userId) {
        return ResponseEntity.ok(userAirExposureService.getUserExposures(userId));
    }
}