package com.aqiapp.kathmanduaqi;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of(
            "message", "Kathmandu AQI API is running!",
            "endpoints", "/api/aqi/kathmandu, /api/users/register, /api/users/login, /api/symptoms/log, /api/exposure/log, /api/admin/users"
        ));
    }
}